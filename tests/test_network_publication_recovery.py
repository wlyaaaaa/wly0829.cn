import unittest
from test_oss_browser_network import network

class NetworkRecoveryTests(unittest.TestCase):
    def test_transport_and_incomplete_evidence_never_confirm_failure(self):
        row = dict(route='/', status='fail', blocking_loading_failed=[], http_failures=[], page_errors=[])
        report = dict(schema=network.SCHEMA, status='fail', pages=[row], routes=['/'], profile_cleanup={'verified':True})
        for code in ('ERR_EMPTY_RESPONSE', 'ERR_ABORTED', 'ERR_CONNECTION_RESET', 'ERR_TIMED_OUT'):
            row['blocking_loading_failed'] = [{'errorText':'net::'+code}]
            self.assertEqual(network.failure_classification(report), {'kind':'unknown', 'retryable':True})
        row['blocking_loading_failed'] = [{'errorText':'net::ERR_BLOCKED_BY_CSP', 'blockedReason':'csp', 'url':network.ORIGIN+'/'}]
        self.assertEqual(network.failure_classification(report), {'kind':'confirmed', 'retryable':True})
        for override in ({'profile_cleanup':{'verified':False}}, {'error':'RuntimeError'}, {'pages':[]}, {'schema':'unbound'}):
            self.assertEqual(network.failure_classification({**report, **override}), {'kind':'unknown', 'retryable':False})
        row['page_errors'] = ['runtime failure']
        self.assertEqual(network.failure_classification(report), {'kind':'unknown', 'retryable':False})
        row.update(page_errors=[], blocking_loading_failed=[], documents=[dict(url='https://external.invalid/', http=200, sha256='actual', verified=False)])
        self.assertEqual(network.failure_classification(report), {'kind':'unknown', 'retryable':True})
        row.update(documents=[], http_failures=[dict(url=network.STATUS_URL, http=503, type='Fetch')])
        self.assertEqual(network.failure_classification(report), {'kind':'unknown', 'retryable':True})
