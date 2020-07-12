# Bunch of shaders

This repository contains a bunch of shaders for WebGL and OpenGLES 2.
It is supposed to be an API for a shader display project :).

## Consume the API

The simplest way to use these shaders is to clone it :). But you can also use the GitHub API to get the
contents of this Repo, without the need of an API key: 

https://api.github.com/repos/terabaud/bunch-of-shaders/contents/shaders

## Contribute

Please fork, add some fragment shaders, and send a pull request <3.

Instructions:
* Put your shader in the shaders directory. No subdirs. 
* Name it `your-shader-name.frag`, 
* add a README by adding a `your-shader-name.md`
* add your name to `AUTHORS`


## Predefined uniforms

```glsl
uniform float time; // Elapsed time
uniform vec2 resolution; // resolution
```
