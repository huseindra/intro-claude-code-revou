"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import ChapterShell from "../ui/ChapterShell";
import Modal from "../ui/Modal";
import { galaxy, type Planet } from "@/lib/content";

function PlanetMesh({
  planet,
  position,
  onSelect,
}: {
  planet: Planet;
  position: [number, number, number];
  onSelect: (p: Planet) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  const color = new THREE.Color().setHSL(planet.hue / 360, 0.6, 0.55);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.3;
  });

  return (
    <group position={position}>
      <mesh
        ref={ref}
        scale={hover ? 1.25 : 1}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = "";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(planet);
        }}
      >
        <sphereGeometry args={[0.6, 48, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hover ? 0.9 : 0.45}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      {/* glow halo */}
      <mesh scale={hover ? 1.9 : 1.6}>
        <sphereGeometry args={[0.6, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>
      {hover && (
        <Html center distanceFactor={10} position={[0, 1.1, 0]}>
          <div className="whitespace-nowrap rounded-full bg-black/70 px-3 py-1 text-xs text-highlight backdrop-blur">
            {planet.title}
          </div>
        </Html>
      )}
    </group>
  );
}

function Galaxies({ onSelect }: { onSelect: (p: Planet) => void }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.04;
  });

  // distribute planets on a sphere (golden spiral)
  const n = galaxy.planets.length;
  const positions: [number, number, number][] = galaxy.planets.map((_, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = i * 2.399963;
    const R = 4.2;
    return [Math.cos(theta) * r * R, y * 2.4, Math.sin(theta) * r * R];
  });

  return (
    <group ref={group}>
      {galaxy.planets.map((p, i) => (
        <PlanetMesh key={i} planet={p} position={positions[i]} onSelect={onSelect} />
      ))}
    </group>
  );
}

function DustStars() {
  const ref = useRef<THREE.Points>(null);
  const positions = useRef<Float32Array>();
  if (!positions.current) {
    const arr = new Float32Array(800 * 3);
    let s = 13;
    const rand = () => ((s = (s * 16807) % 2147483647), s / 2147483647);
    for (let i = 0; i < 800; i++) {
      arr[i * 3] = (rand() - 0.5) * 40;
      arr[i * 3 + 1] = (rand() - 0.5) * 40;
      arr[i * 3 + 2] = (rand() - 0.5) * 40;
    }
    positions.current = arr;
  }
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.01;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={800}
          array={positions.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#C89B6D" transparent opacity={0.5} />
    </points>
  );
}

export default function Galaxy() {
  const [active, setActive] = useState<Planet | null>(null);

  return (
    <ChapterShell
      id="galaxy"
      eyebrow={galaxy.eyebrow}
      title={galaxy.title}
      subtitle={galaxy.subtitle}
      background={
        <div className="absolute inset-0 bg-[#040406]">
          <Canvas camera={{ position: [0, 0, 12], fov: 55 }} dpr={[1, 2]}>
            <ambientLight intensity={0.4} />
            <pointLight position={[0, 0, 0]} intensity={30} color="#FFE7C2" />
            <DustStars />
            <Galaxies onSelect={setActive} />
            <OrbitControls
              enablePan={false}
              enableZoom
              minDistance={7}
              maxDistance={18}
              rotateSpeed={0.6}
              autoRotate={false}
            />
          </Canvas>
        </div>
      }
    >
      {/* content sits above the canvas; leave the lower area open for dragging */}
      <div className="pointer-events-none min-h-[40vh]" />

      <Modal open={!!active} onClose={() => setActive(null)} hue={active?.hue ?? 38}>
        {active && (
          <div>
            <div
              className="mb-5 h-56 w-full rounded-xl"
              style={{
                background: `radial-gradient(70% 70% at 40% 30%, hsl(${active.hue} 70% 55%), hsl(${
                  (active.hue + 40) % 360
                } 45% 12%))`,
              }}
            />
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs uppercase tracking-cinematic text-accent">
              <span>{active.date}</span>
              <span>· {active.location}</span>
              <span>· ♪ {active.song}</span>
            </div>
            <h3 className="mt-2 font-serif-title text-3xl text-primary">
              {active.title}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-secondary">
              {active.story}
            </p>
          </div>
        )}
      </Modal>
    </ChapterShell>
  );
}
