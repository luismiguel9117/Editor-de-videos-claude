import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import { Img, spring, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";

// Celular en 3D real (Three.js): marco de titanio metálico, vidrio frontal, isla dinámica,
// botones laterales y pantalla emisiva con la captura real. Iluminación de estudio con
// Lightformers (sin descargar mapas HDR).

const W = 0.75;
const H = 1.55;
const D = 0.085;
const R = 0.12;
// La pantalla se superpone en DOM (450 px de ancho) proyectada sobre el modelo 3D
const SCREEN_W = W - 0.075;
const SCREEN_H = H - 0.075;
const SCREEN_PX = 450;
const SCREEN_RATIO = SCREEN_H / SCREEN_W;

const roundedRect = (w: number, h: number, r: number) => {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
};

/** Geometría plana redondeada con UV 0–1 (para la textura de pantalla) */
const flatRounded = (w: number, h: number, r: number) => {
  const g = new THREE.ShapeGeometry(roundedRect(w, h, r), 24);
  const pos = g.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) + w / 2) / w;
    uv[i * 2 + 1] = (pos.getY(i) + h / 2) / h;
  }
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return g;
};

const PhoneModel: React.FC<{ position: [number, number, number]; rotation: [number, number, number] }> = ({ position, rotation }) => {
  const body = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(roundedRect(W - 0.04, H - 0.04, R - 0.02), {
      depth: D - 0.04,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 8,
      curveSegments: 32,
    });
    g.translate(0, 0, -(D - 0.04) / 2);
    return g;
  }, []);
  const glass = useMemo(() => flatRounded(W - 0.025, H - 0.025, R - 0.012), []);
  const island = useMemo(() => flatRounded(0.2, 0.058, 0.029), []);
  const screenGeo = useMemo(() => flatRounded(SCREEN_W, SCREEN_H, R - 0.035), []);
  const front = D / 2 + 0.0005;
  return (
    <group position={position} rotation={rotation}>
      {/* marco y espalda de titanio */}
      <mesh geometry={body}>
        <meshPhysicalMaterial color="#c3c6cc" metalness={1} roughness={0.24} clearcoat={0.5} clearcoatRoughness={0.2} />
      </mesh>
      {/* vidrio negro frontal */}
      <mesh geometry={glass} position={[0, 0, front]}>
        <meshPhysicalMaterial color="#040406" metalness={0} roughness={0.05} clearcoat={1} />
      </mesh>
      {/* pantalla apagada (la captura real se superpone en DOM, ver ScreenOverlay) */}
      <mesh geometry={screenGeo} position={[0, 0, front + 0.001]}>
        <meshStandardMaterial color="#000000" roughness={0.2} />
      </mesh>
      {/* isla dinámica */}
      <mesh geometry={island} position={[0, H / 2 - 0.085, front + 0.003]}>
        <meshStandardMaterial color="#000000" roughness={0.3} />
      </mesh>
      {/* botones laterales */}
      {[
        [W / 2 + 0.004, 0.28, 0.2],
        [-W / 2 - 0.004, 0.36, 0.09],
        [-W / 2 - 0.004, 0.2, 0.13],
        [-W / 2 - 0.004, 0.02, 0.13],
      ].map(([x, y, h], i) => (
        <RoundedBox key={i} args={[0.012, h, 0.03]} radius={0.005} position={[x, y, 0]}>
          <meshPhysicalMaterial color="#b7bac0" metalness={1} roughness={0.3} />
        </RoundedBox>
      ))}
    </group>
  );
};

type Pose = { position: [number, number, number]; rotation: [number, number, number] };
const CAM = { z: 5.2, fov: 32 };

/** Proyecta las 4 esquinas de la pantalla de un celular a píxeles del lienzo */
const projectScreen = (pose: Pose, width: number, height: number) => {
  const cam = new THREE.PerspectiveCamera(CAM.fov, width / height, 0.1, 100);
  cam.position.set(0, 0, CAM.z);
  cam.updateMatrixWorld();
  cam.updateProjectionMatrix();
  const m = new THREE.Matrix4().compose(
    new THREE.Vector3(...pose.position),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(...pose.rotation)),
    new THREE.Vector3(1, 1, 1),
  );
  const z = D / 2 + 0.0015;
  return [
    [-SCREEN_W / 2, SCREEN_H / 2],
    [SCREEN_W / 2, SCREEN_H / 2],
    [-SCREEN_W / 2, -SCREEN_H / 2],
    [SCREEN_W / 2, -SCREEN_H / 2],
  ].map(([x, y]) => {
    const v = new THREE.Vector3(x, y, z).applyMatrix4(m).project(cam);
    return [((v.x + 1) / 2) * width, ((1 - v.y) / 2) * height] as [number, number];
  });
};

