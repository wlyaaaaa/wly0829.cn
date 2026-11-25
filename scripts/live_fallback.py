"""Validate the site's bundled visitor snapshot against the PCConfig exporter."""
import json
import os
import sys
from datetime import datetime
from pathlib import Path

FALLBACK_POLICY = 'policy-11'


def load_exporter():
    root = os.environ.get('WLY_LIVE_PCCONFIG_ROOT')
    if not root:
        raise ValueError('请将 WLY_LIVE_PCCONFIG_ROOT 设为本次发布的 PCConfig 工作树根目录')
    directory = Path(root).resolve() / 'tools' / 'remote-computer-mcp'
    target = directory / 'export_public_fallback.py'
    if not target.is_file():
        raise ValueError('指定的 PCConfig 工作树缺少实况导出器')
    sys.path.insert(0, str(directory))
    try:
        import export_public_fallback
        if Path(export_public_fallback.__file__).resolve() != target.resolve():
            raise ValueError('本进程已经载入其它工作树的实况导出器')
        return export_public_fallback
    except ImportError as error:
        raise ValueError(f'读不到实况导出器：{error}') from error
    finally:
        sys.path.pop(0)


def valid_body(packet):
    if type(packet.get('v')) is not int or packet['v'] != 1 or not isinstance(packet.get('data'), dict):
        return False
    try:
        datetime.fromisoformat(packet.get('at'))
    except (TypeError, ValueError):
        return False
    return True


def read_checked_fallback(path):
    try:
        data = json.loads(path.read_text('utf-8'))
    except (OSError, ValueError) as error:
        raise ValueError('实况垫底文件 live/_fallback.json 缺失或读不出。发布用的构建要先设 '
                         'WLY_LIVE_FALLBACK_CMD 再 npm run build') from error
    resources = data.get('resources') if isinstance(data, dict) else None
    if not isinstance(resources, dict):
        raise ValueError('实况垫底文件 live/_fallback.json 的 resources 不是对象')
    publication = data.get('publication')
    if not isinstance(publication, dict) or publication.get('policy') != FALLBACK_POLICY:
        raise ValueError(f'实况垫底文件需要 {FALLBACK_POLICY}，请用本次发布的后台重新导出')
    failures = {'缺少入口': [] if 'home' in resources else ['home'], '身份非公开': [], '正文无效': []}
    for name, packet in sorted(resources.items()):
        if not isinstance(packet, dict):
            failures['正文无效'].append(name)
            continue
        viewer = packet.get('viewer')
        if not isinstance(viewer, dict) or viewer.get('kind') != 'public':
            failures['身份非公开'].append(name)
        if not valid_body(packet):
            failures['正文无效'].append(name)
    errors = [f'{reason} {", ".join(names)}' for reason, names in failures.items() if names]
    if errors:
        raise ValueError('实况垫底文件 live/_fallback.json：' + '；'.join(errors))
    check = getattr(load_exporter(), 'check_fallback_publication', None)
    if check is None:
        raise ValueError('实况导出器尚未更新到本次访客规则')
    # metadata_only 显式为 false 是带访客版正文的新包，交导出器按正文逐块复核；其余一律按只有时刻的旧包核（后台 11-25 06:56）
    check(data, require_metadata=data.get('metadata_only') is not False)
    return data
