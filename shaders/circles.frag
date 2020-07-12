precision highp float;

uniform float time;
const float PI = 3.141592654;
const float DEG = PI / 180.0;

vec2 coords() {
  float width= resolution.x;
  float height = resolution.y;
  float vmin = min(width, height);
  return vec2((gl_FragCoord.x - width * .5) / vmin,
              (gl_FragCoord.y - height * .5) / vmin);
}

vec2 rotate(vec2 p, float a) {
  return vec2(p.x * cos(a) - p.y * sin(a),
              p.x * sin(a) + p.y * cos(a));
}

vec2 repeat(in vec2 p, in vec2 c) {
  return mod(p, c) - 0.5 * c;
}

// Distance functions by Inigo Quilez
// https://iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm
float circle(in vec2 p, in vec2 pos, float radius) {
  return length((p - pos)) - radius;
}

float symmetricDiff(float a, float b)
{
    // (A ∪ B) \ (A ∩ B)
    return max(min(a, b), -max(a, b));
}

float subtract(float a, float b)
{
    return max(-a, b);
}

float circlesField(vec2 p, vec2 pCenter) {
  float d = 1000.;
  float s = .7;
  for (int i = 9; i >= 0; i-= 2) {
    d = min(d, circle(p, pCenter, float(i) * s));
    d = subtract(circle(p, pCenter, float(i-1) * s), d);
  }
  return d;
}

float rectanglesField(vec2 p, vec2 pCenter) {
  return 0.;
}

vec2 dotPattern(vec2 p) {
 float w = 55.;
 return p + sin(p.x * w + time) * cos(p.y * w + time * .1 ) * .125;
}

float aa(float d) {
  return smoothstep(.0, .05, d);
}


vec2 scene1(in vec2 p) {
  p = rotate(p, -time * DEG);
  float d0 = circlesField(p, vec2(sin(time * .3), cos(time * .2)));
  float d1 = circlesField(p, vec2(sin(1. + time * .3), cos(1. + time * .2)));
  return vec2(d0, d1);
}

vec2 scene2(in vec2 p) {
  p = rotate(p, time * DEG);
  vec2 q = vec2(cos(time * .2) * .7, sin(time * .3) * .7); 
  return vec2(
    circle(mod(p, 4.) - 2., vec2(0.), 2.),
    circle(mod(p + q, 4.) - 2., vec2(0.), 2.)
  );
}

vec3 shade(in vec2 p)
{
  float sceneId = floor(time / 1e3);
  float z = clamp(sin(time / 4.) * 4., 0., 1.);
  p = mix(p, dotPattern(p), z);
  
  vec3 background = vec3(.5 + sin(time * .05 + p.x * .1) * cos(p.y * .4 + p.x * .2), .2 + sin(time *.1 + p.x * .2) * cos(time * .1 + p.y * .13), .7);
  vec3 white = vec3(1., 1., 1.);
  vec3 black = vec3(0., 0., 0.);
  vec2 s1 = scene1(p);
  vec2 s2 = scene2(p);
  
  float x = z; // .5 + sin(time * .1) * .5
  vec2 s = mix(s1, s2, x);
  vec3 col0 = mix(white, black, aa(s.x));
  vec3 col1 = mix(white, black, aa(s.y));
  vec3 col = background + col0 - col1;

  return col;
}


void main () {
    
  vec2 p0 = coords();
  float zoom = 7.;
  vec3 col = shade(p0 * zoom);
  gl_FragColor = vec4(col, 1.0);
}
