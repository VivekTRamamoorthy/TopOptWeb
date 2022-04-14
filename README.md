# Structural topology optimisation code in a web page

Use the app at [VivekTRamamoorthy.github.io/TopOptWeb](https://VivekTRamamoorthy.github.io/TopOptWeb).

- Click on the buttons to keep running SIMP or to run one iteration at a time.
- Pause and edit shapes by using paint tool which allows filling a specific finite element with void or solid or an intermediate material between solid and void.

## Algorithm

This app written in JavaScript performs compliance minimisation topology optimisation in the web browser to solve a simple beam fixed at one end with a load at the other. The algorithm used is the popular solid-isotropic material with penalisation method popularised by Ole Sigmund. 

## Paint and erase shapes
The app allows users to manually edit the shape by paint and erase tools during the algorithm to enforce specific attributes in the final solution. The user can fully control progress of the solution by manual intervention such as to explicitly remove checkerboard patterns. The app also prints compliance for a given shape upon request in the user interface. 

## Mobile friendly
The app is tested to work well on google Chrome for mobile. 

## Dependencies
MatlabJS
mathjs

## License
MIT license 
Vivek T Ramamoorthy 2022

