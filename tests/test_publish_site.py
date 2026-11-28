import importlib.util, tempfile, types, unittest.mock
import io, json, ssl
from http.client import HTTPResponse, IncompleteRead, RemoteDisconnected
from pathlib import Path
spec = importlib.util.spec_from_file_location('publisher', Path(__file__).resolve().parents[1]/'site-astro/tools/publish_site.py')
publisher = importlib.util.module_from_spec(spec); spec.loader.exec_module(publisher)
class PublishTests(unittest.TestCase):
    def setUp(self):
        gate = unittest.mock.patch.object(publisher, 'scan_public_words', return_value=[])
        gate.start(); self.addCleanup(gate.stop)
        proofs = unittest.mock.patch.object(publisher, 'check_input_proofs', return_value={})
        proofs.start(); self.addCleanup(proofs.stop)
        self.real_check_live_fallback = publisher.check_live_fallback
        fallback = unittest.mock.patch.object(publisher, 'check_live_fallback', return_value=1)
        fallback.start(); self.addCleanup(fallback.stop)
    def test_update_batch_rejects_unselected_html_in_common_outputs(self):
        commit, digest = 'a'*40, 'b'*64
        batch = {'run_id': 'run', 'batch_id': 'batch', 'source_commit': commit,
                 'release_id': 'fixture', 'manifest_sha256': digest,
                 'pages': {'changed': {'route': '/changed/', 'merged_commit': commit}},
                 'allowed_routes': ['/changed/']}
        reconciliation = {'baseline': 'published', 'pages': [{'path': 'changed/index.html'}],
                          'site_files': [{'path': 'sitemap.xml'}]}
        self.assertTrue(publisher.check_update_batch(batch, {'release_id': 'fixture'}, commit, digest, reconciliation))
        reconciliation['site_files'].append({'path': '404.html'})
        with self.assertRaisesRegex(ValueError, '404.html'):
            publisher.check_update_batch(batch, {'release_id': 'fixture'}, commit, digest, reconciliation)

    def test_only_shared_address_changes_preserve_the_unselected_html(self):
        base = 'https://fixture-bucket.oss-cn-beijing.aliyuncs.com'
        path = 'example/content.js'
        reports = ('first.html', 'second.html', 'third.html')

        def fixture(label):
            key = f'releases/{label}/{path}'
            url = f'{base}/{key}'
            pages = {rel: f'<body data-page="{Path(rel).stem}"><script src="{url}"></script></body>'.encode()
                     for rel in reports}
            manifest = {'source_commit': label*40, 'oss': {'asset_base_url': base,
                        'objects': {path: {'key': key, 'url': url}}, 'reference_keys': ['_v.gif']},
                        'files': {rel: {'sha256': publisher.hashlib.sha256(raw).hexdigest()}
                                  for rel, raw in pages.items()}}
            return pages, manifest

        old, previous = fixture('a')
        new, source = fixture('b')
        raw_old = b'window.PROJECT_CONFIG = {"pages":{}};\nwindow.PAGE_DATA = {"first":["old"],"second":["same"],"third":["old"]};'
        raw_new = b'window.PROJECT_CONFIG = {"pages":{}};\nwindow.PAGE_DATA = {"first":["edited"],"second":["same"],"third":["edited"]};'
        with tempfile.TemporaryDirectory() as temporary, unittest.mock.patch.object(
                publisher.selected_publish, 'git_file', side_effect=(raw_old, raw_new)):
            dist = Path(temporary)
            for rel, raw in new.items():
                (dist / rel).write_bytes(raw)
            changes = [{'path': rel} for rel in reports]
            retained = publisher.selected_publish.preserve_html(
                dist, source, previous, changes, {'first.html'}, old.__getitem__, None)
            self.assertEqual(retained, {'second.html': old['second.html']})

    def test_retained_html_keeps_old_dependencies_but_not_replaced_image(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            fixed = {
                'index.html': '<h1>Home</h1>', 'changed.html': '<img src="/new.webp">',
                'unchanged.html': '<script src="/a.js"></script>',
                'a.js': 'console.log("changed");', 'new.webp': 'new image',
            }
            old = {**fixed, 'changed.html': '<img src="/old.webp">', 'old.webp': 'old image',
                   'a.js': 'fetch("./data.json")', 'data.json': '{"image":"leaf.webp"}', 'assets/leaf.webp': 'used image'}

            del old['new.webp']

            def build(name, files):
                dist = root/name
                for rel, text in files.items():
                    path = dist/rel; path.parent.mkdir(parents=True, exist_ok=True); path.write_text(text, 'utf-8')
                publisher.oss.write(dist/'release-manifest.json', {'release_id': name, 'files': publisher.oss.inventory(dist)})
                return dist, publisher.oss.finalize_dist(dist, full=True)

            before, previous = build('old', old)
            _, source = build('new', fixed)
            args = types.SimpleNamespace(previous_site_dist=before, dry_run=True)
            retained = {'unchanged.html': (before/'unchanged.html').read_bytes()}
            with unittest.mock.patch.object(publisher.retention, 'shared', return_value=root):
                keys, gaps = publisher.retained_resources(args, source, previous, {}, retained)
            publication = publisher.publication_manifest(source, retained, previous, keys)
            old_objects = {rel: row['key'] for rel, row in previous['oss']['objects'].items()}
            refs = set(publication['oss']['reference_keys'])
            self.assertEqual(gaps, {})
            self.assertEqual(refs.intersection(old_objects.values()),
                             {old_objects[rel] for rel in ('a.js', 'data.json', 'assets/leaf.webp')})
            self.assertNotIn(old_objects['old.webp'], refs)
            self.assertEqual(publication['files']['unchanged.html'], previous['files']['unchanged.html'])

    def test_preserved_script_must_match_its_old_hash_and_current_public_words(self):
        with tempfile.TemporaryDirectory() as temporary:
            folder = Path(temporary)
            rel, key = 'example/content.js', 'releases/earlier/example/content.js'
            file, base = folder/rel, 'https://example.test'
            url = f'{base}/{key}'
            file.parent.mkdir()
            raw = '已撤出的句子'.encode('utf-8')
            file.write_bytes(raw)
            previous = {'oss': {'asset_base_url': base, 'objects': {
                rel: {'key': key, 'url': url, 'sha256': publisher.hashlib.sha256(raw).hexdigest()}}}}
            source = {'oss': {'objects': {}}}
            args = types.SimpleNamespace(previous_site_dist=folder, dry_run=True)
            retained = {'example/old.html': f'<script src="{url}"></script>'.encode()}
            with unittest.mock.patch.object(publisher.retention, 'shared', return_value=folder):
                with unittest.mock.patch.object(publisher.word_policy, 'load_policy',
                                                  return_value={'owner_row_words': ['已撤出的句子']}):
                    with self.assertRaisesRegex(ValueError, 'example/old.html'):
                        publisher.review_preserved_scripts(args, source, previous, {}, retained)
                file.write_bytes(b'other payload')
                with self.assertRaisesRegex(ValueError, '无法核验'):
                    publisher.review_preserved_scripts(args, source, previous, {}, retained)

    def test_publication_stops_without_a_usable_live_fallback(self):
        required = {'home', 'tasks', 'projects?state=active'}
        with tempfile.TemporaryDirectory() as temporary, unittest.mock.patch.object(
            publisher.live_fallback, 'load_exporter'
        ) as exporter:
            dist = Path(temporary); path = dist/'live/_fallback.json'
            with self.assertRaisesRegex(ValueError, '缺失或读不出'): self.real_check_live_fallback(dist)
            path.parent.mkdir()
            body = {'v': 1, 'at': '2026-11-17T00:00:00+08:00', 'viewer': {'kind': 'public'}, 'data': {}}
            def write(resources):
                payload = {'publication': {'policy': 'policy-11'}, 'resources': resources}
                path.write_text(json.dumps(payload), 'utf-8')
                return payload
            write({'items': None, 'tasks': {**body, 'viewer': {'kind': 'owner'}}})
            with self.assertRaisesRegex(ValueError, '缺少入口 home.*身份非公开 tasks.*正文无效 items'):
                self.real_check_live_fallback(dist)
            resources = dict.fromkeys(required | {'tasks?cursor=2'}, body)
            write(dict(resources, **{'tasks?cursor=2': {**body, 'viewer': {'kind': 'owner'}}}))
            with self.assertRaisesRegex(ValueError, '身份非公开 tasks\\?cursor=2'):
                self.real_check_live_fallback(dist)
            payload = write(resources)
            self.assertEqual(self.real_check_live_fallback(dist), 4)
            exporter.return_value.check_fallback_publication.assert_called_once_with(payload, require_metadata=True)
    def test_old_run_with_readonly_git_object_is_pruned_without_removing_retained_runs(self):
        with tempfile.TemporaryDirectory() as temporary:
            folder = Path(temporary)
            for number in range(1, 5):
                (folder/f'publish-{number}').mkdir()
            object_file = folder/'publish-1/site-dist/.git/objects/60/example'
            object_file.parent.mkdir(parents=True)
            object_file.write_bytes(b'fictional git object')
            object_file.chmod(0o444)
            result = publisher.prune_publish_runs(folder, folder/'no-pointer.json')
            self.assertFalse((folder/'publish-1').exists())
            self.assertEqual(len(result['removed']), 1)
            self.assertTrue(all((folder/f'publish-{number}').is_dir() for number in range(2, 5)))

    def test_publication_collects_after_success_and_preserves_head_proofs_and_failure_state(self):
        for fail_page, fail_cleanup, skip_retention, recovered, revive in (
                (False, False, False, False, False), (False, True, False, False, False),
                (True, False, False, False, False), (False, False, True, False, False),
                (False, False, False, True, True), (True, False, False, True, False)):
            with self.subTest(fail_page=fail_page, fail_cleanup=fail_cleanup, revive=revive), tempfile.TemporaryDirectory() as temporary:
                folder = Path(temporary); root = folder/'dist'; root.mkdir()
                for rel in ('index.html', 'cockpit/index.html', 'computer-access/index.html', 'unchanged/index.html', 'a.js'):
                    target = root/rel; target.parent.mkdir(parents=True, exist_ok=True); target.write_bytes(b'fixture')
                publisher.oss.write(root/'release-manifest.json', {'schema': 'wly.hybrid-release.v1', 'release_id': 'fixture', 'files': publisher.oss.inventory(root), 'input_fingerprints': {'fixture': 'kept'}})
                source = publisher.oss.finalize_dist(root)
                scan = folder/'scan.json'
                publisher.oss.write(scan, {'failures': [], 'dist_files_sha256':
                    {path.relative_to(root).as_posix(): publisher.oss.digest(path) for path in root.rglob('*') if path.is_file()}})
                options = types.SimpleNamespace(output=folder/'run', dist=root, scan_result=scan, previous_manifest=None,
                    source_commit=None, dry_run=False, upload_only=False, lock_holder='fixture', upload_workers=1, pages_timeout=1,
                    skip_retention=skip_retention)
                shared = folder/'shared'
                bucket_sample = {'bytes': 1024, 'objects': 7, 'provider_updated_at': 1234}
                def proof(item, dist):
                    rel, row = item
                    return rel, {'status': 'pass', 'http': 200, 'bytes': row['bytes'], 'sha256': row['sha256'], 'headers': {'ETag': '"'+'a'*32+'"'}}
                head_calls = []
                def probe(item, dist):
                    head_calls.append(item[0])
                    if revive and len(head_calls) == 1:
                        raise FileNotFoundError('retired remote object')
                    return proof(item, dist)
                def collect(args):
                    self.assertIsNone(args.rollback)
                    self.assertTrue((shared/'published.json').exists())
                    self.assertEqual(publisher.retention.read(folder/'run/publish-receipt.json')['status'], 'published')
                    registered = publisher.retention.read(shared/'managed.json')['objects']
                    self.assertTrue(all(row['etag'] == 'a'*32 for row in registered.values()))
                    if fail_cleanup: raise OSError('cloud delete failed')
                    publisher.retention.write(args.report, {'status': 'complete', 'deleted_objects': 0, 'deleted_bytes': 0,
                                                            'bucket_after': bucket_sample})
                    return 0
                previous = None
                if recovered:
                    previous = {**source, 'oss': {**source['oss'], 'verification': {
                        'schema': 'wly.oss-incremental-verification.v1', 'release_id': source['release_id'], 'complete': True,
                        'objects': {rel: proof((rel, row), root)[1] for rel, row in source['oss']['objects'].items()}}},
                        'publication_readback_required': True}
                with unittest.mock.patch.dict('sys.modules', {'live_project': types.SimpleNamespace(record=unittest.mock.Mock(side_effect=RuntimeError('record fixture failed')))}), \
                     unittest.mock.patch.object(publisher.retention, 'predecessor', return_value=previous), \
                     unittest.mock.patch.object(publisher.retention, 'retired_predecessor_keys',
                        return_value={source['oss']['objects']['a.js']['key']} if revive else set()), \
                     unittest.mock.patch.object(publisher.retention, 'shared', return_value=shared), \
                     unittest.mock.patch.object(publisher.retention, 'bucket_stat', return_value=bucket_sample), \
                     unittest.mock.patch.object(publisher.retention, 'collect', side_effect=collect) as cleanup, \
                     unittest.mock.patch.object(publisher, 'head', side_effect=probe), \
                     unittest.mock.patch.object(publisher, 'command', return_value='{"status":"acquired"}') as commands, \
                     unittest.mock.patch.object(publisher, 'artifact_commit', return_value={'root': str(root), 'commit': 'a'*40, 'changed_files': []}), \
                     unittest.mock.patch.object(publisher, 'pages', return_value=42), \
                     unittest.mock.patch.object(publisher, 'get_page', side_effect=lambda item: (item[0],
                         {'status': 'failed', 'url': 'https://example.invalid/'+item[0], 'retry_count': 4} if fail_page
                         else {'status': 'pass', 'sha256': item[1]['sha256']})):
                    if fail_page:
                        with self.assertRaisesRegex(ValueError, 'Public HTML GET failed: https://example.invalid/'): publisher.publish(options)
                        cleanup.assert_not_called(); self.assertFalse((shared/'published.json').exists())
                        failed = publisher.retention.read(folder/'run/publish-receipt.json')
                        self.assertEqual((len(failed['get']), failed['get_summary']['failed']), (4, 4))
                    else:
                        result = publisher.publish(options)
                        self.assertEqual(result['status'], 'published')
                        self.assertEqual(result['publication_status'], 'published')
                        saved = publisher.retention.read(shared/'published.json')
                        self.assertEqual(saved['manifest']['input_fingerprints'], {'fixture': 'kept'})
                        self.assertEqual(saved['build_files']['release-identity.json']['sha256'], publisher.oss.digest(root/'release-identity.json'))
                        self.assertIn('unchanged/index.html', result['get'])
                        registered = publisher.retention.read(shared/'managed.json')['objects']
                        self.assertTrue(all(row['etag'] == 'a'*32 for row in registered.values()))
                        if skip_retention:
                            cleanup.assert_not_called()
                            self.assertEqual(result['oss_retention']['bucket_after'], bucket_sample)
                        else:
                            cleanup.assert_called_once()
                            self.assertEqual(result['oss_retention']['receipt'], str(folder/'run/oss-retention.json'))
                        self.assertEqual(result['oss_retention']['status'], 'skipped_by_request' if skip_retention
                                         else 'incomplete' if fail_cleanup else 'complete')
                        self.assertEqual(result['oss_retention']['deleted_objects'], 0)
                        if revive:
                            self.assertEqual(head_calls, ['a.js', 'a.js'])
                            self.assertEqual(result['uploaded_files'], 1)
                            self.assertEqual(sum(call.args[1:3] == ('ossutil', 'cp') for call in commands.call_args_list), 1)
                attempt = publisher.retention.read(shared/'last-attempt.json')
                self.assertEqual(attempt['status'], 'failed' if fail_page else result['status'])
                self.assertEqual((attempt['dry_run'], attempt['source_commit']), (False, 'Unknown'))
                self.assertTrue(attempt['completed_at_beijing'].endswith('+08:00'))
                self.assertNotIn('head', attempt)
                if not fail_page and not fail_cleanup: self.assertEqual(attempt['last_bucket_stat'], bucket_sample)
                if fail_page: self.assertIn('https://example.invalid/', attempt['error'])
    def test_standalone_retention_uses_success_receipt_and_releases_its_own_lock(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary); receipt = {'publication_status': 'published', 'dry_run': False, 'commit': 'a'*40}
            publisher.retention.write(root/'publish-receipt.json', receipt)
            original_report = root/'oss-retention.json'
            publisher.retention.write(original_report, {'status': 'incomplete'})
            latest = root/'shared/last-attempt.json'
            publisher.retention.write(latest, {'status': 'failed', 'source_commit': 'b'*40})
            sample = {'bytes': 11, 'objects': 1, 'provider_updated_at': 1234}
            args = types.SimpleNamespace(retention_only=root, lock_holder='cleanup', dry_run=False, retention_max_keys=1000)
            def finish(options):
                publisher.retention.write(options.report, {'status': 'complete', 'bucket_after': sample})
                return 0
            with unittest.mock.patch.object(publisher, 'command', return_value='{"status":"acquired"}') as commands, \
                 unittest.mock.patch.object(publisher.retention, 'collect', side_effect=finish) as collect, \
                 unittest.mock.patch.object(publisher.retention, 'shared', return_value=latest.parent), \
                 unittest.mock.patch.object(publisher, 'prune_publish_runs', return_value={}):
                result = publisher.collect_after_publication(args)
                self.assertEqual(result['status'], 'retention_complete')
                self.assertEqual(publisher.retention.read(latest), {'status': 'failed', 'source_commit': 'b'*40, 'last_bucket_stat': sample})
                self.assertEqual(publisher.retention.read(original_report)['status'], 'incomplete')
                self.assertTrue(Path(result['receipt']).parent.name.startswith('oss-retention-retry-'))
                self.assertEqual(collect.call_args.args[0].commit, receipt['commit'])
                self.assertIn('Release', commands.call_args.args)
                receipt['dry_run'] = True; publisher.retention.write(root/'publish-receipt.json', receipt)
                with self.assertRaisesRegex(ValueError, 'successful real publication'): publisher.collect_after_publication(args)
                self.assertEqual(collect.call_count, 1)
                receipt['dry_run'] = False; publisher.retention.write(root/'publish-receipt.json', receipt)
                commands.return_value = '{"status":"renewed"}'
                with self.assertRaisesRegex(ValueError, 'fresh lock'): publisher.collect_after_publication(args)
                self.assertEqual(collect.call_count, 1)
                commands.return_value = '{"status":"acquired"}'; collect.side_effect = OSError('cleanup failed')
                with self.assertRaisesRegex(OSError, 'cleanup failed'): publisher.collect_after_publication(args)
                self.assertIn('Release', commands.call_args.args)
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
    def test_pages_default_waits_for_completion_after_preparation_and_deployment(self):
        for budget, succeeds in ((600, False), (publisher.PAGES_CONFIRM_TIMEOUT, True)):
            clock = [0]
            def command(*args, **kwargs):
                if args[1:3] == ('workflow', 'run'):
                    return 'https://github.com/wlyaaaaa/wly0829.cn/actions/runs/42'
                clock[0] += min(50, kwargs['timeout'])
                return publisher.json.dumps({'status': 'completed' if clock[0] >= 700 else 'in_progress',
                                             'conclusion': 'success' if clock[0] >= 700 else None})
            with self.subTest(budget=budget), unittest.mock.patch.object(publisher, 'command', side_effect=command) as calls, \
                 unittest.mock.patch.object(publisher.time, 'monotonic', side_effect=lambda: clock[0]), \
                 unittest.mock.patch.object(publisher.time, 'sleep', side_effect=lambda delay: clock.__setitem__(0, clock[0]+delay)):
                if succeeds:
                    self.assertEqual(publisher.pages('a'*40, budget), 42)
                else:
                    with self.assertRaises(TimeoutError): publisher.pages('a'*40, budget)
            self.assertEqual(sum(call.args[1:3] == ('workflow', 'run') for call in calls.call_args_list), 1)
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
    def test_public_head_retries_transport_errors_but_rejects_local_http_and_content_errors(self):
        payload = b'x'; digest = publisher.hashlib.sha256(payload).hexdigest()
        with tempfile.TemporaryDirectory() as temporary, unittest.mock.patch.object(publisher.time, 'sleep') as sleeps:
            root = Path(temporary); (root/'a.css').write_bytes(payload)
            item = ('a.css', {'url': 'https://example.invalid/a.css', 'bytes': 1, 'sha256': digest})
            for head in (True,):
                run = lambda: publisher.head(item, root)
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

    def test_public_pages_retry_transfers_and_5xx_with_five_attempt_limit(self):
        payload = b'fixture'; digest = publisher.hashlib.sha256(payload).hexdigest()
        item = ('fixture/index.html', {'sha256': digest})
        failures = [ssl.SSLEOFError('SSL EOF'), RemoteDisconnected('connection interrupted'),
                    IncompleteRead(b'x', 2), TimeoutError('timed out'), publisher.URLError(ConnectionResetError('reset')),
                    publisher.HTTPError('https://example.invalid', 503, 'unavailable', {}, None)]
        for failure in failures:
            with self.subTest(failure=type(failure).__name__), unittest.mock.patch.object(publisher.time, 'sleep') as sleeps:
                response = io.BytesIO(payload); response.status = 200
                with unittest.mock.patch.object(publisher, 'urlopen', side_effect=[failure, failure, response]) as calls:
                    rel, proof = publisher.get_page(item)
                self.assertEqual((rel, proof['status'], proof['attempt_count'], proof['retry_count']), (item[0], 'pass', 3, 2))
                self.assertEqual((calls.call_count, [call.args[0] for call in sleeps.call_args_list]), (3, [0.5, 1]))
                self.assertEqual(proof['sha256'], digest)
                self.assertTrue(all(row['retryable'] for row in proof['attempts'][:-1]))
                self.assertNotIn('error', proof)
        with unittest.mock.patch.object(publisher.time, 'sleep') as sleeps, \
             unittest.mock.patch.object(publisher, 'urlopen', side_effect=ssl.SSLEOFError('always broken')) as calls:
            proof = publisher.get_page(item)[1]
        self.assertEqual((proof['status'], proof['attempt_count'], proof['retry_count'], calls.call_count), ('failed', 5, 4, 5))
        self.assertEqual([call.args[0] for call in sleeps.call_args_list], [0.5, 1, 2, 4])
        self.assertEqual(proof['url'], 'https://wly0829.cn/fixture/?publish='+digest[:16])

    def test_public_pages_retry_a_truncated_http_body_before_comparing_content(self):
        payload = b'fixture'; digest = publisher.hashlib.sha256(payload).hexdigest()
        def response(body):
            stream = io.BytesIO(b'HTTP/1.1 200 OK\r\nContent-Length: 7\r\n\r\n'+body)
            result = HTTPResponse(types.SimpleNamespace(makefile=lambda *args: stream))
            result.begin()
            self.addCleanup(result.close)
            return result
        with unittest.mock.patch.object(publisher, 'urlopen', side_effect=[response(b'fix'), response(payload)]) as calls, \
             unittest.mock.patch.object(publisher.time, 'sleep') as sleeps:
            proof = publisher.get_page(('index.html', {'sha256': digest}))[1]
        self.assertEqual((proof['status'], proof['attempt_count'], proof['retry_count']), ('pass', 2, 1))
        self.assertEqual(calls.call_count, 2)
        self.assertEqual(proof['attempts'][0]['error_type'], 'IncompleteRead')
        self.assertTrue(proof['attempts'][0]['retryable'])
        self.assertEqual(proof['sha256'], digest)
        sleeps.assert_called_once_with(0.5)

    def test_public_pages_reject_wrong_content_and_non_retryable_http_immediately(self):
        item = ('index.html', {'sha256': publisher.hashlib.sha256(b'expected').hexdigest()})
        for status, body in ((200, b'wrong'), (404, b'missing'), (201, b'wrong')):
            with self.subTest(status=status), unittest.mock.patch.object(publisher.time, 'sleep') as sleeps:
                response = io.BytesIO(body); response.status = status; response.headers = {}
                with unittest.mock.patch.object(publisher, 'urlopen', return_value=response) as calls:
                    proof = publisher.get_page(item)[1]
                self.assertEqual((proof['status'], proof['http'], proof['attempt_count'], calls.call_count), ('failed', status, 1, 1))
                sleeps.assert_not_called()
                self.assertFalse(proof['attempts'][0]['retryable'])
                if status == 200: self.assertEqual(proof['sha256'], publisher.hashlib.sha256(body).hexdigest())

    def test_public_page_batch_finishes_and_keeps_every_url_when_one_keeps_disconnecting(self):
        payload = b'fixture'; digest = publisher.hashlib.sha256(payload).hexdigest()
        selected = {rel: {'sha256': digest} for rel in ('index.html', 'broken/index.html', 'last/index.html')}
        def fetch(request, timeout):
            if '/broken/' in request.full_url: raise IncompleteRead(b'x', 2)
            response = io.BytesIO(payload); response.status = 200
            return response
        receipt = {'get': {}}
        with unittest.mock.patch.object(publisher, 'urlopen', side_effect=fetch), unittest.mock.patch.object(publisher.time, 'sleep'):
            with self.assertRaisesRegex(ValueError, 'https://wly0829.cn/broken/'):
                publisher.verify_pages(selected, receipt)
        self.assertEqual(set(receipt['get']), set(selected))
        self.assertEqual((receipt['get_summary']['passed'], receipt['get_summary']['failed'], receipt['get_summary']['retries']), (2, 1, 19))
        self.assertEqual(receipt['get_summary']['failed_urls'], [receipt['get']['broken/index.html']['url']])
        self.assertEqual(receipt['get']['last/index.html']['status'], 'pass')

    def test_public_page_rounds_only_repeat_transport_failures_and_preserve_all_attempts(self):
        payload = b'fixture'; digest = publisher.hashlib.sha256(payload).hexdigest()
        selected = {rel+'/index.html': {'sha256': digest} for rel in ('pass', 'recover', 'broken', 'missing', 'wrong')}
        calls = {rel: 0 for rel in selected}
        def fetch(request, timeout):
            rel = request.full_url.split('https://wly0829.cn/', 1)[1].split('/?', 1)[0]+'/index.html'
            calls[rel] += 1
            if rel.startswith('broken/') or (rel.startswith('recover/') and calls[rel] <= 5):
                raise IncompleteRead(b'x', 2)
            if rel.startswith('missing/'):
                raise publisher.HTTPError(request.full_url, 404, 'missing', {}, None)
            response = io.BytesIO(b'wrong' if rel.startswith('wrong/') else payload); response.status = 200
            return response
        receipt = {'get': {}}; checkpoints = []
        with tempfile.TemporaryDirectory() as temporary, \
             unittest.mock.patch.object(publisher, 'urlopen', side_effect=fetch), unittest.mock.patch.object(publisher.time, 'sleep') as sleeps:
            path = Path(temporary)/'publish-receipt.json'
            def checkpoint():
                publisher.oss.write(path, receipt)
                checkpoints.append(publisher.oss.read(path))
            with self.assertRaisesRegex(ValueError, 'https://wly0829.cn/broken/'):
                publisher.verify_pages(selected, receipt, checkpoint)
        self.assertEqual(calls, {'pass/index.html': 1, 'recover/index.html': 6, 'broken/index.html': 20,
                                 'missing/index.html': 1, 'wrong/index.html': 1})
        self.assertEqual((receipt['get_summary']['passed'], receipt['get_summary']['failed'], receipt['get_summary']['attempts'],
                          receipt['get_summary']['retries'], receipt['get_summary']['rounds']), (2, 3, 29, 24, 4))
        self.assertEqual([row['wait_seconds'] for row in receipt['get_rounds']], [0, 120, 150, 180])
        self.assertEqual([call.args[0] for call in sleeps.call_args_list if call.args[0] >= 120], [120, 150, 180])
        self.assertEqual([set(row['results']) for row in receipt['get_rounds']],
                         [set(selected), {'broken/index.html', 'recover/index.html'}, {'broken/index.html'}, {'broken/index.html'}])
        recovered = receipt['get']['recover/index.html']
        self.assertEqual((recovered['status'], recovered['attempt_count'], recovered['retry_count'], recovered['round_count']), ('pass', 6, 5, 2))
        self.assertEqual([attempt['round'] for attempt in recovered['attempts']], [1, 1, 1, 1, 1, 2])
        self.assertEqual(receipt['get_rounds'][0]['results']['recover/index.html']['status'], 'failed')
        self.assertEqual(receipt['get_rounds'][1]['results']['recover/index.html']['status'], 'pass')
        self.assertEqual([row['get_summary']['rounds'] for row in checkpoints], [1, 2, 3, 4])
        self.assertEqual([row['get_summary']['attempts'] for row in checkpoints], [13, 19, 24, 29])
        self.assertEqual([row['get']['recover/index.html']['status'] for row in checkpoints], ['failed', 'pass', 'pass', 'pass'])
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
    def test_publication_omits_fixtures_but_preserves_preview_and_bound_metadata(self):
        with tempfile.TemporaryDirectory() as temporary:
            folder = Path(temporary); root = folder/'dist'; root.mkdir()
            fixture_value = 'DEMO_ONLY'
            for rel, text in {'index.html': '<h1>public</h1>', 'a.js': 'console.log(1)',
                              'live/_fixtures/demo/index.html': f'password="{fixture_value}"',
                              'live/_fixtures/demo/home.json': json.dumps({'password': fixture_value}, separators=(',', ':')),
                              'live/public.json': '{"ok":true}'}.items():
                path = root/rel; path.parent.mkdir(parents=True, exist_ok=True); path.write_text(text, 'utf-8')
            publisher.oss.write(root/'release-manifest.json', {'release_id': 'fixture', 'files': publisher.oss.inventory(root)})
            original = publisher.oss.finalize_dist(root, source_commit='a'*40)
            publisher.oss.write(root/'.build-receipt.json', {'source_commit': 'a'*40})
            fingerprints = {p.relative_to(root).as_posix(): publisher.oss.digest(p) for p in root.rglob('*') if p.is_file()}
            scan = folder/'scan.json'; publisher.oss.write(scan, {'failures': [], 'dist_files_sha256': fingerprints})
            options = types.SimpleNamespace(output=folder/'run', dist=root, scan_result=scan, previous_manifest=None, source_commit=None, dry_run=True)
            real = publisher.command
            with unittest.mock.patch.object(publisher.retention, 'predecessor', return_value=None), \
                 unittest.mock.patch.object(publisher, 'command', side_effect=lambda *a, **kw: '' if 'ls-remote' in a else real(*a, **kw)):
                receipt = publisher.publish(options)
            self.assertEqual(receipt['status'], 'dry_run')
            self.assertEqual(len(receipt['excluded_files']), 2)
            plan = publisher.oss.read(folder/'run/oss-plan.json')
            artifact = Path(receipt['site_dist']['root'])
            published = publisher.oss.read(artifact/'release-manifest.json')
            publisher.oss.verify_manifest(published, require_remote=False)
            self.assertNotEqual(original['release_id'], published['release_id'])
            for rows in (plan['objects'], plan['github_files'], published['files'], published['oss']['objects']):
                self.assertFalse(any(rel.startswith('live/_fixtures/') for rel in rows))
            self.assertIn('live/public.json', plan['objects'])
            self.assertFalse((artifact/'live/_fixtures').exists())
            identity = publisher.oss.read(artifact/'release-identity.json')
            self.assertEqual(identity['release_id'], published['release_id'])
            self.assertEqual(identity['manifest_sha256'], publisher.oss.digest(artifact/'release-manifest.json'))
            self.assertEqual({p.relative_to(root).as_posix(): publisher.oss.digest(p) for p in root.rglob('*') if p.is_file()}, fingerprints)

    def test_publication_baseline_skips_fixtures_without_exempting_live_data(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary); demo = root/'live/_fixtures/home.json'
            demo.parent.mkdir(parents=True); demo.write_text('{"password":"DEMO_ONLY"}', 'utf-8')
            with unittest.mock.patch.object(publisher.word_policy, 'baseline_hits', wraps=publisher.word_policy.baseline_hits) as scan:
                self.assertEqual(publisher.check_publication_text(root)['blocking_hits'], [])
                scan.assert_not_called()
            self.assertEqual({hit['file'] for hit in publisher.word_policy.scan_baseline(root)}, {'dist/live/_fixtures/home.json'})
            public = root/'live/current.json'; public.write_bytes(demo.read_bytes())
            hits = publisher.check_publication_text(root)['blocking_hits']
            self.assertEqual({hit['file'] for hit in hits}, {'dist/live/current.json'})

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
