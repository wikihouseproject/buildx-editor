# Wren.js

A javascript-based interpretation of [Wren](https://github.com/wikihouseproject/wren).

> The language and rules for the Wikihouse structural system for 1-3 storey buildings, initially developed in the UK for European contexts.

## Terminology

[Explanation Video](https://twitter.com/ayudaeficiencia/status/848922738077118465)

part | description
-----|------------
fin | basic shape
reinforcer | edges of fin
frame | group of fins, reinforcers and spacers
ski | lies beneath the frames
connector | joins two frames together, to create a bay
lateral ski | ...
underboard | floorboards which lie beneath the frame
ceiling | the inside roof

## Usage

```javascript
const wren = Wren()
```

property | description
---------|------------
outputs | various calculated values
points | the 2D polygon that determines the profile of the wikihouse


method | description
-------|------------
toSVG() | outputs all of the pieces of wren as an SVG document

