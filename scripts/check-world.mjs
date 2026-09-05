import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { MeshStandardMaterial, Texture } from 'three';
import { convertMaterialsToMeshBasicMaterial } from '../world/Experience/utils/convertMaterial.js';
import { portfolio } from '../portfolio.config.js';
import { chapterAt, dampProgress, useWorldStore } from '../world/Experience/stores/worldStore.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const texture = new Texture();
const materials = { sample: new MeshStandardMaterial({ map: texture }) };
convertMaterialsToMeshBasicMaterial(materials, 0.74);
const converted = materials.sample;
assert.equal(converted.isMeshBasicMaterial, true);
assert.equal(converted.map, texture);
assert.equal(converted.alphaTest, 0.74);
for (let frame = 0; frame < 120; frame++) convertMaterialsToMeshBasicMaterial(materials, 0.74);
assert.equal(materials.sample, converted, 'Frames must reuse GPU materials');
converted.dispose();
texture.dispose();

const modelDirectory = path.join(root, 'world/Experience/models');
let modelCount = 0;
for (const filename of await readdir(modelDirectory)) {
  const source = await readFile(path.join(modelDirectory, filename), 'utf8');
  const asset = source.match(/useGLTFWithKTX2\(\s*["']([^"']+)/)?.[1];
  assert.ok(asset, `Missing asset in ${filename}`);
  const buffer = await readFile(path.join(root, 'public', asset));
  assert.equal(buffer.toString('ascii', 0, 4), 'glTF');
  assert.equal(buffer.readUInt32LE(4), 2);
  assert.equal(buffer.readUInt32LE(8), buffer.length, 'Truncated model');
  const jsonLength = buffer.readUInt32LE(12);
  const model = JSON.parse(buffer.toString('utf8', 20, 20 + jsonLength));
  const nodeNames = new Set(model.nodes.map(node => node.name));
  for (const [, name] of source.matchAll(/nodes\.([a-zA-Z0-9_]+)/g)) {
    assert.ok(nodeNames.has(name), `${filename}: missing GLB node ${name}`);
  }
  modelCount++;
}
assert.equal(modelCount, 10);
for (const asset of ['basis/basis_transcoder.js', 'basis/basis_transcoder.wasm', 'draco/draco_decoder.js', 'draco/draco_decoder.wasm', 'draco/draco_wasm_wrapper.js', 'fonts/Minecraft-Regular.woff2', 'audio/music/meadow-loop.wav', 'audio/sfx/ButtonClick.mp3', 'audio/sfx/DoorOpening.mp3', 'audio/sfx/DoorClosing.mp3', 'media/og/og-image.webp', ...['px', 'nx', 'py', 'ny', 'pz', 'nz'].map(face => `cubemap/${face}.webp`)]) {
  await access(path.join(root, 'public', asset));
}
assert.deepEqual(Object.keys(portfolio.projects), ['one', 'two', 'three', 'four']);
assert.ok(portfolio.name && portfolio.role);
for (const project of Object.values(portfolio.projects)) {
  assert.ok(project.title && project.description);
  for (const url of [project.url, project.repository]) if (url) assert.match(url, /^https:\/\//);
}
const travel = fps => {
  let position = 0;
  for (let i = 0; i < fps; i++) position = dampProgress(position, 1, 1 / fps);
  return position;
};
assert.ok(Math.abs(travel(60) - travel(120)) < 1e-10, 'Camera damping must not depend on refresh rate');
assert.equal(dampProgress(0, 1, 10), dampProgress(0, 1, .05), 'A stalled frame must not teleport the camera');
assert.equal(dampProgress(.5, 1, 0), .5);
assert.deepEqual([0, .18, .365, .59, .75, .9].map(chapterAt), ['meadow', 'house', 'gallery', 'about', 'house', 'meadow']);

const world = useWorldStore.getState();
world.discover('missing');
assert.equal(useWorldStore.getState().discovered.length, 0);
world.discover('one');
world.discover('one');
assert.deepEqual(useWorldStore.getState().discovered, ['one'], 'A project only counts once');
for (const id of ['two', 'three', 'four']) world.discover(id);
assert.equal(useWorldStore.getState().notice.title, 'The whole collection!');
world.setTouring(true);
world.setPhotoMode(true);
assert.equal(useWorldStore.getState().touring, false, 'Photo mode pauses the tour');
world.jumpTo(.365);
const previousJump = useWorldStore.getState().jump.id;
world.jumpTo(.365);
assert.equal(useWorldStore.getState().jump.id, previousJump + 1, 'Repeated destinations must remain actionable');
assert.equal(useWorldStore.getState().photoMode, false);
world.jumpTo(Infinity);
assert.equal(useWorldStore.getState().jump.progress, 0);
world.jumpTo(5);
assert.equal(useWorldStore.getState().jump.progress, 1);
let updates = 0;
const unsubscribe = useWorldStore.subscribe(() => updates++);
world.publishProgress(.361);
world.publishProgress(.362);
assert.equal(updates, 1, 'HUD updates only when its displayed percentage changes');
unsubscribe();
console.log('Passed: 10 world models, local assets, material reuse, frame-independent motion, chapters, tour/photo controls, jump bounds, and project achievements.');
