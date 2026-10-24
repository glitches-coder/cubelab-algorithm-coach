const FACES = ['U', 'D', 'F', 'B', 'R', 'L'];

export const FACE_COLORS = Object.freeze({
  U: '#f4f1e8', // white
  D: '#ffdf36', // yellow
  F: '#00b85a', // green
  B: '#1688f5', // blue
  R: '#f0444d', // red
  L: '#ff842e'  // orange
});

export const FACE_NORMALS = Object.freeze({
  U: [0, 1, 0], D: [0, -1, 0],
  F: [0, 0, 1], B: [0, 0, -1],
  R: [1, 0, 0], L: [-1, 0, 0]
});

// Define each face's screen-right and screen-up vectors when looking straight at it.
// This makes 2D facelets agree with standard face-relative move notation.
const FACE_BASIS = Object.freeze({
  U: { right: [1, 0, 0], up: [0, 0, -1] },
  D: { right: [1, 0, 0], up: [0, 0, 1] },
  F: { right: [1, 0, 0], up: [0, 1, 0] },
  B: { right: [-1, 0, 0], up: [0, 1, 0] },
  R: { right: [0, 0, -1], up: [0, 1, 0] },
  L: { right: [0, 0, 1], up: [0, 1, 0] }
});

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0]
];
const vecKey = v => v.join(',');
const stickerKey = sticker => `${vecKey(sticker.position)}|${vecKey(sticker.normal)}`;

function addFaceStickers(stickers, face) {
  const normal = FACE_NORMALS[face];
  const { right, up } = FACE_BASIS[face];
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const position = [
        normal[0] + right[0] * (col - 1) + up[0] * (1 - row),
        normal[1] + right[1] * (col - 1) + up[1] * (1 - row),
        normal[2] + right[2] * (col - 1) + up[2] * (1 - row)
      ];
      stickers.push({ position, normal: [...normal], color: FACE_COLORS[face], homeFace: face });
    }
  }
}

export function createSolvedCube() {
  const stickers = [];
  FACES.forEach(face => addFaceStickers(stickers, face));
  return stickers;
}

function quarterTurnAroundAxis(vector, axis, turns) {
  // Exact integer quarter turns; +1 is a right-hand-rule +90° rotation.
  let result = [...vector];
  const count = ((turns % 4) + 4) % 4;
  for (let i = 0; i < count; i += 1) {
    const parallel = axis.map(component => component * dot(axis, result));
    const perpendicular = cross(axis, result);
    result = [
      parallel[0] + perpendicular[0],
      parallel[1] + perpendicular[1],
      parallel[2] + perpendicular[2]
    ];
  }
  return result;
}

export function parseFaceMove(token) {
  const match = /^([URFDLB])([2']?)$/.exec(String(token || '').trim());
  if (!match) {
    throw new Error(`Unsupported move "${token}". The face-state engine currently accepts U, D, R, L, F, B with optional prime or 2.`);
  }
  const [, face, suffix] = match;
  return { face, suffix, normal: FACE_NORMALS[face], turns: suffix === '2' ? 2 : suffix === "'" ? 1 : -1 };
}

export function applyMove(state, token) {
  const { normal, turns } = parseFaceMove(token);
  return state.map(sticker => {
    // A face turn rotates all stickers belonging to cubies in that outer layer,
    // not only the stickers whose normals point at the active face.
    if (dot(sticker.position, normal) !== 1) {
      return { ...sticker, position: [...sticker.position], normal: [...sticker.normal] };
    }
    return {
      ...sticker,
      position: quarterTurnAroundAxis(sticker.position, normal, turns),
      normal: quarterTurnAroundAxis(sticker.normal, normal, turns)
    };
  });
}

export function applyAlgorithm(state, algorithm) {
  const tokens = String(algorithm || '')
    .replace(/[()]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return tokens.reduce((current, token) => applyMove(current, token), state);
}

export function invertMove(token) {
  const { face, suffix } = parseFaceMove(token);
  if (suffix === '2') return `${face}2`;
  return suffix === "'" ? face : `${face}'`;
}

export function invertAlgorithm(algorithm) {
  const tokens = String(algorithm || '').replace(/[()]/g, ' ').trim().split(/\s+/).filter(Boolean);
  return tokens.reverse().map(invertMove).join(' ');
}

export function getFaceGrid(state, face) {
  if (!FACE_NORMALS[face]) throw new Error(`Unknown face "${face}"`);
  const normal = FACE_NORMALS[face];
  const { right, up } = FACE_BASIS[face];
  const byPosition = new Map(state.map(sticker => [stickerKey(sticker), sticker.color]));
  const grid = [];
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const position = [
        normal[0] + right[0] * (col - 1) + up[0] * (1 - row),
        normal[1] + right[1] * (col - 1) + up[1] * (1 - row),
        normal[2] + right[2] * (col - 1) + up[2] * (1 - row)
      ];
      grid.push(byPosition.get(stickerKey({ position, normal })) || '#f0f');
    }
  }
  return grid;
}

export function isSolved(state) {
  return FACES.every(face => getFaceGrid(state, face).every(color => color === FACE_COLORS[face]));
}

export function faceSummary(state, face) {
  return getFaceGrid(state, face).map(color => color.toUpperCase());
}

export const FACE_ORDER = FACES;
