# CubeLab Algorithm Coach (React SPA)

A responsive React + Vite single-page app designed to teach 3×3 move notation, face-relative direction, finger-trick fundamentals, algorithm recall, and a beginner-friendly CFOP learning progression.

## Run locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
npm test
```

## Deploy from your phone

You do not need Node.js on your phone. Connect this repository to Netlify and use the included `netlify.toml` configuration:

- Build command: `npm run build`
- Publish directory: `dist`

Start at <https://app.netlify.com/start>, import this repository from GitHub, and deploy the `main` branch. Netlify builds the app in its own environment. See [DEPLOY_FROM_PHONE.md](./DEPLOY_FROM_PHONE.md) for the detailed steps.

## What's included

- **Move Lab:** select F/B/R/L/U/D, prime turns and half turns; each face shows the correct standard stickerless color for the fixed white-up, green-front, red-right reference grip.
- **Synchronized visual cues:** face-on direction plus a hand diagram that highlights the suggested index/middle/ring finger and mirrors when left-handed mode is selected.
- **Cube-state engine:** 54-sticker layer-turn model for U/D/R/L/F/B, prime moves and half turns; open the six-face before/after preview under a move.
- **Hand preference:** right- or left-handed cue wording.
- **Algorithm Library:** starter triggers and selected CFOP learning examples with step navigation, source links and cautions.
- **Finger Trick School:** grip stability, flicks, reverse moves and trigger practice.
- **Recall Practice:** clockwise/counterclockwise recognition quiz and session score.
- **Learning progression:** notation → triggers → intuitive F2L → 2-look OLL/PLL → full PLL/OLL.
- **Local progress:** learned flags are saved in the browser's localStorage.

## Accuracy and scope

Move direction is face-relative: clockwise/counterclockwise is judged while looking directly at the face being turned. Refer to the <https://www.worldcubeassociation.org/regulations/> and <https://jperm.net/3x3/moves>.

Finger tricks are suggestions, not a uniquely correct finger-to-move mapping. Grip, handedness, cube orientation, algorithm context and comfort affect technique. See <https://jperm.net/3x3/fingertricks>.

**The included algorithm data is a starter learning set, not a complete or fully case-validated OLL/PLL/F2L database.** Several entries are triggers or case-dependent study examples and are marked with cautions. Do not treat them as a complete case-solving reference. A production release should use a reviewed dataset with case setup, algorithm variants, AUF, source attribution and explicit verification status.

The face-on arrow is an animated 2D cue with its arrowhead aligned to the arc tangent. The before/after net is driven by a 54-sticker cube state engine. The hand artwork is a schematic teaching aid, not an anatomical simulation; its finger mapping is a recommended starting point and should not be treated as the only valid technique.

## Next engineering steps

1. Extend the state engine to wide turns, slices and cube rotations.
2. Define a verified case schema with setup state, algorithm variants, AUF, recognition cues, finger-trick notes, references and verification status.
3. Verify algorithms by applying them to known case states and checking the resulting solved/case state.
4. Replace schematic cues with SVG diagrams driven by explicit face-orientation transforms.
5. Add spaced repetition, timed recall, personal algorithm variants and import/export.

## References

- World Cube Association — Regulations: <https://www.worldcubeassociation.org/regulations/>
- J Perm — move notation: <https://jperm.net/3x3/moves>
- J Perm — finger tricks: <https://jperm.net/3x3/fingertricks>
- J Perm — CFOP: <https://jperm.net/3x3/cfop>
- CubeSkills — tutorials: <https://www.cubeskills.com/tutorials>
