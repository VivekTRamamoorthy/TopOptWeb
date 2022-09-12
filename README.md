# Structural topology optimisation code in a web page

The repository contains the source of a web app for topology optimisation. This app written in JavaScript performs compliance minimisation topology optimisation in the web browser to solve a simple beam fixed at one end with a load at the other. The app is published using GitHub pages at [VivekTRamamoorthy.github.io/TopOptWeb](https://VivekTRamamoorthy.github.io/TopOptWeb).

## Instructions to use the app:
- Click on the `play` button to run SIMP continuously or the `step` button to run one iteration at a time.
- Edit the shape by picking and painting solid, void or intermediate materials. 

## Algorithm

A Javascript adaptation of the 88-line efficient topology optimization Matlab code by [Andreassen et al.](https://doi.org/10.1007/s00158-010-0594-7) which uses the solid-isotropic-material-with penalization method. 

## Paint and erase shapes
A unique feature of this web-based topology optimisation app is that it allows users to manually edit the shapes during the algorithm. Using the pick and paint panel, the material in an element can be overridden with either solid, void or an intermediate material. While doing so, one can compute the compliance of the structure without running the SIMP algorithm.

## Mobile friendly
Tested on Chrome for mobile. 

## Dependencies
[MatlabJS](https:://VivekTRamamoorthy.github.io/MatlabJS) 

[mathjs](https://mathjs.org/)

## License
MIT license 
Vivek T Ramamoorthy 2022

