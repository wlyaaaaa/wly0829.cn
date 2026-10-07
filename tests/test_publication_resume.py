import unittest
from test_typeset_incremental import c

class ResumeTests(unittest.TestCase):
    def test_unknown_push_only_reads_back_or_stops(self):
        published = dict(status='push_result_unknown', pushed_commit=None, release_id='oss-final', requested_commit='mine', production_commit='before')
        staged = dict(release_id='oss-final', oss={'source_release_id':'raw-source'})
        self.assertTrue(c.resume_readback_only(published, staged, False, 'old-online', 'before'))
        self.assertTrue(c.resume_readback_only({**published, 'requested_commit':None}, staged, False, 'oss-final', 'someone-else'))
        for invalid, candidate, remote, rollback in [(True, 'oss-final', 'before', False), (False, 'raw-source', 'before', False),
                                                    (False, 'oss-final', 'someone-else', False), (False, 'oss-final', 'mine', True)]:
            with self.assertRaises(ValueError):
                c.resume_readback_only({**published, 'automatic_rollback':rollback}, {'release_id':candidate}, invalid, 'old-online', remote)
