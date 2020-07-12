precision highp float;
uniform float time;
uniform vec2 resolution;
const float PI = 3.141592654;
const float DEG = PI / 180.0;

vec2 coords() {
  float width = resolution.x;
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
  return length(p - pos) - radius;
}
// function from https://www.shadertoy.com/view/3ll3zr
float heart(vec2 p, float s) {
  p /= s;
  vec2 q = p;
  q.x *= 0.5 + .5 * q.y;
  q.y -= abs(p.x) * .63;
  return (length(q) - .7) * s;
}

float box(in vec2 p, in vec2 pos, in vec2 b) {
  vec2 d = abs(p - pos) - b;
  return length(max(d, vec2(0))) + min(max(d.x, d.y), 0.0);
}

float triangle(in vec2 p, in float h) {
  const float k = sqrt(3.0);
  p.x = abs(p.x) - h;
  p.y = p.y + h / k;
  if( p.x + k*p.y > 0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
  p.x -= clamp( p.x, -2.0, 0.0 );
  return -length(p)*sign(p.y);
}

float hexagon(in vec2 p, in vec2 pos, in float r) {
  const vec3 k = vec3(-0.866025404,0.5,0.577350269);
  p = abs(p - pos);
  p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
  p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
  return length(p) * sign(p.y);
}

float hexagram(in vec2 p, in vec2 pos, in float r) {
  const vec4 k=vec4(-0.5,0.8660254038,0.5773502692,1.7320508076);
  p = abs(p - pos);
  p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
  p -= 2.0*min(dot(k.yx,p),0.0)*k.yx;
  p -= vec2(clamp(p.x,r*k.z,r*k.w),r);
  return length(p)*sign(p.y);
}

float distanceField(vec2 p) {
  float star = hexagram(p, vec2(0, 0), .25);
  float heart = heart(p, .5);
  float x = clamp(.5 + sin(time * .5) * 1.0, 0.0, 1.0);
  return mix(heart, star, x);
}

// by IQ 
vec3 hsb2rgb( in vec3 c ){
  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                           6.0)-3.0)-1.0,
                   0.0,
                   1.0 );
  rgb = rgb*rgb*(3.0-2.0*rgb);
  return c.z * mix( vec3(1.0), rgb, c.y);
}

vec3 scene(in vec2 p, in vec3 background) {
  float sdf = distanceField(p);
  vec3 fill = vec3(clamp(cos(time - sdf * 30.0) * 6., 0., 1.), .5, .5);
  float m = smoothstep(0., .005, sdf);
  return mix(fill, background, m);
}

void main () {
  vec2 p0 = coords();
  
  vec3 background = vec3(
      .8 + sin(p0.x * p0.y * 15. + 1.0 + time) * .2, 
      .8 + sin(p0.x * p0.y * 13. + 2.0 + time) * .2,
      .8 + sin(p0.x * p0.y * 12.  + 3.0 + time) * .2);
  vec3 col = scene(p0, background);
  gl_FragColor = vec4(col, 1.0);
}
