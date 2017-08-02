# Buildx Editor

[![Join the chat at https://gitter.im/buildx-sprint/Lobby](https://badges.gitter.im/buildx-sprint/Lobby.svg)](https://gitter.im/buildx-editor/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This repository is currently undergoing a lot of development.

Please check soon if you want something that's relatively stable.

## Setup

```javascript
npm install

// run grunt to compile noflo files into public/basic3d/js/noflo.js
grunt

npm run start
```

## Repo Structure

```
├── components                 - noflo components
├── graphs                     - noflo graphs
├── public                     - used by webpack-dev-server and cloned to /dist when deploying
│   ├── basic3d                - simple 3D scene, created for testing noflo
│   │   └── js
│   ├── editor                 - 3D editor (main page of interest)
│   │   ├── css
│   │   ├── img
│   │   │   └── materials      - used by 3D editor
│   │   │       └── plywood
│   │   └── js
│   ├── vendor                 - JS scripts that are shared between pages
│   │   └── js
│   └── wren2d                 - SVG output of Wren
└── src
  ├── editor                   - 3D editor
  │   ├── components             - the house model
  │   │   └── caps_shader          - unused for now
  │   ├── ui                     - visual elements and things that affect them
  │   │   └── controls             - just the mouse controls for now
  │   └── utils                  - general utilities for 3D editor
  └── lib
      └── wren                 - Wren, will be extracted eventually
          ├── __tests__          - tests, mirror the main dir structure
          │   ├── outputs
          │   │   ├── figures
          │   │   ├── formats
          │   │   └── pieces
          │   └── utils
          ├── outputs            - things that Wren spits out
          │   ├── figures          - numbers, areas, volumes, polygon points
          │   ├── formats          - svg and csv for now
          │   └── pieces           - fns that generate the shapes to be cut with a CNC
          └── utils              - collections of methods that can be reused
```

## Wren

Once the repository is more stable this will be extracted into its own package and /src/editor will move to /src

See [Wren README](src/lib/wren/README.md) for more details
