import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FACE_COLORS, FACE_ORDER, applyAlgorithm, applyMove, createSolvedCube,
  getFaceGrid, invertAlgorithm, invertMove, isSolved, parseFaceMove
} from './cubeState.js';

test('solved cube contains 54 facelets and nine stickers of each face color', () => {
  const cube = createSolvedCube();
  assert.equal(cube.length, 54);
  for (const face of FACE_ORDER) {
    const grid = getFaceGrid(cube, face);
    assert.equal(grid.length, 9);
    assert.ok(grid.every(color => color === FACE_COLORS[face]), `${face} should start uniform`);
  }
  assert.equal(isSolved(cube), true);
});

test('face-relative direction metadata covers clockwise, prime, and half turns', () => {
  assert.equal(parseFaceMove('F').turns, -1);
  assert.equal(parseFaceMove("F'").turns, 1);
  assert.equal(parseFaceMove('F2').turns, 2);
  assert.equal(parseFaceMove('B').normal[2], -1);
  assert.equal(parseFaceMove('F').normal[2], 1);
});

test('each move followed by its inverse restores the solved state', () => {
  for (const face of FACE_ORDER) {
    for (const move of [face, `${face}'`, `${face}2`]) {
      const inverse = invertMove(move);
      const result = applyMove(applyMove(createSolvedCube(), move), inverse);
      assert.equal(isSolved(result), true, `${move} then ${inverse} should solve`);
    }
  }
});

test('four quarter turns restore solved state on every face', () => {
  for (const face of FACE_ORDER) {
    let cube = createSolvedCube();
    for (let i = 0; i < 4; i++) cube = applyMove(cube, face);
    assert.equal(isSolved(cube), true, `${face} four times should solve`);
  }
});

test('face turn preserves active face uniformity and moves adjacent stickers', () => {
  const solved = createSolvedCube();
  const afterF = applyMove(solved, 'F');
  assert.ok(getFaceGrid(afterF, 'F').every(color => color === FACE_COLORS.F));
  assert.notDeepEqual(getFaceGrid(afterF, 'U'), getFaceGrid(solved, 'U'));
  assert.notDeepEqual(getFaceGrid(afterF, 'R'), getFaceGrid(solved, 'R'));
});

test('algorithm followed by generated inverse restores solved state', () => {
  const algorithm = "R U R' U' F R U R' U' F'";
  const result = applyAlgorithm(applyAlgorithm(createSolvedCube(), algorithm), invertAlgorithm(algorithm));
  assert.equal(isSolved(result), true);
});

test('invalid or unsupported notation fails explicitly rather than silently corrupting state', () => {
  assert.throws(() => applyMove(createSolvedCube(), 'x'), /Unsupported move/);
  assert.throws(() => applyMove(createSolvedCube(), 'Fw'), /Unsupported move/);
});
