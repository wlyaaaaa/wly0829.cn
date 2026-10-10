"""Check reading position in an existing dist; never build or publish.

Use scan_glance.py for visible layout errors. The independent geometry/QA
checks remain in run-typeset-checks.py; this entry keeps the reading matrix.
"""
import argparse
from pathlib import Path
import subprocess
import sys

HERE = Path(__file__).resolve().parent


def main():
    parser = argparse.ArgumentParser(description=__doc__, epilog=
        'Additional check-typeset-reading.py options, including --pages and --chrome, are forwarded.')
    parser.add_argument('--dist', '--root', dest='dist', type=Path, required=True)
    parser.add_argument('--build-report', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--cache', type=Path)
    args, options = parser.parse_known_args()
    dist = args.dist.resolve()
    cache = (args.cache or args.out.parent/'reading-cache').resolve()
    if not dist.is_dir(): parser.error('dist does not exist')
    if not args.build_report.is_file(): parser.error('existing reading plan/build report is required')
    if any(path.is_relative_to(dist) for path in (args.out.resolve(), cache)):
        parser.error('reading reports and browser cache must stay outside read-only dist')
    return subprocess.run([sys.executable, '-B', '-X', 'utf8', str(HERE/'check-typeset-reading.py'),
        '--root', str(dist), '--build-report', str(args.build_report.resolve()),
        '--out', str(args.out.resolve()), '--cache', str(cache), *options],
        creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0)).returncode


if __name__ == '__main__':
    raise SystemExit(main())
