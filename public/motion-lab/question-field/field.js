const canvas = document.querySelector("#field");
const shell = document.querySelector(".field-shell");
const stage = document.querySelector(".stage");
const readout = document.querySelector(".identity-readout strong");
const toggle = document.querySelector("#identity-toggle");
const fallback = document.querySelector(".fallback");

const gl = canvas.getContext("webgl", {
  alpha: true,
  antialias: false,
  premultipliedAlpha: false,
});

if (!gl) {
  fallback.textContent = "WEBGL UNAVAILABLE / THE FIELD COULD NOT INITIALIZE.";
  throw new Error("WebGL unavailable");
}

const vertexSource = `
  precision highp float;

  attribute vec3 aSphere;
  attribute vec3 aOne;
  attribute vec3 aQuestion;
  attribute float aSeed;

  uniform float uTime;
  uniform float uResolve;
  uniform float uIdentity;
  uniform float uAspect;
  uniform vec2 uPointer;
  uniform float uEngaged;
  uniform vec2 uChromatic;

  varying float vDepth;
  varying float vNoise;
  varying float vSeed;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(.1, .2, .3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }

  mat2 rotate2d(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
  }

  void main() {
    float slow = uTime * 0.13;
    float n1 = noise(aSphere * 2.25 + vec3(slow));
    float n2 = noise(aSphere * 7.0 - vec3(slow * 1.7));
    float n = mix(n1, n1 * n2 * 1.5, 0.32);

    vec3 sphere = aSphere;
    sphere *= mix(0.76 + sin(uTime * 0.82) * 0.045, 1.05, n);
    sphere.xy = rotate2d(uTime * 0.09) * sphere.xy;
    sphere.xz = rotate2d(uTime * 0.12) * sphere.xz;

    vec3 identity = mix(aOne, aQuestion, uIdentity);
    identity.z += sin(uTime * 0.8 + aSeed * 19.0) * 0.025;
    identity.xz = rotate2d((uPointer.x * 0.14) + sin(uTime * .18) * .08) * identity.xz;
    identity.yz = rotate2d((-uPointer.y * 0.09) + cos(uTime * .15) * .045) * identity.yz;

    float localResolve = clamp(uResolve + (aSeed - .5) * .16, 0.0, 1.0);
    localResolve = smoothstep(0.02, 0.98, localResolve);
    vec3 p = mix(sphere, identity, localResolve);

    vec2 pointer = vec2(uPointer.x * uAspect, uPointer.y);
    vec2 projected = vec2(p.x * uAspect, p.y);
    vec2 delta = projected - pointer;
    float distanceToPointer = max(0.12, length(delta));
    float resolvedResistance = mix(1.0, 0.46, localResolve);
    float push = uEngaged * resolvedResistance * 0.06 /
      (distanceToPointer * distanceToPointer + 0.12);
    p.xy += normalize(delta + .0001) * push;
    p.z += push * (0.35 + aSeed * 0.65);

    float perspective = 1.0 / (1.72 - p.z * 0.36);
    vec2 screen = p.xy * perspective;
    screen.x /= uAspect;
    screen += uChromatic * (0.45 + perspective);

    gl_Position = vec4(screen, 0.0, 1.0);
    gl_PointSize = mix(1.15, 3.2, perspective) * mix(0.75, 1.15, n);

    vDepth = perspective;
    vNoise = n;
    vSeed = aSeed;
  }
`;

