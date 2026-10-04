"""Exercise reading readiness with a delayed or failed real artifact app.

Accepts the ordinary check-typeset-reading.py arguments plus --runtime-transport
and --delay-seconds. Uses installed headless Chrome, exact artifact bytes and
the existing full reading/navigation matrix; no fake runtime or screenshots.
"""
import argparse
import asyncio
import importlib.util
import json
from pathlib import Path
import sys


ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('reading_checker', ROOT / 'scripts/check-typeset-reading.py')
checker = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checker)


def main():
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('--runtime-transport', choices=['delayed', 'blocked'], required=True)
    parser.add_argument('--delay-seconds', type=float, default=0.8)
    transport, remaining = parser.parse_known_args()
    if not 0 < transport.delay_seconds < 10:
        parser.error('--delay-seconds must be between 0 and the unchanged 10-second readiness deadline')
    output_parser = argparse.ArgumentParser(add_help=False)
    output_parser.add_argument('--out', type=Path, required=True)
    output_parser.add_argument('--pages', nargs='+', required=True)
    output, _ = output_parser.parse_known_args(remaining)
    if len(output.pages) != 1:
        output_parser.error('Choose one real artifact page for this bounded regression')
    native_playwright = checker.async_playwright
    transfers = []

    class ControlledTransport:
        def __init__(self):
            self.manager = native_playwright()

        async def __aenter__(self):
            pw = await self.manager.__aenter__()
            native_launch = pw.chromium.launch_persistent_context

            async def launch(*args, **kwargs):
                context = await native_launch(*args, **kwargs)

                async def app_transport(route):
                    transfers.append({'url': route.request.url, 'mode': transport.runtime_transport,
                                      'delay_seconds': transport.delay_seconds if transport.runtime_transport == 'delayed' else 0})
                    if transport.runtime_transport == 'blocked':
                        await route.abort('failed')
                    else:
                        await asyncio.sleep(transport.delay_seconds)
                        await route.continue_()

                await context.route('**/_typeset/runtime/app-*.js*', app_transport)
                return context

            pw.chromium.launch_persistent_context = launch
            return pw

        async def __aexit__(self, *args):
            return await self.manager.__aexit__(*args)

    checker.async_playwright = ControlledTransport
    saved_argv = sys.argv
    checker_exit = 0
    try:
        sys.argv = [str(ROOT / 'scripts/check-typeset-reading.py'), *remaining]
        try:
            checker.main()
        except SystemExit as error:
            checker_exit = error.code
    finally:
        checker.async_playwright = native_playwright
        sys.argv = saved_argv
    result = json.loads(output.out.read_text('utf8'))
    assert transfers, 'No real artifact runtime script was encountered'
    assert result['artifact_unchanged'], 'The regression changed the artifact'
    assert result['profile_cleanup']['exit_code'] == 0, 'Owned Chrome profile cleanup failed'
    if transport.runtime_transport == 'delayed':
        assert checker_exit == 0 and result['status'] == 'pass', result.get('errors')
        matrix = [case for case in result['cases'] if 'requested_screen' in case]
        screens = {case['requested_screen'] for case in matrix}
        assert screens and len(matrix) == len(screens) * 12, 'The full original matrix was not exercised'
        assert len({(tuple(case['from']), tuple(case['to'])) for case in matrix}) == 4
        assert {case['requested_fraction'] for case in matrix} == {0.15, 0.5, 0.85}
        assert any(case.get('kind') == 'rapid-resizes' for case in result['cases'])
        assert not result['response_failures'], 'Actual script responses did not match artifact hashes'
    else:
        assert checker_exit == 1 and result['status'] == 'fail', 'A missing real runtime must fail'
        assert result.get('aborted'), 'The missing runtime was not reported as an abort'
        assert any('Timeout 10000ms' in error for error in result['errors']), result['errors']
        assert not any('ReferenceError' in error for error in result['errors']), result['errors']
        observation = result['failure_observation']
        assert observation['runtime_globals']['resizing'] == 'undefined', observation
        assert observation['runtime_globals']['readingPosition'] == 'undefined', observation
        assert not observation['audit_ready'], observation
    evidence = {'schema': 'wly.typeset-reading-runtime-regression.v1', 'status': 'pass',
                'page': output.pages[0], 'transport': transport.runtime_transport,
                'checker_exit_code': checker_exit, 'checker_status': result['status'],
                'transfers': transfers, 'result': str(output.out.resolve()),
                'verified_at_beijing': result['verified_at_beijing']}
    receipt = output.out.with_name(output.out.stem + '-regression.json')
    receipt.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    print(json.dumps(evidence, ensure_ascii=False), flush=True)


if __name__ == '__main__':
    main()
