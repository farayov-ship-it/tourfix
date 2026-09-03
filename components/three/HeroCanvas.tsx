"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

/** Soft golden atmosphere — like dust in Silk Road light */
function GoldenDust() {
  const ref = useRef<THREE.Points>(null);
  const COUNT = 700;

  const { positions, colors, speeds } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const spd = new Float32Array(COUNT);
    const gold = new THREE.Color("#d4a853");
    const cream = new THREE.Color("#f5e6c8");
    const warm = new THREE.Color("#c4893a");

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.15) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      spd[i] = 0.15 + Math.random() * 0.35;

      const c = [gold, cream, warm][i % 3].clone();
      c.multiplyScalar(0.4 + Math.random() * 0.3);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col, speeds: spd };
  }, []);

  const base = useMemo(() => new Float32Array(positions), [positions]);

  useFrame((state) => {
    const pts = ref.current;
    if (!pts) return;
    const t = state.clock.elapsedTime;
    pts.rotation.y = t * 0.025;
    const arr = pts.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const s = speeds[i];
      arr[i3] = base[i3] + Math.sin(t * s + i * 0.01) * 0.2;
      arr[i3 + 1] = base[i3 + 1] + Math.cos(t * s * 0.8 + i * 0.02) * 0.28;
      arr[i3 + 2] = base[i3 + 2] + Math.sin(t * s * 0.5 + i) * 0.12;
    }
    pts.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.035}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.45}
      />
    </Points>
  );
}

export default function HeroCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-[1]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.35} />
          <GoldenDust />
        </Suspense>
      </Canvas>
    </div>
  );
}
