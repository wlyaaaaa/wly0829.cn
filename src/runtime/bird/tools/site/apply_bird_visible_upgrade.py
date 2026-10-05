"""在集成owner指定的候选中定向更新65页鸟依赖；默认只核差分，不发布。"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from urllib.parse import urljoin, urlsplit

import prepare_living_batch as b

SCRIPT = re.compile(r'<script\b[^>]*>', re.I)


def patch_html(body, row, previous_engine, current_engine_url, config_url=None,
               previous_adapter=None, current_adapter_url=None, bird_sprites_url=None):
    text = body.decode('utf-8')
    data_matches = list(b.DATA.finditer(text))
    if len(data_matches) != 1 or json.loads(data_matches[0][1]).get('page') != row['page']:
        raise ValueError('实际page-data身份不符：' + row['page'])
    scripts = [(m, b.attributes(m[0])) for m in SCRIPT.finditer(text)]
    engines = [(m, attrs) for m, attrs in scripts if 'data-living-runtime' in m[0] and
               Path(urlsplit(attrs.get('src', '')).path).name in (previous_engine, Path(urlsplit(current_engine_url).path).name)]
    if len(engines) != 1:
        raise ValueError('当前HTML实际引擎入口不唯一或不是批准的旧/新版本：' + row['page'])
    engine_match, engine_attrs = engines[0]
    if engine_attrs['src'] != current_engine_url:
        tag = b.attr(engine_match[0], 'src', current_engine_url)
        text = text[:engine_match.start()] + tag + text[engine_match.end():]
    if current_adapter_url:
        adapter_name = Path(urlsplit(current_adapter_url).path).name
        adapters = [(m, b.attributes(m[0])) for m in SCRIPT.finditer(text)
                    if 'data-living-runtime' in m[0] and Path(urlsplit(b.attributes(m[0]).get('src', '')).path).name in (previous_adapter, adapter_name)]
        if len(adapters) != 1:
            raise ValueError('当前HTML实际adapter入口不唯一：' + row['page'])
        match, attrs = adapters[0]
        if attrs['src'] != current_adapter_url:
            text = text[:match.start()] + b.attr(match[0], 'src', current_adapter_url) + text[match.end():]
    sections = [(m, b.attributes(m[0])) for m in b.TAG.finditer(text) if 'data-living-config' in m[0]]
    if len(sections) != 1:
        raise ValueError('当前HTML活画section不唯一：' + row['page'])
    section, attributes = sections[0]
    try:
        binding = json.loads(attributes['data-living-binding'])
    except (KeyError, json.JSONDecodeError) as error:
        raise ValueError('当前HTML实际h/v绑定缺失') from error
    if set(binding) != {'h', 'v'}:
        raise ValueError('当前HTML未保有真实h/v绑定')
    if config_url and attributes['data-living-config'] != config_url:
        tag = b.attr(section[0], 'data-living-config', config_url)
        text = text[:section.start()] + tag + text[section.end():]
    if bird_sprites_url:
        matches = [(m, b.attributes(m[0])) for m in b.TAG.finditer(text) if 'data-living-config' in m[0]]
        section, attributes = matches[0]
        if attributes.get('data-living-bird-sprites') != bird_sprites_url:
            text = text[:section.start()] + b.attr(section[0], 'data-living-bird-sprites', bird_sprites_url) + text[section.end():]
    result = text.encode('utf-8')
    # 只允许批准的依赖属性变动；正文、图片、热区、绑定JSON、其它script原样。
    def neutral(value):
        text = value.decode('utf-8')
        for m in reversed(list(SCRIPT.finditer(text))):
            attrs = b.attributes(m[0])
            if 'data-living-runtime' in m[0] and Path(urlsplit(attrs.get('src', '')).path).name in (previous_engine, Path(urlsplit(current_engine_url).path).name):
                text = text[:m.start()] + b.attr(m[0], 'src', 'approved-bird-engine') + text[m.end():]
            elif current_adapter_url and 'data-living-runtime' in m[0] and Path(urlsplit(attrs.get('src', '')).path).name in (previous_adapter, Path(urlsplit(current_adapter_url).path).name):
                text = text[:m.start()] + b.attr(m[0], 'src', 'approved-bird-atlas-adapter') + text[m.end():]
        if config_url:
            for m in reversed(list(b.TAG.finditer(text))):
                if 'data-living-config' in m[0]:
                    text = text[:m.start()] + b.attr(m[0], 'data-living-config', 'approved-bird-perch-config') + text[m.end():]
        if bird_sprites_url:
            text = re.sub(r'\s+data-living-bird-sprites\s*=\s*(["\']).*?\1', '', text, flags=re.S)
        return text
    if neutral(body) != neutral(result):
        raise ValueError('HTML属性接线以外字节变化')
    return result


def apply(site, packet, engine_url=None, config_urls=None, write=False, adapter_url=None, bird_sprites_url=None):
    preparation = b.read(packet / 'preparation.json')
    upgrade = preparation['bird_upgrade']
    previous = upgrade['previous_engine']['engine']
    current = upgrade['current_engine']['engine']
    engine_url = engine_url or '/_living/_engine/' + current
    if Path(urlsplit(engine_url).path).name != current:
        raise ValueError('新引擎URL不是本packet批准内容版本')
    config_urls = config_urls or {}
    adapter = upgrade.get('adapter_upgrade')
    adapter_url = adapter_url or ('/_living/_engine/' + adapter['current']['name'] if adapter else None)
    if adapter and Path(urlsplit(adapter_url).path).name != adapter['current']['name']:
        raise ValueError('新adapter URL不是本packet真实内容版本')
    changes = upgrade['configuration_updates']
    if not set(config_urls) <= set(changes):
        raise ValueError('配置URL映射包含未经批准变化的页')
    rows = []
    for row in preparation['mounted']:
        path = site / b.relative(row['route'])
        before = path.read_bytes()
        url = config_urls.get(row['page']) or (changes[row['page']]['new_config_url'] if row['page'] in changes else None)
        sprites = bird_sprites_url
        if adapter and not sprites:
            text = before.decode('utf-8')
            sections = [b.attributes(m[0]) for m in b.TAG.finditer(text) if 'data-living-config' in m[0]]
            sprites = sections[0].get('data-living-bird-sprites')
            if not sprites:
                urls = [b.attributes(m[0]).get('src') for m in SCRIPT.finditer(text)
                        if Path(urlsplit(b.attributes(m[0]).get('src', '')).path).name == previous]
                if len(urls) != 1: raise ValueError('首次接线无法定位旧engine目录以复用原atlas')
                sprites = urljoin(urls[0], upgrade['previous_engine']['bird'])
        after = patch_html(before, row, previous, engine_url, url,
                           adapter['previous']['name'] if adapter else None, adapter_url, sprites)
        if write and after != before:
            path.write_bytes(after)
        rows.append({'page': row['page'], 'route': row['route'],
                     'before': {'bytes': len(before), 'sha256': b.sha(before)},
                     'after': {'bytes': len(after), 'sha256': b.sha(after)},
                     'changed': before != after, 'engine_url': engine_url,
                     'adapter_url': adapter_url, 'existing_atlas_directory_url': sprites,
                     'approved_config_url': url, 'other_html_bytes_preserved': True})
    if len(rows) != 65 or len({row['route'] for row in rows}) != 65:
        raise ValueError('实际65已挂载页范围不符')
    return {'schema': 'wly.bird-visible-selective-html-update.v1', 'observed_at_beijing': b.stamp(),
            'status': 'pass', 'applied': write, 'scope': '65 real HTML dependency attributes only; no assets upload, seal or publication',
            'stage_pages': [row['page'] for row in preparation['staged']], 'pages': rows}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ('site', 'packet', 'output'): parser.add_argument('--' + name, required=True, type=Path)
    parser.add_argument('--engine-url')
    parser.add_argument('--config-url-map', type=Path)
    parser.add_argument('--adapter-url')
    parser.add_argument('--bird-sprites-url', help='现有旧atlas目录；省略时从实际旧engine URL同目录准确推导')
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    result = apply(args.site, args.packet, args.engine_url,
                   b.read(args.config_url_map) if args.config_url_map else None, args.apply,
                   args.adapter_url, args.bird_sprites_url)
    b.write(args.output, result)
    print(json.dumps({'status': result['status'], 'applied': result['applied'], 'pages': len(result['pages']),
                      'changed': sum(row['changed'] for row in result['pages'])}, ensure_ascii=False))
