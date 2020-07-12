precision highp float;
uniform float time;

void main () {
  vec2 p0 = vec2(gl_FragCoord);
  vec2 p1 = vec2(cos(time * 1e-1), sin(time * 1e-1));
  vec2 pos  = vec2(p0.x * p1.x + p0.y * p1.y, 
                   p0.y * p1.x - p0.x * p1.y) * vec2(sin(time / 10.0) * 1e-1);
  
  vec3 color = vec3(1.0 - sin(time), sin(time), sin(time + 3.0));
  
  gl_FragColor = vec4(color * sin(time + pos.x) * cos(time + pos.y), 1.0);
}

