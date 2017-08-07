# Wren.js

A javascript-based interpretation of [Wren](https://github.com/wikihouseproject/wren).

> The language and rules for the Wikihouse structural system for 1-3 storey buildings, initially developed in the UK for European contexts.

## Terminology (unfinished)

[![Description Video](http://i.imgur.com/Su9MsqO.png)](https://twitter.com/ayudaeficiencia/status/848922738077118465)

`Wren().outputs.piece` | part name in video | piece(s) description
------|--------------------|------------
`frame` |... | group of 2 sets of fins, 2 sets of reinforcers and multiple spacers
`frame.fins` | fin | basic polygon shaped building supports
`frame.reinforcers` | reinforces [sic] | edges of fin
`frame.spacers` | spacer | ...
`frame.skis` | ski | lies beneath the frames
`bay` | ... | collection of components that are inbetween 2 frames
`bay.connectors` | connectors | joins 2 frames together
`bay.skis` | lateral ski | ...
`bay.inner.floor` | ... | floorboards inside the building
`bay.outer.floor` | underboard | lie beneath the frame (NOTE: maybe change to underboard)
`bay.inner.(left-right)Roof` | ceiling | the inside roof
`bay.outer.(left-right)Wall` | external sheathing | the outer walls
`bay.outer.(left-right)Roof` | external sheathing | the outer roof
`bay.inner.(left-right)Roof` | internal sheathing | the inner walls

## Usage

```javascript
// import Wren from "./index"
const Wren = require('./index')

const wren = Wren()
```

property | description
---------|------------
outputs | various calculated values (see below)


method | description
-------|------------
toSVG() | outputs all of the pieces of wren as an SVG document


## Overriding Default Values

Wren accepts dimension in mm (millimetres) unless otherwise specified. The default values can be found in [defaults.js](defaults.js).

You can supply your own values by passing it an object like so -

```javascript
const overrides = {
  dimensions: {
    width: 2000,
    leftWallHeight: 2200
  },
  materials: {
    plywood: { density: 300 }
  }
}

const wren = Wren(overrides)
```


## Outputs

`Wren().outputs` will return the object below

```
├── figures
│   ├── areas                      - mm² unless specified
│   ├── dimensions                 - mm unless specified
│   ├── estimates                  - not yet correct
│   └── volumes                    - mm³ unless specified
├── formats
│   ├── csv                        - not yet implemented
│   └── svg                        - not yet correct
├── points
│   ├── center                     - the main/core polygon points
│   ├── inner
│   └── outer
└── pieces
    ├── bays
    │   ├── connectors             - not yet implemented
    │   ├── sides
    │   │   ├── inner
    │   │   │   ├── floor
    │   │   │   ├── leftRoof
    │   │   │   ├── leftWall
    │   │   │   ├── rightRoof
    │   │   │   └── rightWall
    │   │   └── outer
    │   │       ├── floor          - not yet implemented
    │   │       ├── leftRoof
    │   │       ├── leftWall
    │   │       ├── rightRoof
    │   │       └── rightWall
    │   ├── skis                   - a.k.a. 'Lateral Skis'
    │   └── underboards            - not yet implemented
    └── frames
        ├── fins
        ├── reinforcers            - not yet implemented
        ├── skis                   - not yet implemented
        └── spacers                - not yet implemented
```

## Pieces

A wren 'piece' is a part that is to be cut using a CNC. It is represented like so -

```javascript
{
  pts: [
    [-0.125, 2.7317249065],
    [-0.125, 1.4384498129999999],
    [0.9125, 0.64037289],
    [1.0375, 0.8596271105000001],
    [0.125, 1.5615501870000001]
  ],
  pos: {
    x: 3.9,
    y: 0,
    z: -0.7249999999999996
  },
  rot: {
    x: 0,
    y: 0,
    z: 0,
    order: "XYZ"
  }
}
```

`pts` - the points, these are the vertices (probably in metres or millimetres) of the piece

`pos` - the position of the piece in a 3D model

`rot` - how a 3D renderer should rotate the piece for it to be aligned correctly in the model