/** matrix3d que lleva un rectángulo w×h a un cuadrilátero (esquinas: sup-izq, sup-der, inf-izq, inf-der) */
const quadMatrix = (w: number, h: number, q: [number, number][]) => {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x3, dx2 = x2 - x3, dx3 = x0 - x1 + x3 - x2;
  const dy1 = y1 - y3, dy2 = y2 - y3, dy3 = y0 - y1 + y3 - y2;
  const det = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / det;
  const hh = (dx1 * dy3 - dx3 * dy1) / det;
  const a = x1 - x0 + g * x1, b = x2 - x0 + hh * x2, c = x0;
  const d = y1 - y0 + g * y1, e = y2 - y0 + hh * y2, f = y0;
  const M = [a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, c, f, 0, 1];
  return `matrix3d(${M.map((n) => n.toFixed(9)).join(",")})`;
};

const SCREEN_RADIUS = ((R - 0.035) / SCREEN_W) * SCREEN_PX;

const ScreenOverlay: React.FC<{ src: string; pose: Pose; width: number; height: number }> = ({ src, pose, width, height }) => {
  const q = projectScreen(pose, width, height);
  const w = SCREEN_PX, h = SCREEN_PX * SCREEN_RATIO;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: w,
        height: h,
        transformOrigin: "0 0",
        transform: quadMatrix(w, h, q),
        borderRadius: SCREEN_RADIUS,
        overflow: "hidden",
        background: "#000",
      }}
    >
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0%" }} />
      {/* reflejo del vidrio */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(125deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,0) 38%, rgba(255,255,255,0) 70%, rgba(255,255,255,.06) 100%)" }} />
    </div>
  );
};

/** Tres celulares en 3D real que entran escalonados, se asientan y flotan */
export const Phones3D: React.FC<{ screens: string[]; width: number; height: number }> = ({ screens, width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const layout: { x: number; y: number; z: number; ry: number; rz: number }[] = [
    { x: -1.1, y: -0.08, z: -0.45, ry: 0.75, rz: 0.06 },
    { x: 0, y: 0.06, z: 0.2, ry: 0.32, rz: 0.03 },
    { x: 1.1, y: -0.08, z: -0.45, ry: -0.55, rz: -0.05 },
  ];
  const poses: Pose[] = layout.map((l, i) => {
    const e = spring({ frame: frame - i * 6, fps, config: { damping: 14, stiffness: 90 } });
    const fy = Math.sin(t * 1.7 + i * 1.3) * 0.04;
    return {
      position: [l.x, l.y - (1 - e) * 2.4 + fy, l.z],
      rotation: [-0.16 + Math.sin(t * 1.1 + i) * 0.03, l.ry - (1 - e) * 0.6 - t * 0.05, l.rz + (1 - e) * 0.2],
    };
  });
  return (
    <div style={{ position: "relative", width, height }}>
      <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, CAM.z], fov: CAM.fov }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} />
        <directionalLight position={[-4, -1, 3]} intensity={0.5} color="#ffd58a" />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={4} position={[0, 3, 4]} scale={[8, 2, 1]} />
          <Lightformer form="rect" intensity={2.5} position={[-5, 0, 2]} rotation={[0, Math.PI / 2, 0]} scale={[6, 3, 1]} color="#ffd58a" />
          <Lightformer form="rect" intensity={2} position={[5, 1, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 3, 1]} />
          <Lightformer form="ring" intensity={3} position={[0, -3, 3]} scale={2} color="#981608" />
        </Environment>
        {poses.map((p, i) => (
          <PhoneModel key={i} position={p.position} rotation={p.rotation} />
        ))}
      </ThreeCanvas>
      {/* el orden de dibujo va de atrás hacia adelante para que el del centro quede encima */}
      {[0, 2, 1].map((i) => (
        <ScreenOverlay key={i} src={screens[i]} pose={poses[i]} width={width} height={height} />
      ))}
    </div>
  );
};
