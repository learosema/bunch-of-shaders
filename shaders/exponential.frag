
precision highp float;
uniform float time;

vec2 coords() {
  float vmin = min(resolution.x, resolution.y);
  return vec2(gl_FragCoord.xy - resolution * .5) / vmin;
}

vec2 rotate(vec2 p, float a) {
  return vec2(p.x * cos(a) - p.y * sin(a),
              p.x * sin(a) + p.y * cos(a));
}

vec2 repeat(in vec2 p, in vec2 c) {
  return mod(p, c) - 0.5 * c;
}

vec2 complexMul(vec2 a, vec2 b) {
  return vec2(a.x * b.x - a.y * b.y, a.y * b.x + a.x * b.y);
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
  vec2 p00 = coords();
  vec2 p0 = rotate(p00, time *.1);
  vec2 exp = vec2(pow(abs(p0.x) , 5. + abs(p0.y) + sin(p00.x * 4. + time * 3.) * 4.), pow(abs(p0.y), abs(p0.x) + 5. + 3. * sin(1. + time * 2.)));
  vec3 col = hsb2rgb(vec3(atan(exp.x, exp.y), 1.0, .7 - length(exp)));
  gl_FragColor = vec4(col, 1.0);
}
