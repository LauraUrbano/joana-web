"use client";

import { useEffect, useRef } from "react";

/**
 * Fundo líquido: ruído fbm com domain warping desenhado em WebGL.
 * As manchas claras deslocam-se lentamente, como água.
 * Se o WebGL não estiver disponível, fica apenas o gradiente CSS por baixo.
 */

const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.02;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = vec2(uv.x * aspect, uv.y) * 0.85;

  float t = u_time * 0.055;

  // Domain warping: o ruído distorce-se a si próprio, o que cria o escoamento.
  vec2 q = vec2(
    fbm(p + vec2(0.0, t)),
    fbm(p + vec2(5.2, 1.3 - t * 0.8))
  );
  vec2 r = vec2(
    fbm(p + 2.4 * q + vec2(1.7 + t * 0.6, 9.2)),
    fbm(p + 2.4 * q + vec2(8.3, 2.8 - t * 0.45))
  );
  float f = fbm(p + 3.0 * r);

  float m = smoothstep(-0.40, 0.95, f);

  // Brilho central suave, como no design.
  vec2 c = (uv - vec2(0.5, 0.45)) * vec2(aspect, 1.0);
  float glow = 1.0 - smoothstep(0.05, 0.8, length(c));
  m = clamp(m * 0.62 + glow * 0.50 + 0.06, 0.0, 1.0);

  vec3 deep  = vec3(0.400, 0.333, 0.930);
  vec3 base  = vec3(0.541, 0.478, 0.965);
  vec3 light = vec3(0.741, 0.706, 0.998);

  vec3 col = mix(deep, base, smoothstep(0.0, 0.55, m));
  col = mix(col, light, smoothstep(0.58, 1.08, m));

  // Dither para evitar banding nos degradés.
  float d = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (d - 0.5) / 255.0;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function LiquidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", { antialias: false, alpha: false }) ??
      (canvas.getContext("experimental-webgl", {
        antialias: false,
        alpha: false,
      }) as WebGLRenderingContext | null);
    if (!gl) return;

    const vert = compile(gl, gl.VERTEX_SHADER, VERT);
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPosition = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let frame = 0;
    let running = true;
    const start = performance.now();

    const resize = () => {
      // Limita a resolução interna: o ruído é caro e o resultado é difuso.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const draw = (time: number) => {
      resize();
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = () => {
      if (!running) return;
      draw((performance.now() - start) / 1000);
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const play = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (reduceMotion.matches) return;
      if (document.hidden) stop();
      else play();
    };

    const onMotionChange = () => {
      stop();
      if (reduceMotion.matches) draw(12);
      else play();
    };

    const onResize = () => {
      if (reduceMotion.matches) draw(12);
    };

    if (reduceMotion.matches) {
      running = false;
      draw(12); // instantâneo estático, sem animação
    } else {
      frame = requestAnimationFrame(loop);
    }

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);
    reduceMotion.addEventListener("change", onMotionChange);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      reduceMotion.removeEventListener("change", onMotionChange);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
