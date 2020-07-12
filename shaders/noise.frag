precision highp float;
uniform float time;

// normalize coords and correct for aspect ratio
vec2 normalizeScreenCoords()
{
  float aspectRatio = resolution.x / resolution.y;
  vec2 result = 2.0 * (gl_FragCoord.xy / resolution - 0.5);
  result.x *= aspectRatio;
  return result;
}

float deform(vec2 p, float factor) {
  return sin(time * .1 + factor * p.x) * cos(time * .1 + factor * p.y);
}

vec4 invert(vec4 color) {
  return vec4(1.0 - color.rgb, 1.0);
}

vec4 grey(vec4 color) {
  float val = (color.x + color.y + color.z) / 3.0;

  return vec4(vec3(pow(val, .125)), 1.0);
}


float luminance(vec3 color) {
  return 0.2126*color.x + 0.7152*color.y + 0.0722*color.z;
}



// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise(in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float glitch(vec2 p) {
  float l = length(p);
  float g = random(p) *.01 + noise(p * 30.0);
  return clamp(sin(time * 2. + g * l *  60.), -.1, .1) * .8;
}

vec4 animation(in vec2 p) {
  float a = atan(p.y, p.x);
  float l = length(p);
  vec3 background = vec3(
      .4 + sin(a *p.x * p.y * 5. + 1.0 + time) * .2, 
      .2 + sin(l + p.x * 2. * p.x * p.y * 3. + 2.0 + time) * .2,
      .3 + sin(p.x * p.y * 1.  + 3.0 + time) * .2);
  return vec4(background, 1.);      
} 

void main() {
  vec2 p = normalizeScreenCoords();
  vec2 coord = 1.0 - gl_FragCoord.xy / resolution;
  float g = glitch(coord);
  vec3 c1 = vec3(
    animation(coord).r,
    animation(coord).g,
    animation(coord).b
  ) + g;
  gl_FragColor = vec4(c1, 1.);
}
