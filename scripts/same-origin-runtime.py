"""Exact resource address mapping and the legacy runtime-address check."""
import re

TEXT = {'.html', '.js', '.mjs', '.css', '.json', '.svg'}
URL = re.compile(r'https://wly0829-img-media-shanghai\.oss-cn-shanghai\.aliyuncs\.com/[^"\'<>`\\\s]*?\.(?:mjs|js|css|woff2?|ttf|otf|json|png|webp|avif|jpe?g|svg|mp4)(?=[^A-Za-z0-9]|$)')
PREFIX = re.compile(r'https://wly0829-img-media-shanghai\.oss-cn-shanghai\.aliyuncs\.com/releases/[^/]+/')
def localize(text, snapshot):
    return PREFIX.sub('/', URL.sub(lambda m: snapshot['runtime_urls'].get(m[0], m[0]), text))
