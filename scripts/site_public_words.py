"""Load the owner's private publication policy without embedding its contents."""
import hashlib
import html
from io import StringIO
import json
from pathlib import Path
import re
import sys

DEFAULT_PATH = Path('E:/PCConfig/registries/site_public_words.json')

# Credential formats and numeric checks follow PCConfig's display_restrictions /
# public_rewrite.RestrictedValues; money and health readings are not this gate.
# Same credential families as PCConfig, with literal values for source-code assignments.
QUOTED = r'"(?:\\.|[^"\\])+"|\'(?:\\.|[^\'\\])+\'|“[^”]+”|「[^」]+」'
VALUE = r'(?:' + QUOTED + r'|[A-Za-z0-9][A-Za-z0-9_~+/=-]*(?![A-Za-z0-9_.(/-]))'
ASSIGNED = r'(?<![\w])["\']?(?:api[_ -]?key|access[_ -]?key|(?:access|refresh|id|auth|session)[_-]?token|token|client[_-]?secret|secret|password|passphrase|passwd|pwd|密码|口令|令牌|密钥)["\']?\s*[:=：](?!=)\s*' + VALUE
CREDENTIAL = re.compile(ASSIGNED
    + r'|(?<![A-Za-z0-9_])(?:sk-(?:(?:proj|svcacct|ant-api03)-)?[A-Za-z0-9_]{20,}(?:-[A-Za-z0-9_]+)*|(?:gh[posu]_|github_pat_)[A-Za-z0-9_]{16,}|xox[abprs]-[A-Za-z0-9-]{10,}|AKIA[A-Z0-9]{16}|AIza[0-9A-Za-z_-]{30,})(?![A-Za-z0-9_])'
    + r'|(?<![A-Za-z0-9_])eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*|-----BEGIN (?:[A-Z0-9]+ )*PRIVATE KEY-----'
    + r'|(?:验证码|校验码|动态码|\bverification\s+code\b|\botp\b)["\']?\s*(?:(?:是|为|is\b)\s*)?[:=：]?\s*["\']?[0-9]{4,8}(?![A-Za-z0-9])'
    + r'|(?<![\w])["\']?(?:proxy-)?authorization["\']?\s*[:=：]\s*(?:(?:Basic|Bearer|Digest|Token|Negotiate)\s+)?' + VALUE
    + r'|\b(?:Bearer|Basic)\s+[A-Za-z0-9._~+/=-]{8,}', re.I)
NUMBER = re.compile(r'(?<![A-Za-z0-9_.-])(?:[1-9](?:[ -]?[0-9]){12,18}|[1-9][0-9]{16}[Xx])(?![A-Za-z0-9_.-])')
PHONE = re.compile(r'(?<![A-Za-z0-9_.-])(?:\+?86[ -]?)?1[3-9][0-9](?:[ -]?[0-9]){8}(?![A-Za-z0-9_.-])')
ADDRESS = re.compile(r'[\u4e00-\u9fff]{2,10}(?:省|自治区)[\u4e00-\u9fff]{2,10}市[\u4e00-\u9fff]{1,10}(?:区|县)[\u4e00-\u9fff]{1,20}(?:街道|路|街|道|巷|弄)[0-9]+号|(?:北京|天津|上海|重庆)市[\u4e00-\u9fff]{1,10}(?:区|县)[\u4e00-\u9fff]{1,20}(?:街道|路|街|道|巷|弄)[0-9]+号')
JSON_KEY_COLON = re.compile(r'\s*:')  # Matches in place; slicing the rest of a large JSON per token is quadratic.
BYTE_UNIT = re.compile(r'[ \t]*(?:字节|bytes?\b|[KMGT]i?B\b)', re.I)
TEXT_EXTENSIONS = {'.html', '.js', '.mjs', '.json', '.txt', '.xml', '.md', '.svg', '.css', '.ps1', '.webmanifest'}
CHECK_RECORDS = {'.build-receipt.json', 'release-manifest.json', 'release-identity.json'}


def load_notification_tests():
    """Use the publisher's complete-string pattern and registered synthetic IDs."""
    sys.path.insert(0, 'E:/PCConfig/tools/remote-computer-mcp')
    try:
        from public_rewrite import RULES, RestrictedValues
        return RestrictedValues.notification_test, frozenset(RULES['notification_test_ids'])
    except (ImportError, OSError, ValueError, AttributeError, KeyError, TypeError):
        return None  # Without the authority, retain the ordinary numeric checks.
    finally:
        sys.path.pop(0)


