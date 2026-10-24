import React from 'react';

const FACE_NAMES = { U:'Up', D:'Down', R:'Right', L:'Left', F:'Front', B:'Back', M:'Middle slice', E:'Equator slice', S:'Standing slice', x:'x rotation', y:'y rotation', z:'z rotation' };

export function parseMove(move) {
  const face = move.replace(/[2']/g, '');
  const prime = move.includes("'");
  const half = move.includes('2');
  return { face, prime, half, direction: half ? 'Half turn · 180°' : prime ? 'Counterclockwise' : 'Clockwise', name: FACE_NAMES[face] || face };
}

export default function MoveDiagram({ move, viewMode = 'both', hand = 'right', compact = false }) {
  const { face, prime, half, direction, name } = parseMove(move);
  const opposite = ['B','D','L'].includes(face);
  const projectedDirection = half ? '180° either way' : (prime ? 'CCW' : 'CW');
  const physicalHint = (() => {
    if (half) return 'Use the most comfortable two-part turn; either direction completes a half-turn.';
    if (face === 'F') return prime ? 'Try the opposite front-face finger action; keep both thumbs anchored if comfortable.' : 'Common starting cue: a controlled right-index push. Keep the cube stable.';
    if (face === 'B') return prime ? 'Back-face counterclockwise from behind. Reposition or use a controlled push/pull that matches your grip.' : 'Back-face clockwise from behind. The apparent direction reverses from a front-side viewpoint.';
    if (face === 'R') return prime ? 'Common cue: pull the right layer down with the right index/ring finger, depending on grip.' : 'Common cue: push the right layer up with the right hand; avoid squeezing the whole cube.';
    if (face === 'L') return prime ? 'Common cue: use the left hand to turn the left face counterclockwise; avoid a full regrip if possible.' : 'Common cue: use a controlled left-hand action; choose the finger that keeps the cube stable.';
    if (face === 'U') return prime ? 'Try a left-index flick from the back-to-front direction, or the comfortable equivalent for your grip.' : 'Try a right-index flick from the back-to-front direction, or the comfortable equivalent for your grip.';
    if (face === 'D') return 'Bottom turns are grip-dependent; start slowly and avoid twisting the wrist under tension.';
    return 'Use a stable grip and make the notation viewpoint explicit before practising speed.';
  })();
  const arrowText = half ? '↻ 180° ↻' : prime ? '↺' : '↻';
  const finger = face === 'F' ? (prime ? 'Opposite front-finger action' : 'Right index · suggested') : face === 'B' ? (prime ? 'Back-face reverse action' : 'Back-face forward action') : face === 'U' ? (prime ? 'Left index · suggested' : 'Right index · suggested') : face === 'R' ? (prime ? 'Pull / reverse action' : 'Push / forward action') : face === 'L' ? (prime ? 'Left-hand reverse action' : 'Left-hand forward action') : 'Grip-dependent';
  return <div className={`diagram-wrap ${compact ? 'compact' : ''}`}>
    {(viewMode === 'both' || viewMode === 'face') && <div className="diagram-card">
      <div className="diagram-label">FACE-ON VIEW <span>looking directly at {name.toLowerCase()}</span></div>
      <div className={`face-visual face-${face.toLowerCase()}`} aria-label={`${move}, ${direction}, viewed directly at ${name} face`}>
        <div className="face-grid">{Array.from({length:9}, (_,i)=><i key={i} />)}</div>
        <div className={`direction-arrow ${prime ? 'prime' : ''} ${half ? 'half' : ''}`}><span>{arrowText}</span></div>
      </div>
      <div className="direction-caption"><strong>{direction}</strong><span>{move} · {name} face</span></div>
    </div>}
    {(viewMode === 'both' || viewMode === 'hands') && <div className="diagram-card hand-card">
      <div className="diagram-label">YOUR HOLD <span>{hand === 'right' ? 'right-handed cue' : 'left-handed cue'}</span></div>
      <div className="hand-stage">
        <div className="mini-cube"><div className="mini-face front">F</div><div className="mini-face right">R</div><div className="mini-face top">U</div><div className="mini-face back">B</div></div>
        <div className="finger-callout"><div className="finger-glyph">{face === 'F' || face === 'B' ? '☝' : face === 'U' ? (hand === 'right' ? '☝' : '☝') : '✋'}</div><strong>{hand === 'left' && face === 'U' ? (prime ? 'Right index · alternate' : 'Left index · alternate') : finger}</strong><span>{physicalHint}</span></div>
      </div>
      <div className="direction-caption"><strong>{opposite ? 'Viewpoint changes the apparent direction' : 'Keep the reference face in mind'}</strong><span>{opposite ? 'Do not judge B from the front-face viewpoint.' : 'Notation is face-relative; finger technique is a practical choice.'}</span></div>
    </div>}
  </div>;
}
