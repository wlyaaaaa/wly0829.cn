import importlib.util, tempfile, types, unittest.mock
import io, ssl
from http.client import IncompleteRead, RemoteDisconnected
from pathlib import Path
spec = importlib.util.spec_from_file_location('publisher', Path(__file__).resolve().parents[1]/'site-astro/tools/publish_site.py')
publisher = importlib.util.module_from_spec(spec); spec.loader.exec_module(publisher)
class PublishTests(unittest.TestCase):
    def test_post_acceptance_retirement_binds_head_proofs_and_keeps_publication_fact_on_error(self):
        for fail_page, fail_cleanup, skip_retention in ((False, False, False), (False, True, False), (True, False, False), (False, False, True)):
            with self.subTest(fail_page=fail_page, fail_cleanup=fail_cleanup), tempfile.TemporaryDirectory() as temporary:
                folder = Path(temporary); root = folder/'dist'; root.mkdir()
                for rel in ('index.html', 'cockpit/index.html', 'computer-access/index.html', 'a.js'):
                    target = root/rel; target.parent.mkdir(parents=True, exist_ok=True); target.write_bytes(b'fixture')
                publisher.oss.write(root/'release-manifest.json', {'schema': 'wly.hybrid-release.v1', 'release_id': 'fixture', 'files': publisher.oss.inventory(root)})
                source = publisher.oss.finalize_dist(root)
                scan = folder/'scan.json'
                publisher.oss.write(scan, {'failures': [], 'dist_files_sha256':
                    {path.relative_to(root).as_posix(): publisher.oss.digest(path) for path in root.rglob('*') if path.is_file()}})
                options = types.SimpleNamespace(output=folder/'run', dist=root, scan_result=scan, previous_manifest=None,
                    source_commit=None, dry_run=False, upload_only=False, lock_holder='fixture', upload_workers=1, pages_timeout=1,
                    skip_retention=skip_retention)
                shared = folder/'shared'
                def proof(item, dist):
                    rel, row = item
                    return rel, {'status': 'pass', 'http': 200, 'bytes': row['bytes'], 'sha256': row['sha256'], 'headers': {'ETag': '"'+'a'*32+'"'}}
                def collect(args):
                    self.assertIsNone(args.rollback)
                    self.assertTrue((shared/'published.json').exists())
                    registered = publisher.retention.read(shared/'managed.json')['objects']
                    self.assertTrue(all(row['etag'] == 'a'*32 for row in registered.values()))
                    if fail_cleanup: raise OSError('cloud delete failed')
                    publisher.retention.write(args.report, {'status': 'complete', 'deleted_objects': 0, 'deleted_bytes': 0})
                    return 0
                with unittest.mock.patch.object(publisher.retention, 'predecessor', return_value=None), \
                     unittest.mock.patch.object(publisher.retention, 'shared', return_value=shared), \
                     unittest.mock.patch.object(publisher.retention, 'collect', side_effect=collect) as cleanup, \
                     unittest.mock.patch.object(publisher, 'head', side_effect=proof), \
                     unittest.mock.patch.object(publisher, 'command', return_value='{"status":"acquired"}'), \
                     unittest.mock.patch.object(publisher, 'artifact_commit', return_value={'root': str(root), 'commit': 'a'*40, 'changed_files': []}), \
                     unittest.mock.patch.object(publisher, 'pages', return_value=42), \
                     unittest.mock.patch.object(publisher, 'get_page', side_effect=ValueError('GET mismatch') if fail_page else lambda item: (item[0], {'status': 'pass', 'sha256': item[1]['sha256']})):
                    if fail_page:
                        with self.assertRaisesRegex(ValueError, 'GET mismatch'): publisher.publish(options)
                        cleanup.assert_not_called(); self.assertFalse((shared/'published.json').exists())
                    else:
                        result = publisher.publish(options)
                        self.assertEqual(result['status'], 'published_with_retention_incomplete' if fail_cleanup else 'published')
                        self.assertEqual(result['publication_status'], 'published')
                        if skip_retention:
                            cleanup.assert_not_called()
                            self.assertEqual(result['oss_retention'], {'status': 'skipped_by_request', 'deleted_objects': 0, 'deleted_bytes': 0})
                        else: cleanup.assert_called_once()
                        if fail_cleanup: self.assertIn('cloud delete failed', result['oss_retention']['reason'])
                attempt = publisher.retention.read(shared/'last-attempt.json')
                self.assertEqual(attempt['status'], 'failed' if fail_page else result['status'])
                self.assertEqual((attempt['dry_run'], attempt['source_commit']), (False, 'Unknown'))
                self.assertTrue(attempt['completed_at_beijing'].endswith('+08:00'))
                self.assertNotIn('head', attempt)
                if fail_page: self.assertIn('GET mismatch', attempt['error'])
    def test_pages_dispatches_main_and_waits_for_returned_run_id(self):
        with unittest.mock.patch.object(publisher, 'command', side_effect=[
                'https://github.com/wlyaaaaa/wly0829.cn/actions/runs/42',
                '{"status":"in_progress","conclusion":null}', '{"status":"completed","conclusion":"success"}']) as commands, unittest.mock.patch.object(publisher.time, 'sleep'):
            self.assertEqual(publisher.pages('a'*40, 60), 42)
        self.assertEqual(commands.call_args_list[0].args, ('gh', 'workflow', 'run', 'pages.yml', '--repo', 'wlyaaaaa/wly0829.cn', '--ref', 'main', '-f', 'sha='+'a'*40))
        self.assertEqual(commands.call_args_list[0].kwargs['timeout'], 60)
        for call in commands.call_args_list[1:]:
            self.assertEqual(call.args, ('gh', 'run', 'view', '42', '--repo', 'wlyaaaaa/wly0829.cn', '--json', 'status,conclusion'))
            self.assertGreater(call.kwargs['timeout'], 0)
    def test_pages_rejects_failed_cancelled_and_other_non_success_runs(self):
        for conclusion in ('failure', 'cancelled', 'timed_out', 'skipped', 'neutral'):
            with self.subTest(conclusion=conclusion), unittest.mock.patch.object(publisher, 'command', side_effect=[
                    'https://github.com/wlyaaaaa/wly0829.cn/actions/runs/42',
                    publisher.json.dumps({'status': 'completed', 'conclusion': conclusion})]):
                with self.assertRaisesRegex(ValueError, conclusion): publisher.pages('a'*40, 60)
    def test_pages_timeout_uses_the_same_deadline_without_real_sleep(self):
        clock = [0]
        with unittest.mock.patch.object(publisher.time, 'monotonic', side_effect=lambda: clock[0]), unittest.mock.patch.object(publisher.time, 'sleep', side_effect=lambda seconds: clock.__setitem__(0, clock[0]+seconds)), unittest.mock.patch.object(publisher, 'command', side_effect=[
                'https://github.com/wlyaaaaa/wly0829.cn/actions/runs/42', '{"status":"queued","conclusion":null}']):
            with self.assertRaisesRegex(TimeoutError, 'run 42'): publisher.pages('a'*40, 1)
    def test_pages_never_guesses_a_run_when_dispatch_returns_no_exact_url(self):
        for result in ('', 'https://github.com/other/repo/actions/runs/42'):
            with self.subTest(result=result), unittest.mock.patch.object(publisher, 'command', return_value=result) as commands:
                with self.assertRaisesRegex(ValueError, 'no run id'): publisher.pages('a'*40, 60)
                self.assertEqual(commands.call_count, 1)
    def test_pages_connection_errors_preserve_deadline_and_dispatch_once(self):
        eof = publisher.subprocess.CalledProcessError(1, 'gh', '', 'unexpected EOF')
        for timeout, expected_calls, elapsed in ((30, 12, 20), (3, 3, 3)):
            clock = [0]
            with self.subTest(timeout=timeout), unittest.mock.patch.object(publisher.time, 'monotonic', side_effect=lambda: clock[0]), \
                 unittest.mock.patch.object(publisher.time, 'sleep', side_effect=lambda delay: clock.__setitem__(0, clock[0]+delay)), \
                 unittest.mock.patch.object(publisher, 'command', side_effect=['https://github.com/wlyaaaaa/wly0829.cn/actions/runs/42']+[eof]*10+['{"status":"completed","conclusion":"success"}']) as calls:
                if timeout == 30: self.assertEqual(publisher.pages('a'*40, timeout), 42)
                else:
                    with self.assertRaisesRegex(TimeoutError, 'run 42.*EOF'): publisher.pages('a'*40, timeout)
            self.assertEqual((calls.call_count, clock[0]), (expected_calls, elapsed))
            self.assertEqual(sum(call.args[1:3] == ('workflow', 'run') for call in calls.call_args_list), 1)
            self.assertEqual([call.kwargs['timeout'] for call in calls.call_args_list[1:]], list(range(timeout, timeout-elapsed-1, -2)) if timeout == 30 else [3, 1])
    def test_public_fetch_retries_transport_errors_but_rejects_local_http_and_content_errors(self):
        payload = b'x'; digest = publisher.hashlib.sha256(payload).hexdigest()
        with tempfile.TemporaryDirectory() as temporary, unittest.mock.patch.object(publisher.time, 'sleep') as sleeps:
            root = Path(temporary); (root/'a.css').write_bytes(payload)
            item = ('a.css', {'url': 'https://example.invalid/a.css', 'bytes': 1, 'sha256': digest})
            for head in (False, True):
                run = lambda: publisher.head(item, root) if head else publisher.get_page(item)
                failures = (ssl.SSLEOFError('SSL EOF'), RemoteDisconnected('EOF'), IncompleteRead(b'x', 2), OSError(2, 'missing'))
                for failure in (*failures, publisher.HTTPError('u', 404, 'nf', {}, None), OSError(2, 'missing', str(root/'missing')), publisher.URLError(FileNotFoundError(2, 'missing', 'missing.pem'))):
                    response = io.BytesIO(payload); response.status = 200
                    response.headers = {'Content-Length': '1', 'ETag': publisher.hashlib.md5(payload).hexdigest()}
                    sleeps.reset_mock()
                    with self.subTest(head=head, failure=repr(failure)), unittest.mock.patch.object(publisher, 'urlopen', side_effect=[failure, failure, response]) as calls:
                        if failure in failures: self.assertEqual(run()[1]['status'], 'pass')
                        else:
                            with self.assertRaises(type(failure)): run()
                    self.assertEqual(calls.call_count, 3 if failure in failures else 1)
                    if failure not in failures: sleeps.assert_not_called()
                    if isinstance(failure, publisher.HTTPError): failure.close()
                for status, body in ((404, payload), (201, None), (200, b'wrong')):
                    response = io.BufferedReader(io.BytesIO(body or b'')); response.status = status
                    response.headers = {'Content-Length': str(len(body or b'')), 'ETag': publisher.hashlib.md5(body or b'').hexdigest()}
                    if body is None: response.readinto = unittest.mock.Mock(side_effect=IncompleteRead(b'x', 2))
                    with self.subTest(head=head, status=status, body=body), unittest.mock.patch.object(publisher, 'urlopen', return_value=response) as calls:
                        with self.assertRaises(ValueError): run()
                    self.assertEqual(calls.call_count, 1)
                    if body is None: response.readinto.assert_not_called(); sleeps.assert_not_called()
            sleeps.reset_mock()
            with unittest.mock.patch.object(publisher, 'urlopen') as calls:
                with self.assertRaises(FileNotFoundError): publisher.head(('missing', item[1]), root)
            calls.assert_not_called(); sleeps.assert_not_called()
    def test_pages_reports_a_dispatch_command_timeout(self):
        with unittest.mock.patch.object(publisher, 'command', side_effect=publisher.subprocess.TimeoutExpired('gh', 1)) as commands, unittest.mock.patch.object(publisher.time, 'sleep') as sleeps:
            with self.assertRaises(publisher.subprocess.TimeoutExpired): publisher.pages('a'*40, 1)
        self.assertEqual((commands.call_count, [c.args[0] for c in sleeps.call_args_list]), (9, [0.5, 1, 2, 2, 2, 2, 2, 2]))
    def test_connection_errors_retry_three_times_but_content_and_http_errors_do_not(self):
        reset = publisher.subprocess.CalledProcessError(128, 'git', '', 'schannel: failed to receive handshake, SSL/TLS connection failed')
        with unittest.mock.patch.object(publisher, 'command', side_effect=[reset, reset, 'ok']) as commands, unittest.mock.patch.object(publisher.time, 'sleep'):
            self.assertEqual(publisher.net('git', 'push'), 'ok'); self.assertEqual(commands.call_count, 3)
        rejected = publisher.subprocess.CalledProcessError(1, 'git', '', '! [rejected] non-fast-forward')
        with unittest.mock.patch.object(publisher, 'command', side_effect=rejected) as commands, unittest.mock.patch.object(publisher.time, 'sleep'):
            with self.assertRaises(publisher.subprocess.CalledProcessError): publisher.net('git', 'push')
            self.assertEqual(commands.call_count, 1)
        eof = publisher.URLError('[SSL: UNEXPECTED_EOF_WHILE_READING] EOF occurred in violation of protocol')
        with unittest.mock.patch.object(publisher.time, 'sleep'):
            with self.assertRaises(publisher.URLError): publisher.retrying(unittest.mock.Mock(side_effect=eof), publisher.connection_level)
            missing = unittest.mock.Mock(side_effect=publisher.HTTPError('u', 404, 'nf', {}, None))
            with self.assertRaises(publisher.HTTPError): publisher.retrying(missing, publisher.connection_level)
            self.assertEqual(missing.call_count, 1)
            missing.side_effect.close()
        with tempfile.TemporaryDirectory() as folder, unittest.mock.patch.object(publisher.time, 'sleep'):
            (Path(folder)/'a.css').write_bytes(b'x')
            response = unittest.mock.MagicMock(status=200); response.headers.items.return_value = [('Content-Length', '2'), ('ETag', '"00"')]
            response.__enter__.return_value = response
            opener = unittest.mock.Mock(return_value=response)
            with unittest.mock.patch.object(publisher, 'urlopen', opener):
                with self.assertRaises(ValueError): publisher.head(('a.css', {'url': 'https://example.invalid/a.css', 'bytes': 1, 'sha256': '0'}), Path(folder))
            self.assertEqual(opener.call_count, 1)
    def test_last_attempt_write_failure_keeps_the_original_error_and_receipt(self):
        with tempfile.TemporaryDirectory() as temporary:
            folder = Path(temporary); (folder/'dist').mkdir()
            options = types.SimpleNamespace(output=folder/'run', dist=folder/'dist', dry_run=False)
            with unittest.mock.patch.object(publisher.retention, 'shared', side_effect=OSError('shared unavailable')) as shared:
                with self.assertRaises(FileNotFoundError): publisher.publish(options)
            shared.assert_called_once()
            self.assertEqual(publisher.retention.read(folder/'run'/'publish-receipt.json')['status'], 'failed')
    def test_one_html_zero_resources_and_same_hash_new_key(self):
        old = {'a.js': {'key': 'releases/old/a.js', 'sha256': 'a'}, 'index.html': {'sha256': 'b'}}
        self.assertEqual(set(publisher.delta({'old/a.js': old['a.js'], 'index.html': {'sha256': 'c'}}, old)), {'index.html'})
        self.assertEqual(set(publisher.delta({'a.js': {'key': 'releases/new/a.js', 'sha256': 'a'}}, old)), {'a.js'})
    def test_dry_run_commits_a_local_orphan_without_remote_writes(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)/'dist'; root.mkdir()
            (root/'index.html').write_bytes(b'<h1>fixture</h1>\r\n')
            (root/'a.js').write_bytes(b'console.log(1)')
            publisher.oss.write(root/'release-manifest.json', {'fixture': True, 'release_id': 'fixture', 'files': publisher.oss.inventory(root)})
            publisher.oss.finalize_dist(root, source_commit='a'*40)
            publisher.oss.write(root/'.build-receipt.json', {'source_commit': 'a'*40})
            scan = Path(temporary)/'scan.json'
            publisher.oss.write(scan, {'fixture': True, 'failures': [], 'dist_files_sha256':
                {path.relative_to(root).as_posix(): publisher.oss.digest(path) for path in root.rglob('*') if path.is_file()}})
            options = types.SimpleNamespace(output=Path(temporary)/'run', dist=root, scan_result=scan, previous_manifest=None, source_commit=None, dry_run=True)
            real = publisher.command
            with unittest.mock.patch.object(publisher.retention, 'predecessor', return_value=None), unittest.mock.patch.object(publisher.retention, 'shared') as shared, unittest.mock.patch.object(publisher, 'command', side_effect=lambda *args, **kwargs: '' if 'ls-remote' in args else real(*args)) as commands:
                receipt = publisher.publish(options)
            shared.assert_not_called()  # 干跑不写 last-attempt.json
            self.assertEqual((receipt['status'], receipt['site_dist']['parent'], receipt['uploaded_files']), ('dry_run', [], 0))
            self.assertEqual((receipt['source_commit'], receipt['source_commit_evidence']), ('a'*40, 'build receipt'))
            self.assertEqual(publisher.oss.read(Path(receipt['site_dist']['root'])/'release-identity.json')['source_commit'], receipt['source_commit'])
            self.assertFalse(any('push' in call.args or publisher.CLI in call.args or 'gh' in call.args for call in commands.call_args_list))
            self.assertFalse((Path(receipt['site_dist']['root'])/'.github/workflows/pages.yml').exists())
            for name in ('index.html', 'release-manifest.json', 'release-identity.json'): self.assertEqual((root/name).read_bytes(), (Path(receipt['site_dist']['root'])/name).read_bytes())
