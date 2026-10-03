"""Prepare home links, compatible streaming video and the OSS split in order."""
import argparse
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def load(name):
    spec = importlib.util.spec_from_file_location(name.replace('-', '_'), ROOT/(name+'.py'))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def prepare(source, output, bindings, base, prefix, test=False):
    source, output = Path(source).resolve(), Path(output).resolve()
    if output.exists() or source.is_relative_to(output) or output.is_relative_to(source):
        raise ValueError('Preparation requires a new directory disjoint from its source')
    output.mkdir(parents=True)
    home = load('prepare-home-entry-links')
    runtime = load('prepare-oss-runtime')
    assets = load('prepare-oss-release')
    links = home.prepare_links(source, output/'home.html', output/'home-evidence.json')
    video = runtime.prepare(source, output/'runtime', output/'runtime-evidence.json',
                            output/'home.html', links['before_sha256'], Path(bindings))
    plan = assets.prepare(output/'runtime', base, prefix, output/'assets', allow_test=test)
    receipt = {'schema': 'wly.oss-publication-preparation.v1', 'status': 'prepared',
               'prepared_at_beijing': assets.stamp(), 'source_release_id': video['source_release_id'],
               'release_id': plan['release_id'], 'home_changes': len(links['changes']),
               'video_binding': video.get('video_illustration_binding'), 'assets': plan['summary'],
               'runtime_root': str(output/'runtime'), 'asset_preparation': str(output/'assets'),
               'html_ready': False, 'published': False, 'test_only': test}
    assets.write(output/'preparation.json', receipt)
    return receipt


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ('source', 'output', 'video-bindings', 'asset-base-url', 'prefix'):
        parser.add_argument('--'+name, required=True)
    parser.add_argument('--test-loopback', action='store_true')
    args = parser.parse_args()
    receipt = prepare(args.source, args.output, args.video_bindings, args.asset_base_url,
                      args.prefix, args.test_loopback)
    print(json.dumps(receipt, ensure_ascii=False))


if __name__ == '__main__':
    main()
