"""验收工具共用：无窗口 Chrome（Playwright，用本机 Chrome 和显卡）、本地临时服务、打开预览页、截插画框。"""
import contextlib
import functools
import http.server
import os
import threading
import ctypes
import hashlib
import time
import msvcrt
from ctypes import wintypes

import common

RUNTIME = common.ENGINE / "work" / "tmp"
RUNTIME.mkdir(parents=True, exist_ok=True)
for k in ("TEMP", "TMP", "TMPDIR"):
    os.environ[k] = str(RUNTIME)

GPU_ARGS = ["--enable-gpu", "--use-angle=d3d11", "--ignore-gpu-blocklist", "--no-first-run",
            "--no-default-browser-check", "--disable-background-networking"]

LAYOUTS = {
    "h": dict(viewport={"width": 1440, "height": 1000}, device_scale_factor=1),
    "v": dict(viewport={"width": 412, "height": 915}, device_scale_factor=3.5, is_mobile=True, has_touch=True),
}

WAIT_READY = "() => window.living && living.diagnostics && ['live','static'].includes(living.diagnostics().phase)"


def _kernel():
    k = ctypes.WinDLL('kernel32', use_last_error=True)
    k.CreateMutexW.argtypes = [ctypes.c_void_p, wintypes.BOOL, wintypes.LPCWSTR]
    k.CreateMutexW.restype = wintypes.HANDLE
    k.WaitForSingleObject.argtypes = [wintypes.HANDLE, wintypes.DWORD]
    k.ReleaseMutex.argtypes = [wintypes.HANDLE]
    k.CloseHandle.argtypes = [wintypes.HANDLE]
    k.GetCurrentThreadId.restype = wintypes.DWORD
    return k


@contextlib.contextmanager
def _mutex(name):
    k = _kernel()
    handle = k.CreateMutexW(None, False, name)
    if not handle:
        raise ctypes.WinError(ctypes.get_last_error())
    waits = 0
    while True:
        result = k.WaitForSingleObject(handle, 10000)
        if result in (0, 0x80):
            break
        if result != 0x102:
            k.CloseHandle(handle)
            raise ctypes.WinError(ctypes.get_last_error())
        waits += 1
        if waits == 1 or waits % 6 == 0:
            print('等待当前工作副本的 Chrome 验收独占窗口（避免显卡竞争）', flush=True)
    try:
        yield
    finally:
        try:
            if not k.ReleaseMutex(handle):
                raise ctypes.WinError(ctypes.get_last_error())
        finally:
            k.CloseHandle(handle)


def _gate_name():
    return 'Local\\LivingArtChromeGPU-' + hashlib.sha256(str(common.GATE).casefold().encode()).hexdigest()[:16]


@contextlib.contextmanager
def build_lock(art):
    """只串行同一幅画的临时打包；截图本身不持有这把锁。"""
    name = _gate_name() + '-build-' + hashlib.sha256(art.encode()).hexdigest()[:16]
    with _mutex(name):
        yield


class _Overlapped(ctypes.Structure):
    _fields_ = [('Internal', ctypes.c_size_t), ('InternalHigh', ctypes.c_size_t),
                ('Offset', wintypes.DWORD), ('OffsetHigh', wintypes.DWORD), ('hEvent', wintypes.HANDLE)]


@contextlib.contextmanager
def gpu_scope(scope='performance'):
    """定格共享、性能独占。旧 mutex 作入场闸，与仍运行的旧工具兼容。"""
    if scope not in ('capture', 'performance'):
        raise ValueError(f'未知 Chrome 范围：{scope}')
    k = _kernel()
    k.LockFileEx.argtypes = [wintypes.HANDLE, wintypes.DWORD, wintypes.DWORD,
                            wintypes.DWORD, wintypes.DWORD, ctypes.POINTER(_Overlapped)]
    k.UnlockFileEx.argtypes = [wintypes.HANDLE, wintypes.DWORD, wintypes.DWORD,
                              wintypes.DWORD, ctypes.POINTER(_Overlapped)]
    state = {'scope': scope, 'wait_seconds': 0, 'acquired_monotonic': None, 'released': False}
    started = time.monotonic()
    gate = _mutex(_gate_name())
    locked = False
    gate_open = False
    with (RUNTIME / 'gpu-scope.lock').open('a+b') as file:
        handle = wintypes.HANDLE(msvcrt.get_osfhandle(file.fileno()))
        overlap = _Overlapped()
        try:
            gate.__enter__()
            gate_open = True
            flags = 1 | (2 if scope == 'performance' else 0)  # FAIL_IMMEDIATELY / EXCLUSIVE_LOCK
            next_notice = time.monotonic() + 10
            while not k.LockFileEx(handle, flags, 0, 1, 0, ctypes.byref(overlap)):
                error = ctypes.get_last_error()
                if error != 33:  # ERROR_LOCK_VIOLATION
                    raise ctypes.WinError(error)
                if time.monotonic() >= next_notice:
                    print(f'等待 Chrome {scope} 范围；已在跑的定格结束后性能独占', flush=True)
                    next_notice = time.monotonic() + 60
                time.sleep(0.1)
            locked = True
            state['wait_seconds'] = round(time.monotonic() - started, 4)
            state['acquired_monotonic'] = time.monotonic()
            if scope == 'capture':
                gate.__exit__(None, None, None)
                gate_open = False
            yield state
        finally:
            try:
                if locked:
                    if not k.UnlockFileEx(handle, 0, 1, 0, ctypes.byref(overlap)):
                        raise ctypes.WinError(ctypes.get_last_error())
                    state['released'] = True
                    state['released_monotonic'] = time.monotonic()
            finally:
                if gate_open:
                    gate.__exit__(None, None, None)


