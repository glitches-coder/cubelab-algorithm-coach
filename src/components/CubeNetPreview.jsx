import React, { useMemo } from 'react';
import { FACE_COLORS, FACE_ORDER, applyMove, createSolvedCube, getFaceGrid } from '../engine/cubeState.js';

function Face({ face, state, activeFace }) {
  const colors = getFaceGrid(state, face);
  return <div className={`net-face net-face-${face.toLowerCase()} ${activeFace === face ? 'net-face-active' : ''}`} aria-label={`${face} face color layout after move`}>
    <b>{face}</b>
    <div className="net-stickers">{colors.map((color, i) => <i key={i} style={{ background: color }} />)}</div>
  </div>;
}

function Net({ state, move, label }) {
  const activeFace = move.replace(/[2']/g, '');
  return <div className="net-snapshot">
    <div className="net-title"><strong>{label}</strong><span>{label === 'After turn' ? move : 'Solved reference'}</span></div>
    <div className="cube-net">
      <Face face="U" state={state} activeFace={activeFace} />
      <Face face="L" state={state} activeFace={activeFace} />
      <Face face="F" state={state} activeFace={activeFace} />
      <Face face="R" state={state} activeFace={activeFace} />
      <Face face="B" state={state} activeFace={activeFace} />
      <Face face="D" state={state} activeFace={activeFace} />
    </div>
  </div>;
}

export default function CubeNetPreview({ move }) {
  const state = useMemo(() => {
    const solved = createSolvedCube();
    return { solved, after: applyMove(solved, move) };
  }, [move]);
  return <details className="state-preview">
    <summary>Show how {move} moves stickers around the cube <span>6-face state model</span></summary>
    <p className="state-help">The active face rotates as one layer. Stickers on the four neighboring faces travel with that layer; the center-face color stays attached to its face.</p>
    <div className="net-comparison">
      <Net state={state.solved} move={move} label="Before turn" />
      <Net state={state.after} move={move} label="After turn" />
    </div>
    <div className="state-legend"><i style={{background:FACE_COLORS.U}}/> White / U <i style={{background:FACE_COLORS.F}}/> Green / F <i style={{background:FACE_COLORS.R}}/> Red / R <i style={{background:FACE_COLORS.B}}/> Blue / B <i style={{background:FACE_COLORS.L}}/> Orange / L <i style={{background:FACE_COLORS.D}}/> Yellow / D</div>
  </details>;
}
