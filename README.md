# MathFlow 3D

A GitHub Pages-ready interactive mathematical visualization website.

## Features

- Interactive 3D mathematical surfaces
- 2D function plotting
- Progressive graph-building animation
- Orbit, zoom and pan controls
- User-entered equations
- Searchable mathematics presets from elementary topics through advanced/research topics
- Grid, axes, points and glow controls
- Responsive mobile layout
- No backend required

## Deploy on GitHub Pages

1. Create a new GitHub repository.
2. Upload `index.html`, `style.css`, and `script.js`.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`.
6. Save and wait for GitHub Pages to publish.

The project uses Three.js and math.js from jsDelivr, so the visitor needs an internet connection for the CDN libraries.

## Supported equation examples

### 2D
- `x^2`
- `sin(x)`
- `cos(x)`
- `exp(-x^2)`
- `1/(1+x^2)`
- `x^3-3*x`

### 3D
- `x^2+y^2`
- `x^2-y^2`
- `sin(x)*cos(y)`
- `exp(-(x^2+y^2))`
- `sqrt(x^2+y^2)`
- `sin(sqrt(x^2+y^2))`

## Important

This is a visualization engine, not a full computer algebra system. Some advanced mathematical objects cannot be represented by a single scalar equation `z=f(x,y)`. The preset library can be expanded later with vector fields, parametric surfaces, implicit surfaces, differential-equation simulations, complex-plane plots, and higher-dimensional projections.