def baseline_hits(text, file, owner_rows=None, policy=None):
    """Return only locations/categories; judgments and word exceptions never exempt secrets."""
    normalize = lambda value: html.unescape(re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m[1], 16)), value))
    numeric_text, valid_json = None, False
    synthetic_numbers = set()
    if file.lower().endswith('.json'):
        try: json.loads(text)
        except ValueError: pass  # Malformed JSON retains the full-text rules.
        else:
            valid_json = True
            tests = load_notification_tests() if file == 'dist/live/_fallback.json' else None
            parts, start, offset = StringIO(), 0, 0
            for token in re.finditer(r'"(?:\\.|[^"\\])*"|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)', text):
                gap = normalize(text[start:token.start()])
                parts.write(gap)
                value = normalize(token[0])
                if token[1] is not None or JSON_KEY_COLON.match(text, token.end()):
                    value = re.sub(r'[^\n]', ' ', value)  # Keep positions, mask JSON numbers and keys.
                elif tests:
                    pattern, ids = tests
                    field = value[1:-1]
                    matched = pattern.fullmatch(field)
                    if matched and matched['id'] in ids and json.loads(token[0]) == field:
                        offset_in_field = offset + len(gap) + 1  # Opening JSON quote.
                        synthetic_numbers.add((offset_in_field + matched.start('id'), offset_in_field + matched.end('id')))
                parts.write(value); start = token.end()
                offset += len(gap) + len(value)
            parts.write(normalize(text[start:]))
            numeric_text = parts.getvalue()
            parts.close()
    text = normalize(text)
    if numeric_text is None: numeric_text = text
    hits = []
    literal_ranges = None
    if file.endswith(('.js', '.mjs')):
        from pygments.lexers import JavascriptLexer
        from pygments.token import String
        literal_ranges = [(start, start + len(value)) for start, token, value in JavascriptLexer().get_tokens_unprocessed(text) if token in String]
    def add(match, category):
        hits.append({'file': file, 'category': category, 'line': text.count('\n', 0, match.start()) + 1,
                     'column': match.start() - text.rfind('\n', 0, match.start())})
    if owner_rows:
        for match in owner_rows.finditer(text):
            if not allow_word_exception(policy, file, text, match):
                add(match, '仅本人可见词')
    for match in CREDENTIAL.finditer(text):
        value = match[0]
        if literal_ranges is not None and re.match(ASSIGNED, value, re.I) and not any(a <= match.end()-1 < b for a, b in literal_ranges): continue
        category = ('验证码' if re.search(r'验证码|校验码|动态码|verification\s+code|\botp\b|\bcode\s+is\b', value, re.I)
                    else '密码' if re.search(r'password|passphrase|passwd|\bpwd\b|密码|口令', value, re.I)
                    else '令牌' if re.search(r'token|令牌|Bearer|authorization|^gh|^xox|^eyJ', value, re.I) else '密钥')
        add(match, category)
    for pattern, category in ((PHONE, '手机号'), (NUMBER, '银行卡号'), (ADDRESS, '结构化住址')):
        for match in pattern.finditer(text if pattern is ADDRESS else numeric_text):
            if pattern is not ADDRESS:
                if BYTE_UNIT.match(text, match.end()): continue
                if not valid_json and re.search(r'["\'][A-Za-z0-9_]*bytes["\']\s*:\s*"?$', text[:match.start()], re.I): continue
                raw = match[0].upper(); number = re.sub('[ -]', '', raw)
                if pattern is PHONE and file == 'dist/live/_fallback.json' and valid_json and re.fullmatch(r'\d{11}', raw):
                    # Match the live publisher's explicit technical identifier context.
                    before = re.split(r'["。！？!?；;\n]', numeric_text[max(0, match.start()-56):match.start()])[-1]
                    if (re.search(r'(?:时间戳|编号)[ \t]*[:：#]?[ \t]*$', before)
                            and re.search(r'测试|调试|日志|探测|机器|请求|任务|回执|样本|时间戳', before)
                            and not re.search(r'联系|联络|电话|手机|短信', before)):
                        continue
                if pattern is NUMBER:
                    if match.span() in synthetic_numbers: continue
                    if len(number) == 18 and raw == number and number[:17].isdigit():
                        total = sum(int(n)*w for n, w in zip(number, (7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2)))
                        if number[-1] == '10X98765432'[total % 11]:
                            add(match, '证件号'); continue
                    if not number.isdigit() or re.fullmatch(r'[12][0-9]{12}|(?:19|20)[0-9]{6}[ -]?[0-9]{6}', raw): continue
                    if sum(int(n) if i % 2 == 0 else int(n)*2-9*(int(n)>4) for i, n in enumerate(number[::-1])) % 10: continue
            add(match, category)
    return hits


