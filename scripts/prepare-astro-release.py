"""Refresh the committed rule author sources; site building uses npm run build."""
import argparse
import json
from pathlib import Path
import astro_rules

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    refresh = commands.add_parser('refresh'); refresh.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    pin = astro_rules.refresh()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps({'status': 'refreshed', 'version': pin['version']}, ensure_ascii=False, indent=2) + '\n', encoding='utf8')

if __name__ == '__main__': main()
