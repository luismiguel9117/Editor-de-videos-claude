import { Video } from "@remotion/media";
import React from "react";
import { Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { EASE_OUT } from "./tokens";

const easeOut = Easing.bezier(...EASE_OUT);

/**
 * Captura de un proyecto mostrada como card 3D con brillo ember.
 * `zoom` y `focus` recortan el video (p. ej. para acercar la lata).
 */
export const FootageCard: React.FC<{
  src: string;
  width: number;
  height: number;
  zoom?: number;
  focus?: { x: number; y: number };
  rotateY?: [number, number];
  /** brillo extra (0–1), p. ej. en un destello eléctrico */
  flare?: number;
  trimBefore?: number;
  tone?: "blue" | "ember";
}> = ({
  src,
  width,
  height,
  zoom = 1,
  focus = { x: 50, y: 50 },
  rotateY = [-10, 8],
  flare = 0,
  trimBefore,
  tone = "blue",
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp", easing: easeOut });
  const ry = interpolate(frame, [0, 200], rotateY, { extrapolateRight: "clamp" });
  const push = 1 + frame * 0.0009;
  const glowA = 0.5 + flare * 0.45;
  return (
    <div style={{ perspective: 1600, width, height }}>
      <div
        style={{
          width,
          height,
          borderRadius: 16,
          overflow: "hidden",
          background: "#000",
          transform: `translateZ(${(1 - enter) * -500}px) rotateY(${ry}deg) rotateX(3deg) scale(${(0.9 + enter * 0.1) * push})`,
          opacity: enter,
          filter: `blur(${(1 - enter) * 8}px) brightness(${1 + flare * 0.35})`,
          boxShadow:
            tone === "blue"
              ? `0 0 40px rgba(59,108,240,${glowA}), 0 0 160px rgba(29,78,216,${glowA * 0.7}), inset 0 0 0 1px rgba(160,185,255,.18)`
              : `0 0 40px rgba(255,130,80,${glowA}), 0 0 140px rgba(255,60,30,${glowA * 0.6}), inset 0 0 0 1px rgba(255,255,255,.08)`,
        }}
      >
        <Video
          src={staticFile(src)}
          muted
          trimBefore={trimBefore}
          objectFit="cover"
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${zoom})`,
            transformOrigin: `${focus.x}% ${focus.y}%`,
          }}
        />
      </div>
    </div>
  );
};
