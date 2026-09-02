"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Stars({
  count = 1400,
  warp = 0,
  hue = 38,
}: {
  count?: number;
  warp?: number;
  hue?: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const warpRef = useRef(0);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    let s = 2718281;
    const rand = () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 60;
      positions[i * 3 + 1] = (rand() - 0.5) * 60;
      positions[i * 3 + 2] = (rand() - 0.5) * 60;
      const light = 0.6 + rand() * 0.4;
      c.setHSL(hue / 360, 0.35, light);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count, hue]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    warpRef.current += (warp - warpRef.current) * 0.05;
    ref.current.rotation.y += delta * 0.02;
    ref.current.rotation.x += delta * 0.005;
    // subtle warp: pull stars toward the camera
    const z = 8 - warpRef.current * 40;
    ref.current.position.z = z;
    const s = 1 + warpRef.current * 1.5;
    ref.current.scale.set(s, s, s + warpRef.current * 4);
    (ref.current.material as THREE.PointsMaterial).opacity = 1 - warpRef.current * 0.6;
  });

  return (
    <points ref={ref} position={[0, 0, 8]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        sizeAttenuation
        vertexColors
        transparent
        opacity={1}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function StarField({
  count,
  warp = 0,
  hue,
  className = "",
}: {
  count?: number;
  warp?: number;
  hue?: number;
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Stars count={count} warp={warp} hue={hue} />
      </Canvas>
    </div>
  );
}
