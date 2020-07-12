precision highp float;

uniform float time;
uniform vec2 resolution;

#define PI 3.141592654
#define ITERS 24

// taken from wikipedia and adapted to GLSL
// https://en.wikipedia.org/wiki/Julia_set
float julia(vec2 p, vec2 c) {
  float x = p.x;
  float y = p.y;
  for (int i = 0; i < ITERS; i++) {
    if (x * x + y * y >= 4.0) {
      return float(i);
    }
    float x1 = x * x - y * y;
    float y1 = 2.0 * x * y;
    x = x1 + c.x; 
    y = y1 + c.y;
  }
  return -1.0;
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

void main () {
  float vmin = min(resolution.x, resolution.y);
  vec3 black = vec3(0.0);
  vec2 p = vec2((gl_FragCoord.x - resolution.x * .5) / vmin, 
                (gl_FragCoord.y - resolution.y * .5) / vmin) * 1.5;
  float t = sin(time *.1) * PI;
  float j = julia(p, 0.7885 * vec2(cos(t), sin(t)));

  
  vec3 color = max(0., j / float(ITERS)) * hsb2rgb(vec3(mod(time * .1 + j / float(ITERS), 1.0), 1.0, .8));
  gl_FragColor = vec4(vec3(color), 1.0);
}
