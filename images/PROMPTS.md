# Nano-Banana Image Prompts — drop-in guide

This site currently ships with crisp inline **SVG** visuals (fast-loading, zero layout
shift, great for SEO). To upgrade to phot/render-style **nano-banana (Gemini) images**,
generate each file below at the given filename and size, drop it in `/images/`, and swap
the corresponding SVG for an `<img>` (or set it as a CSS `background-image`).

## How to generate (once a Gemini key is available in this environment)
This environment does **not** currently have `GEMINI_API_KEY`. Add it via
Claude Code (web) → environment settings → Environment variables, then either:
- ask this session to generate + wire them, or
- run your fleet tool: `node _shared/tools/nano-banana.mjs "<prompt>" images/<file>.png`
  (use `GEMINI_IMAGE_MODEL=gemini-3-pro-image` for anything with legible text/logos),
  then `cwebp -q 82 images/<file>.png -o images/<file>.webp`.

**House style for every prompt:** dark navy/slate background (#0a0f1c), electric teal
(#29d3c9) and signal-blue (#4f9dff) accents, high-contrast, cinematic, clean, no text
baked into the image, 16:10 unless noted, subtle engineering/simulation aesthetic.

---

## Hero (home) — `hero.png` (1600×1000)
Cinematic CFD/aerothermal simulation of a sleek hypersonic vehicle, glowing false-color
pressure contours (teal→amber→red) streaming over the airframe, faint computational mesh
overlay, dark navy background, volumetric glow, photoreal render, no text.

## OG social cover — `og-cover.png` (1200×630)
(Replaces `assets/og-cover.svg`.) Same hero scene, more negative space on the left third
for headline text overlay. Dark navy, teal/blue accents.

## Top-10 application tiles (each 800×500, filename in parentheses)
1. Hypersonics (`app-hypersonics.png`) — Mach-5 vehicle with red-hot leading-edge aerothermal heating, CFD streamlines.
2. Ballistics (`app-ballistics.png`) — high-speed projectile impacting layered composite armor, LS-DYNA-style fracture/fragmentation, stress contours.
3. Antenna/RF (`app-antenna.png`) — phased-array antenna with glowing 3D radiation-pattern lobes (HFSS far-field), teal/blue.
4. Electronics cooling (`app-thermal.png`) — circuit board / chip with false-color thermal plume and airflow arrows (Icepak style).
5. Propulsion (`app-propulsion.png`) — rocket engine / scramjet combustion CFD, luminous reacting flow through a nozzle.
6. Satellite (`app-satellite.png`) — small satellite in orbit with thermal-gradient shading and orbital-mechanics arcs (STK style).
7. Microelectronics (`app-microelectronics.png`) — semiconductor package cross-section with signal/power-integrity field visualization.
8. Power electronics (`app-power.png`) — electric motor / inverter with electromagnetic flux lines (Maxwell style), teal glow.
9. UAV (`app-uav.png`) — quadcopter/fixed-wing UAV with CFD airflow over rotors/wings, streamlines.
10. Directed energy (`app-directed-energy.png`) — high-energy laser beam with optical beam-path and thermal blooming (Zemax style).

## Physics category thumbnails (optional, 400×400)
`phys-cfd.png`, `phys-fea.png`, `phys-em.png`, `phys-optics.png` — abstract macro renders
of each physics (flow, stress mesh, EM field, optical rays).

## Team / trust (optional, 1200×800) — `team.png`
Photoreal: professional engineers reviewing a large simulation result on a monitor in a
modern office; diverse, credible, U.S. B2B. (B2B buyers convert on real people — swap in
actual team photos when available.)