def scan_baseline(root, exclude=(), *, policy=None):
    root = Path(root)
    if not root.is_dir(): raise ValueError('Dist directory does not exist: ' + str(root))
    words = (policy or {}).get('owner_row_words', [])
    owner_rows = re.compile(word_pattern({'words': words})) if words else None
    hits = []
    for path in sorted(root.rglob('*')):
        relative = path.relative_to(root).as_posix()
        if relative.startswith(tuple(exclude)) or not path.is_file() or relative in CHECK_RECORDS or path.suffix.lower() not in TEXT_EXTENSIONS: continue
        try: text = path.read_text('utf-8-sig')
        except UnicodeDecodeError: text = path.read_text('gb18030')
        hits.extend(baseline_hits(text, 'dist/' + relative, None if relative.startswith('live/_fixtures/') else owner_rows, policy))
    return hits

def apply_public_judgments(text, matcher, file, approved):
    """Scan decoded JSON values; omit only complete strings approved in this file."""
    try:
        document = json.loads(text)
    except ValueError:
        return text
    judgments = document.get('public_judgments') if isinstance(document, dict) else None
    same = judgments.get('same') if isinstance(judgments, dict) else None
    if (not isinstance(same, list) or not isinstance(judgments.get('rules'), str)
            or not judgments['rules'].strip()
            or not all(isinstance(h, str) and re.fullmatch('[0-9a-f]{64}', h) for h in same)):
        same = []
    same = set(same)
    def replace(token):
        if token[2]:  # JSON object keys are not string values.
            return token[0]
        value = json.loads(token[1])
        try:
            digest = hashlib.sha256(value.encode('utf-8')).hexdigest()
        except UnicodeEncodeError:
            return token[0]
        if digest not in same:
            return json.dumps(value, ensure_ascii=False)
        approved.extend({'file': file, 'word': hit[0], 'sha256': digest} for hit in matcher.finditer(value))
        return ' ' * len(token[0])
    return re.sub(r'("(?:[^"\\]|\\.)*")(\s*:)?', replace, text)


def allow_word_exception(policy, file, text, match, approved=None):
    policy = policy or {}
    for row in policy.get('exceptions', []):
        cross_carrier = (row['file'] == 'dist/*' and row.get('live') is True and file.startswith('dist/')
                         and row['word'] in policy.get('owner_row_words', []))
        if (row['file'] == file or cross_carrier) and row['word'] == match[0] and any(
                m.start() <= match.start() and match.end() <= m.end() for m in re.finditer(re.escape(row['text']), text)):
            if approved is not None:
                approved.append({'file': file, 'word': match[0],
                                 'sha256': hashlib.sha256(row['text'].encode('utf-8')).hexdigest()})
            return True
    return False


def load_policy(path=None):
    path = Path(path or DEFAULT_PATH)
    try:
        policy = json.loads(path.read_text('utf-8-sig'))
        if not isinstance(policy, dict) or policy.get('schema') != 'wly.site-public-words.v1': raise ValueError('schema')
        words = policy['words']
        if not isinstance(words, list) or not words or not all(isinstance(x, str) and x.strip() == x and x for x in words): raise ValueError('words')
        owner_rows = policy.get('owner_row_words', [])
        if not isinstance(owner_rows, list) or not all(isinstance(word, str) and word in words for word in owner_rows) or len(owner_rows) != len(set(owner_rows)):
            raise ValueError('owner row words')
        if len(words) != len(set(words)) or not isinstance(policy['exceptions'], list): raise ValueError('duplicates or exceptions')
        for row in policy['exceptions']:
            if not isinstance(row, dict) or not all(isinstance(row.get(k), str) and row[k].strip() for k in ('file', 'word', 'text', 'reason')): raise ValueError('exception fields')
            if row['word'] not in words or row['word'] not in row['text'] or not row['file'].startswith(('source/', 'dist/')): raise ValueError('exception scope')
            if row['file'] == 'dist/*' and (row.get('live') is not True or row['word'] not in owner_rows):
                raise ValueError('cross-carrier exception scope')
        for key in ('omissions', 'topic_omissions'):
            if not isinstance(policy[key], dict) or not all(isinstance(k, str) and isinstance(v, list) and all(isinstance(x, str) and x for x in v)
                                                         for k, v in policy[key].items()): raise ValueError('omission map')
    except (OSError, ValueError, KeyError, TypeError) as error:
        raise ValueError('Private publication policy is missing or invalid: ' + str(path)) from error
    return policy

def word_pattern(policy):
    # Test the left boundary after the literal to retain the regex's fast starting-character scan.
    # Numbers must not sit inside other numbers, words or versions; other ASCII words (service names, short codes)
    # count only as whole words, so code identifiers, model names and encoded data that merely contain those letters
    # do not match. Chinese words keep plain substring matching.
    def one(word):
        if not word.isascii():
            return re.escape(word)
        edge = r'[A-Za-z0-9.]' if word.isdigit() else r'[A-Za-z0-9_]'
        return re.escape(word) + r'(?<!' + edge + re.escape(word) + r')(?!' + edge + r')'
    return '|'.join(one(word) for word in sorted(policy['words'], key=len, reverse=True))
