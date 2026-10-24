import React from 'react';
import CubeNetPreview from './CubeNetPreview.jsx';

const FACE_NAMES = { U: 'Up', D: 'Down', R: 'Right', L: 'Left', F: 'Front', B: 'Back' };
const FACE_COLORS = {
  // Standard stickerless RS3M-style reference grip: white U, green F, red R.
  U: '#f4f1e8', D: '#ffdf36', F: '#00b85a', B: '#1688f5', R: '#f0444d', L: '#ff842e'
};
const INK = { U: '#33342f', D: '#292916', F: '#062b19', B: '#071d36', R: '#3c1115', L: '#39200f' };

export function parseMove(move) {
  const face = String(move || 'F').replace(/[2']/g, '');
  const prime = String(move || '').includes("'");
  const half = String(move || '').includes('2');
  return {
    face,
    prime,
    half,
    direction: half ? 'Half turn · 180°' : prime ? 'Counterclockwise' : 'Clockwise',
    name: FACE_NAMES[face] || face,
    color: FACE_COLORS[face] || '#8e9aa8'
  };
}

function arcGeometry(clockwise) {
  // Build a sampled 300° arc, then calculate its arrowhead along the end tangent.
  // This keeps the arrowhead aligned for both directions instead of relying on CSS rotation.
  const cx = 120, cy = 120, radius = 75;
  const start = (clockwise ? -140 : -40) * Math.PI / 180;
  const sweep = (clockwise ? 300 : -300) * Math.PI / 180;
  const points = [];
  const steps = 48;
  for (let i = 0; i <= steps; i++) {
    const a = start + sweep * i / steps;
    points.push([cx + radius * Math.cos(a), cy + radius * Math.sin(a)]);
  }
  const d = points.map((p, i) => `${i ? 'L' : 'M'} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(' ');
  const endAngle = start + sweep;
  const sign = Math.sign(sweep);
  const tx = -Math.sin(endAngle) * sign;
  const ty = Math.cos(endAngle) * sign;
  const tip = points[points.length - 1];
  const length = 15, halfWidth = 8;
  const bx = tip[0] - tx * length;
  const by = tip[1] - ty * length;
  const nx = -ty, ny = tx;
  const arrow = [
    tip,
    [bx + nx * halfWidth, by + ny * halfWidth],
    [bx - nx * halfWidth, by - ny * halfWidth]
  ].map(p => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
  return { d, arrow };
}

function HandIllustration({ side, active, finger, activeLabel }) {
  const mirrored = side === 'left';
  const fingerX = { index: 30, middle: 42, ring: 54, pinky: 66 };
  const xs = [30, 42, 54, 66];
  return (
    <div className={`hand-choice ${active ? 'is-active' : 'is-inactive'}`}>
      <div className="hand-heading">
        <span>{side === 'left' ? 'LEFT HAND' : 'RIGHT HAND'}</span>
        {active && <b>ACTIVE CUE</b>}
      </div>
      <svg className="hand-illustration" viewBox="0 0 120 106" role="img" aria-label={`${side} hand, ${active ? 'active' : 'inactive'} finger cue`}>
        <g transform={mirrored ? 'translate(120 0) scale(-1 1)' : undefined}>
          <rect x="38" y="72" width="38" height="31" rx="12" fill="#9d775e" />
          <rect x="25" y="48" width="62" height="39" rx="17" fill="#d2ad8a" stroke="#f1d5b7" strokeWidth="1.4" />
          {xs.map((x, i) => {
            const key = ['index', 'middle', 'ring', 'pinky'][i];
            const isHot = active && finger === key;
            const height = [43, 51, 47, 35][i];
            const top = 49 - height;
            return <rect key={key} x={x} y={top} width="10" height={height + 19}
              rx="5" fill={isHot ? '#c7f36b' : '#d2ad8a'}
              stroke={isHot ? '#efffcf' : '#f1d5b7'} strokeWidth={isHot ? '2' : '1.4'} />;
          })}
          <rect x="8" y="54" width="29" height="15" rx="7" transform="rotate(-34 22 61.5)"
            fill={active && finger === 'thumb' ? '#c7f36b' : '#d2ad8a'}
            stroke={active && finger === 'thumb' ? '#efffcf' : '#f1d5b7'} strokeWidth="1.4" />
          {active && finger !== 'thumb' && fingerX[finger] != null &&
            <path d={`M ${fingerX[finger] + 5} 12 L ${fingerX[finger] + 5} 20`} stroke="#c7f36b" strokeWidth="3" strokeLinecap="round" />}
        </g>
      </svg>
      <div className="hand-role">{active ? activeLabel : 'Other hand stabilizes the cube'}</div>
    </div>
  );
}

export default function MoveDiagram({ move, viewMode = 'both', hand = 'right', compact = false }) {
  const { face, prime, half, direction, name, color } = parseMove(move);
  const isBack = face === 'B';
  const isFront = face === 'F';
  const localClockwise = !prime;
  // When seen from the normal front grip, the back face's apparent direction is reversed.
  const frontViewDirection = half ? '180° either way' : (isBack ? (prime ? 'clockwise' : 'counterclockwise') : (prime ? 'counterclockwise' : 'clockwise'));

  let cueHand = 'right';
  let finger = 'index';
  if (face === 'F') cueHand = localClockwise ? 'right' : 'left';
  else if (face === 'B') cueHand = localClockwise ? 'left' : 'right';
  else if (face === 'R') { cueHand = 'right'; finger = prime ? 'ring' : 'index'; }
  else if (face === 'L') { cueHand = 'left'; finger = prime ? 'index' : 'ring'; }
  else if (face === 'U') cueHand = localClockwise ? 'right' : 'left';
  else if (face === 'D') { cueHand = localClockwise ? 'right' : 'left'; finger = 'thumb'; }

  // The handedness selector mirrors the recommended cue rather than only changing a label.
  if (hand === 'left') cueHand = cueHand === 'right' ? 'left' : 'right';
  if (half) finger = 'index';
  const activeLabel = half ? 'Use a comfortable two-part 180° turn' : `${cueHand === 'right' ? 'Right' : 'Left'} ${finger} finger initiates the turn`;
  const physicalHint = half
    ? 'A half turn is 180°. Practise it as two controlled quarter-turns; either direction reaches the same face position.'
    : isFront
      ? `${direction} on the front face. From a steady reference grip, the ${cueHand} index-finger cue makes the direction explicit.`
      : isBack
        ? `${direction} when looking directly at the back face. From your usual front-side viewpoint it appears ${frontViewDirection}; use the ${cueHand} index-finger cue as a reminder.`
        : face === 'U'
          ? `${direction} on the top face. Start with a small ${cueHand}-index flick and keep both thumbs planted.`
          : face === 'R' || face === 'L'
            ? `${direction} on the ${name.toLowerCase()} face. Use the highlighted ${finger} finger as a starting cue; keep the cube anchored rather than twisting the whole wrist.`
            : `${direction} on the bottom face. Bottom turns are grip-dependent; practise slowly with the highlighted ${finger} cue and don't force your wrist.`;

  const arc = arcGeometry(!prime);
  const rotationName = half ? 'half turn' : direction.toLowerCase();
  const handsVisible = viewMode === 'both' || viewMode === 'hands';
  const faceVisible = viewMode === 'both' || viewMode === 'face';

  return (
    <div className={`diagram-wrap cube-lesson-diagram ${compact ? 'compact' : ''} ${viewMode === 'hands' ? 'hands-only' : ''} ${viewMode === 'face' ? 'face-only' : ''}`}>
      {faceVisible && <section className="diagram-card face-lesson-card">
        <div className="diagram-label">
          <span>FACE-ON VIEW</span>
          <small>Look directly at the face being turned</small>
        </div>
        <div className="face-visual" style={{ '--face-color': color, '--face-ink': INK[face] || '#17202a' }} aria-label={`${move}: ${direction} viewed directly at the ${name} face`}>
          <div className="face-cubies">
            {Array.from({ length: 9 }, (_, i) => <i key={i} className={i === 4 ? 'center-cubie' : ''} />)}
          </div>
          <svg className={`turn-arrow ${half ? 'is-half-turn' : ''}`} viewBox="0 0 240 240" role="img" aria-label={`${rotationName} arrow`}>
            {!half && <path d={arc.d} className="turn-arrow-track" />}
            {!half && <polygon points={arc.arrow} className="turn-arrow-head" />}
            {half && <g className="half-arrow">
              <path d="M 60 120 A 60 60 0 0 1 180 120" className="turn-arrow-track" />
              <path d="M 180 120 A 60 60 0 0 1 60 120" className="turn-arrow-track" />
              <path d="M 60 120 l 10 -10 M 60 120 l 10 10 M 180 120 l -10 -10 M 180 120 l -10 10" className="turn-arrow-track" />
            </g>}
          </svg>
          <div className="face-center-label">{move}</div>
        </div>
        <div className="direction-caption">
          <strong>{half ? 'Turn 180°' : direction}</strong>
          <span>{move} · {name} face · {face === 'B' ? 'clockwise is judged from behind the cube' : 'clockwise is judged from this face-on view'}</span>
        </div>
        <CubeNetPreview move={move} />
      </section>}

      {handsVisible && <section className="diagram-card grip-lesson-card">
        <div className="diagram-label">
          <span>YOUR GRIP</span>
          <small>{hand === 'right' ? 'Right-handed cue map' : 'Left-handed cue map'}</small>
        </div>
        <div className="reference-cube-row">
          <svg className="reference-cube" viewBox="0 0 180 150" role="img" aria-label="Solved cube reference: white top, green front, red right, orange left, blue back, yellow bottom">
            <polygon points="25,43 87,10 150,43 87,76" fill={FACE_COLORS.U} stroke="#101319" strokeWidth="3" />
            <polygon points="25,43 87,76 87,137 25,104" fill={FACE_COLORS.F} stroke="#101319" strokeWidth="3" />
            <polygon points="87,76 150,43 150,104 87,137" fill={FACE_COLORS.R} stroke="#101319" strokeWidth="3" />
            <g fill="#11161d" fontSize="11" fontWeight="800" textAnchor="middle">
              <text x="88" y="47">U · WHITE</text><text x="54" y="94">F · GREEN</text><text x="119" y="94">R · RED</text>
            </g>
            <rect x={face === 'B' ? 8 : 118} y={face === 'B' ? 4 : 112} width="50" height="23" rx="6" fill={FACE_COLORS[face] || '#4b5563'} stroke="#f7f7f7" strokeWidth="1.4" opacity={face === 'B' ? 1 : 0}/>
            {face === 'B' && <text x="33" y="20" fill={INK.B} textAnchor="middle" fontSize="10" fontWeight="900">B · BLUE</text>}
            <rect x={face === 'L' ? 5 : 0} y="115" width="60" height="22" rx="6" fill={FACE_COLORS.L} opacity={face === 'L' ? 1 : 0}/>
            {face === 'L' && <text x="35" y="130" fill={INK.L} textAnchor="middle" fontSize="10" fontWeight="900">L · ORANGE</text>}
            <rect x={face === 'D' ? 113 : 0} y="115" width="60" height="22" rx="6" fill={FACE_COLORS.D} opacity={face === 'D' ? 1 : 0}/>
            {face === 'D' && <text x="143" y="130" fill={INK.D} textAnchor="middle" fontSize="10" fontWeight="900">D · YELLOW</text>}
          </svg>
          <div className="grip-summary">
            <span className="active-finger-badge">SUGGESTED ACTION</span>
            <strong>{activeLabel}</strong>
            <p>{physicalHint}</p>
            {isBack && <div className="projection-note"><b>Perspective flip</b><span>B {direction.toLowerCase()} from the back = {frontViewDirection} from the normal front-side view.</span></div>}
          </div>
        </div>
        <div className="hands-stage" aria-label="Finger cue map">
          <HandIllustration side="left" active={cueHand === 'left' || half} finger={finger} activeLabel={half ? 'Half-turn support' : cueHand === 'left' ? `Use left ${finger}` : 'Stabilize the cube'} />
          <HandIllustration side="right" active={cueHand === 'right' || half} finger={finger} activeLabel={half ? 'Half-turn support' : cueHand === 'right' ? `Use right ${finger}` : 'Stabilize the cube'} />
        </div>
        <div className="hand-principle">
          <b>Keep the reference grip fixed.</b>
          <span>Handedness changes which hand is highlighted. It never changes what the move notation means.</span>
        </div>
      </section>}
    </div>
  );
}
