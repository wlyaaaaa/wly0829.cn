"""Load the owner's private publication policy without embedding its contents."""
import json
from pathlib import Path
import re

DEFAULT_PATH = Path('E:/PCConfig/registries/site_public_words.json')

def load_policy(path=None):
    path = Path(path or DEFAULT_PATH)
    try:
        policy = json.loads(path.read_text('utf-8-sig'))
        if not isinstance(policy, dict) or policy.get('schema') != 'wly.site-public-words.v1': raise ValueError('schema')
        words = policy['words']
        if not isinstance(words, list) or not words or not all(isinstance(x, str) and x.strip() == x and x for x in words): raise ValueError('words')
        if len(words) != len(set(words)) or not isinstance(policy['exceptions'], list): raise ValueError('duplicates or exceptions')
        for row in policy['exceptions']:
            if not isinstance(row, dict) or not all(isinstance(row.get(k), str) and row[k].strip() for k in ('file', 'word', 'text', 'reason')): raise ValueError('exception fields')
            if row['word'] not in words or row['word'] not in row['text'] or not row['file'].startswith(('source/', 'dist/')): raise ValueError('exception scope')
        for key in ('omissions', 'topic_omissions'):
            if not isinstance(policy[key], dict) or not all(isinstance(k, str) and isinstance(v, list) and all(isinstance(x, str) and x for x in v)
                                                         for k, v in policy[key].items()): raise ValueError('omission map')
    except (OSError, ValueError, KeyError, TypeError) as error:
        raise ValueError('Private publication policy is missing or invalid: ' + str(path)) from error
    return policy

def word_pattern(policy):
    # Test the left numeric boundary after its literal to retain the regex's fast starting-character scan.
    return '|'.join(re.escape(word) + r'(?<![A-Za-z0-9.]' + re.escape(word) + r')(?![A-Za-z0-9.])'
                    if word.isascii() and word.isdigit() else re.escape(word)
                    for word in sorted(policy['words'], key=len, reverse=True))
