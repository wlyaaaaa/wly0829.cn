"""Load local publication policy without copying its values into public code."""
from collections.abc import Mapping
import hashlib
import json
from pathlib import Path
import re

POLICY_PATH = Path(__file__).resolve().parents[1] / '.publish/private/rule-public-policy.json'
SCHEMA = 'wly.rule-public-policy.v1'


class PolicyUnavailable(ValueError):
    pass


def load_policy():
    try:
        policy = json.loads(POLICY_PATH.read_text('utf8'))
    except FileNotFoundError as error:
        raise PolicyUnavailable('Private rule publication policy is unavailable: ' + str(POLICY_PATH)) from error
    except (OSError, ValueError) as error:
        raise ValueError('Private rule publication policy cannot be read') from error
    try:
        if policy['schema'] != SCHEMA:
            raise ValueError('Invalid schema')
        for key in ('topic_pattern', 'rule_extra_pattern', 'exception_pattern'):
            if not isinstance(policy[key], str) or not policy[key].strip() or re.compile(policy[key], re.I).search(''):
                raise ValueError('Invalid pattern')
        omissions = policy['omissions']
        if not isinstance(omissions, dict) or not omissions or not all(isinstance(key, str) and key and isinstance(values, list) and values
                   and all(isinstance(value, str) and value for value in values)
                   for key, values in omissions.items()):
            raise ValueError('Invalid omissions')
    except (ValueError, KeyError, TypeError, re.error) as error:
        raise ValueError('Private rule publication policy has invalid schema or values') from error
    return policy


def private_source_root(root):
    return Path(root) / '.publish/private/rule-sources'


def omission_id(value):
    return 'omit:' + hashlib.sha256(value.encode('utf8')).hexdigest()


def resolve_omission(item):
    for values in load_policy()['omissions'].values():
        for value in values:
            if omission_id(value) == item:
                return value
    raise ValueError('Unknown public omission identifier')


class OmissionMap(Mapping):
    def __getitem__(self, key):
        return [omission_id(value) for value in load_policy()['omissions'][key]]

    def __iter__(self):
        return iter(load_policy()['omissions'])

    def __len__(self):
        return len(load_policy()['omissions'])


class PolicyPattern:
    def __init__(self, *keys):
        self.keys = keys

    def __getattr__(self, name):
        policy = load_policy()
        pattern = re.compile('|'.join(policy[key] for key in self.keys), re.I)
        return getattr(pattern, name)


if __name__ == '__main__':
    import subprocess, sys
    root = str(Path(__file__).resolve().parents[1])
    pattern = load_policy()['repo_literal_pattern']
    commits = subprocess.check_output(['git', '-C', root, 'rev-list', 'origin/main..HEAD'], text=True).splitlines()
    counts = {'tree_matches': 0, 'message_matches': 0}
    for commit in commits:
        found = subprocess.run(['git', '-C', root, 'grep', '-P', '-I', '-n', '-i', '-e', pattern, commit],
                               capture_output=True, text=True, encoding='utf8')
        if found.returncode not in (0, 1): raise ValueError('Public commit scan failed')
        counts['tree_matches'] += len(found.stdout.splitlines())
        message = subprocess.check_output(['git', '-C', root, 'show', '-s', '--format=%B', commit], text=True, encoding='utf8')
        counts['message_matches'] += len(re.findall(pattern, message, re.I))
    print(json.dumps({'commits': len(commits), **counts}))
    sys.exit(bool(sum(counts.values())))
