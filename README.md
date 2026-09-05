# Minecraft Portfolio

A close adaptation of [Andrew Woan's Minecraft portfolio](https://www.woanminecraftfolio.com/), using the original MIT-licensed 3D world, camera path, textures, animations, and pixel interface. The original copyright and license are preserved in `LICENSE.md`.

## Run

```sh
npm install
npm run dev
```

Open the local URL printed by the server. The cinematic title screen offers **Enter the world** or an automatic **guided tour**. Scroll, drag, or swipe to travel into the house; manual movement pauses the tour. Click the glowing pictures for projects and About. The **?** menu also provides keyboard-accessible portfolio links. Tab to the world and use arrow keys or W/S to travel; Home returns to the beginning. The inventory hotbar and keys **1?7** open Spawn, Projects, About, Contact, Guided tour, Photo mode, and Guide. Photo mode hides the HUD for an unobstructed view. Escape exits photo mode or closes a panel. Project discoveries are counted once per session and earn advancement toasts. Fireflies, chapter captions, and the journey meter bring the landscape to life.

## Personalize

Edit `portfolio.config.js` to set your name, role, biography, skills, email, social links, and four projects. Empty links are hidden. Put custom images in `public/images/` and set the corresponding image path. Update the site title and sharing metadata in `app/layout.tsx` when changing the name or deployment origin.

The baked picture artwork inside the original GLB world is retained as reference decoration. It is separate from the editable project panels and biography. Replacing that artwork requires editing the model's texture atlas in Blender; the original creator links source Blender files from his repository.

## Validate

```sh
npm run check
npm run build
```

The asset check verifies all ten GLBs and referenced mesh names, local Draco/KTX2 decoders, fonts, cubemap faces, audio, project slots, idempotent GPU material conversion, frame-independent camera damping, chapter boundaries, photo/tour state, safe jump bounds, HUD update throttling, and project discovery deduplication. Browser interaction testing has not been automated.

## Credits

- Original world, scene, UI, and camera: [Andrew Woan](https://github.com/andrewwoan/woan-minecraft-folio), MIT license, copyright 2025.
- House inspiration: Foxel MC. Mob models: Vincent Yanez. Font: JDGraphics. Environment: Poly Haven. Modeling tools: Blender and MCprep.
- Sound effects retained from the source project (credited there to Myinstants and Voicemod).
- `meadow-loop.wav`: original synthesized ambient composition for this adaptation; no third-party recordings or melody samples. The original repository's C418/Sweden recordings are not included.
- Three.js Draco decoder files and original Basis transcoder files retain their bundled third-party notices.

Personal content is placeholder content until configured. The site uses local assets and does not need an external model or decoder CDN.