def launch(pw, args=(), scope='performance'):
    lease = gpu_scope(scope)
    state = lease.__enter__()
    owner_thread = threading.get_ident()
    released = False
    def release():
        nonlocal released
        if released or threading.get_ident() != owner_thread:
            return
        lease.__exit__(None, None, None)
        released = True
    try:
        br = pw.chromium.launch(channel="chrome", headless=True, args=GPU_ARGS + list(args))
    except Exception:
        release(); raise
    http = server(common.GATE)
    http_closed = False
    def cleanup():
        nonlocal http_closed
        try:
            if not http_closed:
                http.__exit__(None, None, None)
                http_closed = True
        finally:
            release()
    try:
        br._preview_base = http.__enter__()
    except Exception:
        try:
            br.close()
        finally:
            release()
        raise
    original_close = br.close
    def close(*a, **kw):
        try:
            if br.is_connected():
                return original_close(*a, **kw)
        finally:
            cleanup()
    br.close = close
    br._living_cleanup = cleanup
    br._living_scope = state
    br._living_resource_state = lambda: {'http_closed': http_closed, 'mutex_release_succeeded': released,
                                       'gpu_scope': dict(state)}
    br.on("disconnected", cleanup)
    return br


@contextlib.contextmanager
def managed(pw, args=(), scope='performance'):
    br = launch(pw, args, scope=scope)
    try:
        yield br
    finally:
        br.close()


def open_preview(br, path, orient, extra=None, reduced=False):
    options = {**LAYOUTS[orient], **(extra or {})}
    cpu_rate = options.pop('cpu_rate', None)
    ctx = br.new_context(**options, reduced_motion="reduce" if reduced else "no-preference")
    try:
        pg = ctx.new_page()
        if cpu_rate:
            pg._cdp = ctx.new_cdp_session(pg)
            pg._cdp.send('Emulation.setCPUThrottlingRate', {'rate': cpu_rate})
        pg._errs = []
        pg.on("pageerror", lambda e: pg._errs.append(str(e)))
        pg.on("console", lambda m: pg._errs.append("console:" + m.text) if m.type in ("error", "warning") else None)
        # 同幅另一个构建会短暂回收 preview/bird；只在本页加载素材时持有构建锁。
        # 素材读完就释放，后续定格仍可和其它 Chrome 并行。
        with build_lock(path.parent.parent.name):
            pg.goto(br._preview_base + "/" + path.resolve().relative_to(common.GATE).as_posix())
            pg.wait_for_load_state('networkidle')
    except BaseException:
        ctx.close()
        raise
    return pg


def wait_ready(pg, timeout=30000):
    pg.wait_for_function(WAIT_READY, timeout=timeout, polling=100)
    return pg.evaluate("() => window.living && living.diagnostics()")


def box_clip(pg, margin=0.04, top=None):
    """插画框在页面上的位置（CSS 像素），四周多留一点；top 是上边额外留多少（框高的占比），给站在上沿的小鸟留地方。"""
    r = pg.evaluate("""([m, t]) => { const p = document.querySelector('.typeset-part:not([hidden])'); const c = window.LIVING_CONFIG; const o = p.dataset.orientation;
      const b = c[o].box, R = p.getBoundingClientRect();
      const x = R.left + b[0]*R.width, y = R.top + b[1]*R.height, w = b[2]*R.width, h = b[3]*R.height;
      const y0 = Math.max(0, y - h*t) + scrollY, x0 = Math.max(0, x - w*m) + scrollX;
      return {x: x0, y: y0, width: Math.min(w*(1+2*m), document.documentElement.scrollWidth - x0), height: (y + h*(1+m) + scrollY) - y0}; }""", [margin, margin if top is None else top])
    return r


def frame_settle(pg):
    pg.evaluate("() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))")


@contextlib.contextmanager
def server(directory, cors_origin=None):
    """本机临时 HTTP 服务。cors_origin：给响应加 Access-Control-Allow-Origin（模拟 OSS 配好跨域许可）。"""
    class H(http.server.SimpleHTTPRequestHandler):
        def copyfile(self, source, outputfile):
            try:
                super().copyfile(source, outputfile)
            except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
                pass  # 浏览器关闭/重载取消传输；实际404与页面资源错误仍照常报告
        def end_headers(self):
            if cors_origin:
                self.send_header("Access-Control-Allow-Origin", cors_origin)
                self.send_header("Vary", "Origin")
            self.send_header("Cache-Control", "no-store")
            super().end_headers()

        def log_message(self, *a):
            pass
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(H, directory=str(directory)))
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    try:
        yield f"http://127.0.0.1:{httpd.server_port}"
    finally:
        httpd.shutdown()
        httpd.server_close()
        t.join(timeout=3)
