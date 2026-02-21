# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A web-based 3D metronome (节拍器) featuring a wooden fish (木鱼) 3D model with synchronized animations and audio. There is also an alternative GIF-based version with a basketball dribbling animation.

## Development

This is a vanilla JavaScript project with no build system, package manager, or bundler. All dependencies are loaded via CDN import maps.

To preview locally, serve the directory with any static file server:
```
npx serve .
# or
python3 -m http.server
```

Both `index.html` and `gif.html` are standalone pages that can be opened directly.

## Architecture

### index.html — Main 3D Metronome

- **Three.js scene** (v0.170.0 via CDN ES modules): Loads `zhoushen_compressed.glb` model with DRACOLoader, renders with OrbitControls, ambient/directional lighting, and 260 floating particles
- **Audio engine**: Synthesizes woodblock sounds via Web Audio API with three layers (base tone, harmonic, noise burst). Pre-generates noise buffer.
- **Beat scheduler**: Look-ahead scheduling (100ms) synchronizes audio playback with 3D animation. Animation `timeScale` is dynamically adjusted to match BPM.
- **Responsive layout**: CSS breakpoints for portrait/landscape, touch devices, safe area insets for notched devices

The 3D model animation uses `animations[3]` from the GLB file. Camera auto-fits to model bounding box on load.

### gif.html — GIF-based Metronome

- **Custom GIF parser**: Byte-level GIF89a parsing with LZW decompression, local/global color tables, disposal methods, and transparency support. Extracts frames to canvas elements.
- **GIF sync**: Maps 2 beats per GIF loop cycle, adjusts playback speed to match BPM, resynchronizes phase on BPM changes.
- Same audio engine and beat scheduler as `index.html`.

### Key Parameters

- BPM range: 40–208
- Beat indicator flashes on each beat
- All audio is synthesized (no audio files needed)