const fragmentSource = `
  precision mediump float;

  uniform vec3 uColor;
  uniform float uOpacity;

  varying float vDepth;
  varying float vNoise;
  varying float vSeed;

  float bayer(vec2 p) {
    vec2 q = mod(floor(p), 4.0);
    float x = q.x;
    float y = q.y;
    float index = 0.0;
    if (y < 1.0) {
      if (x < 1.0) index = 0.0;
      else if (x < 2.0) index = 8.0;
      else if (x < 3.0) index = 2.0;
      else index = 10.0;
    } else if (y < 2.0) {
      if (x < 1.0) index = 12.0;
      else if (x < 2.0) index = 4.0;
      else if (x < 3.0) index = 14.0;
      else index = 6.0;
    } else if (y < 3.0) {
      if (x < 1.0) index = 3.0;
      else if (x < 2.0) index = 11.0;
      else if (x < 3.0) index = 1.0;
      else index = 9.0;
    } else {
      if (x < 1.0) index = 15.0;
      else if (x < 2.0) index = 7.0;
      else if (x < 3.0) index = 13.0;
      else index = 5.0;
    }
    return index / 16.0;
  }

  void main() {
    vec2 point = gl_PointCoord - .5;
    float roundMask = smoothstep(.5, .22, length(point));
    float light = clamp(vDepth * .68 + vNoise * .34, 0.0, 1.0);
    float stipple = step(bayer(gl_FragCoord.xy), light);
    float alpha = roundMask * stipple * uOpacity * mix(.55, 1.0, vSeed);
    if (alpha < .03) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

const compile = (type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || "Shader compilation failed");
  }
  return shader;
};

const program = gl.createProgram();
gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  throw new Error(gl.getProgramInfoLog(program) || "Program link failed");
}
gl.useProgram(program);

const pointCount = 24000;
const sphere = new Float32Array(pointCount * 3);
const one = new Float32Array(pointCount * 3);
const question = new Float32Array(pointCount * 3);
const seeds = new Float32Array(pointCount);

const random = (() => {
  let state = 0x1f2e3d4c;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
})();

const makeGlyphPoints = (text) => {
  const size = 460;
  const source = document.createElement("canvas");
  source.width = size;
  source.height = size;
  const context = source.getContext("2d", { willReadFrequently: true });
  context.clearRect(0, 0, size, size);
  context.fillStyle = "#fff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "900 178px Arial, Helvetica, sans-serif";
  context.fillText(text, size / 2, size / 2 + 6);
  const pixels = context.getImageData(0, 0, size, size).data;
  const candidates = [];

  for (let y = 56; y < size - 56; y += 3) {
    for (let x = 36; x < size - 36; x += 3) {
      if (pixels[(y * size + x) * 4 + 3] > 80) candidates.push([x, y]);
    }
  }

  const target = new Float32Array(pointCount * 3);
  for (let index = 0; index < pointCount; index += 1) {
    const sample = candidates[Math.floor(random() * candidates.length)];
    const jitterX = (random() - 0.5) * 3.2;
    const jitterY = (random() - 0.5) * 3.2;
    target[index * 3] = ((sample[0] + jitterX) / size - 0.5) * 2.15;
    target[index * 3 + 1] = -((sample[1] + jitterY) / size - 0.5) * 2.15;
    target[index * 3 + 2] = (random() - 0.5) * 0.22;
  }
  return target;
};

for (let index = 0; index < pointCount; index += 1) {
  const y = 1 - (index / (pointCount - 1)) * 2;
  const radius = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = Math.PI * (3 - Math.sqrt(5)) * index;
  sphere[index * 3] = Math.cos(theta) * radius;
  sphere[index * 3 + 1] = y;
  sphere[index * 3 + 2] = Math.sin(theta) * radius;
  seeds[index] = random();
}

one.set(makeGlyphPoints("TT1"));
question.set(makeGlyphPoints("TT?"));

const bindAttribute = (name, data, size) => {
  const location = gl.getAttribLocation(program, name);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
};

bindAttribute("aSphere", sphere, 3);
bindAttribute("aOne", one, 3);
bindAttribute("aQuestion", question, 3);
bindAttribute("aSeed", seeds, 1);

const uniform = (name) => gl.getUniformLocation(program, name);
const uniforms = {
  time: uniform("uTime"),
  resolve: uniform("uResolve"),
  identity: uniform("uIdentity"),
  aspect: uniform("uAspect"),
  pointer: uniform("uPointer"),
  engaged: uniform("uEngaged"),
  chromatic: uniform("uChromatic"),
  color: uniform("uColor"),
  opacity: uniform("uOpacity"),
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const target = { x: 0, y: 0, resolve: reducedMotion ? 0.7 : 0.18, identity: 1, engaged: 0 };
const current = { ...target };
let lastTime = performance.now();
let impulse = 0;
let decayAt = 0;

const resize = () => {
  const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
  const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
  const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  }
};

const ease = (value, destination, speed, delta) =>
  value + (destination - value) * (1 - Math.exp(-speed * delta));

const setIdentity = (next) => {
  target.identity = next;
  target.resolve = Math.max(target.resolve, 0.88);
  impulse = 1;
  decayAt = performance.now() + 2600;
  const label = next > 0.5 ? "TT?" : "TT1";
  readout.textContent = label;
  stage.dataset.mode = next > 0.5 ? "question" : "one";
  toggle.querySelector("span").textContent = next > 0.5 ? "01" : "02";
};

const updatePointer = (event) => {
  const bounds = shell.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
  const y = 1 - ((event.clientY - bounds.top) / bounds.height) * 2;
  target.x = Math.max(-1, Math.min(1, x));
  target.y = Math.max(-1, Math.min(1, y));
  target.engaged = 1;
  shell.dataset.engaged = "true";
  shell.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
  shell.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
  const reticle = shell.querySelector(".reticle");
  reticle.style.left = `${((x + 1) / 2) * 100}%`;
  reticle.style.top = `${((1 - y) / 2) * 100}%`;
};

shell.addEventListener("pointermove", updatePointer);
shell.addEventListener("pointerdown", (event) => {
  updatePointer(event);
  setIdentity(target.identity > 0.5 ? 0 : 1);
});
shell.addEventListener("pointerleave", () => {
  target.x = 0;
  target.y = 0;
  target.engaged = 0;
  shell.dataset.engaged = "false";
});
shell.addEventListener("wheel", (event) => {
  event.preventDefault();
  target.resolve = Math.max(0.05, Math.min(1, target.resolve + event.deltaY * -0.0011));
  decayAt = performance.now() + 1400;
}, { passive: false });
toggle.addEventListener("click", () => setIdentity(target.identity > 0.5 ? 0 : 1));
window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    setIdentity(target.identity > 0.5 ? 0 : 1);
  }
});
window.addEventListener("resize", resize);

gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

const draw = (color, opacity, offsetX, offsetY) => {
  gl.uniform3fv(uniforms.color, color);
  gl.uniform1f(uniforms.opacity, opacity);
  gl.uniform2f(uniforms.chromatic, offsetX, offsetY);
  gl.drawArrays(gl.POINTS, 0, pointCount);
};

const render = (now) => {
  resize();
  const delta = Math.min(0.05, Math.max(1 / 240, (now - lastTime) / 1000));
  lastTime = now;

  if (!reducedMotion && decayAt && now > decayAt) {
    target.resolve = 0.18;
    impulse *= Math.exp(-delta * 2.2);
  }

  current.x = ease(current.x, target.x, 9, delta);
  current.y = ease(current.y, target.y, 9, delta);
  current.resolve = ease(current.resolve, target.resolve, 3.4, delta);
  current.identity = ease(current.identity, target.identity, 4.6, delta);
  current.engaged = ease(current.engaged, target.engaged, 8, delta);

  stage.style.setProperty("--resolve", current.resolve.toFixed(4));
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform1f(uniforms.time, reducedMotion ? 2.4 : now / 1000);
  gl.uniform1f(uniforms.resolve, current.resolve);
  gl.uniform1f(uniforms.identity, current.identity);
  gl.uniform1f(uniforms.aspect, canvas.width / canvas.height);
  gl.uniform2f(uniforms.pointer, current.x, current.y);
  gl.uniform1f(uniforms.engaged, current.engaged);

  const split = 0.0022 + impulse * 0.003;
  draw([0.13, 0.77, 0.81], 0.34, -split, 0.0008);
  draw([1.0, 0.33, 0.24], 0.3, split, -0.0006);
  draw([0.941, 0.933, 0.898], 0.92, 0, 0);

  requestAnimationFrame(render);
};

resize();
requestAnimationFrame(render);
