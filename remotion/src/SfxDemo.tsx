import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SfxTrack } from "./sfx";

// Demo: la pista de efectos se genera sola a partir de los eventos del video.
export const SfxDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 60, 70], [0.6, 1.05, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#0b0b0f", justifyContent: "center", alignItems: "center" }}>
      <div style={{ color: "white", fontSize: 140, fontWeight: 800, transform: `scale(${scale})` }}>
        Tu marca
      </div>
      <SfxTrack
        events={[
          { type: "build-up", at: 0, volume: 0.8 },
          { type: "logo-reveal", at: 60 },
          { type: "text-in", at: 90, volume: 0.6 },
        ]}
      />
    </AbsoluteFill>
  );
};
