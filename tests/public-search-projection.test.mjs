import assert from 'node:assert/strict';
import test from 'node:test';
import { publicSearchRecord, publicSearchText } from '../app/public-search-projection.js';
import { compactSearchProjection, serializeSearchAsset } from '../app/search-assets.js';

test('public search replaces actual path spans while preserving authored surrounding words',()=>{
  for(const value of ['E:\\Fixture\\steps.md','file:///E:/Fixture/picture.png','\\\\fixture\\files\\input.json']){
    assert.equal(publicSearchText('先读 '+value+'。保留原件。'),'先读 （本机路径）。保留原件。');
  }
  assert.equal(publicSearchText('https://example.com/page.pdf'),'https://example.com/page.pdf');
});

test('regular React search generation and serializer use the public whitelist',()=>{
  const raw={type:'项目',group:'项目',title:'例子',href:'/projects/example/',detail:'先读 E:\\Fixture\\steps.md。保留原件。',compactSearch:'来源 file:///E:/Fixture/picture.png。继续说明。',aliases:['\\\\fixture\\files\\input.json'],source_path:'E:\\Fixture\\provenance.json',registry:{host_path:'E:\\Fixture\\registry.json'}};
  const projected=compactSearchProjection(raw);
  assert.equal(projected.detail,'先读 （本机路径）。保留原件。');
  assert.ok(!('source_path' in projected)&&!('registry' in projected));
  const text=serializeSearchAsset([raw,projected]);
  assert.ok(!text.includes('Fixture')&&!text.includes('fixture')&&!text.includes('source_path')&&!text.includes('registry'));
  assert.ok(text.includes('（本机路径）'));
  assert.equal(publicSearchRecord({...projected,producer:'internal'}).producer,undefined);
});
