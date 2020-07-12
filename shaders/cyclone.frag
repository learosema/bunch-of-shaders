precision highp float;
uniform float time;
uniform vec2 resolution;

const float PI = 3.141592654;
const float DEG = PI / 180.0;

// normalize coords and correct for aspect ratio
vec2 coords()
{
  float aspectRatio = resolution.x / resolution.y;
  vec2 result = 2.0 * (gl_FragCoord.xy / resolution - 0.5);
  result.x *= aspectRatio; 
  return result;
}

vec2 rotate(vec2 p, float a) {
  return vec2(p.x * cos(a) - p.y * sin(a),
              p.x * sin(a) + p.y * cos(a));
}

vec3 palette(float x) {
  return vec3(sin(time * .1+ x * 4.0), sin(2.0 + time * .23 + x * 5.0), sin(time *.4 + x * 2.0 + 1.0));
}
  
void main () {
  vec2 c = rotate(coords() + vec2(cos(time * .1), sin(time * .1)), -time * .05);
  vec2 p00 = vec2(cos(c.x * PI), sin(c.y * PI));
  vec2 exp = vec2(p00 * (.3 + sin(time * .1) * .1));
  vec3 col = palette(
     .5 * sin(log(pow(length(exp),  
                      7.0 * sin(time *.05))) - 2.0 * atan(exp.y, exp.x) + time*.2));
  gl_FragColor = vec4(col, 1.0);
} 
