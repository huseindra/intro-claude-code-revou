"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";
import ChapterShell from "../ui/ChapterShell";
import { Fireflies, Petals } from "../ui/Particles";
import { final } from "@/lib/content";

function Leaf({ position, hue, delay, t }: { position: THREE.Vector3; hue: number; delay: number; t: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const color = useMemo(() => new THREE.Color().setHSL(hue / 360, 0.6, 0.6), [hue]);
  useFrame(() => {
    if (!ref.current) return;
    const grow = Math.max(0, Math.min(1, (t - delay) * 1.5));
    const s = grow * (0.16 + 0.06 * Math.sin(delay * 30));
    ref.current.scale.setScalar(s);
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.4} />
    </mesh>
  );
}

function Tree() {
  const group = useRef<THREE.Group>(null);
  const [t, setT] = useState(0);

  useFrame((state, delta) => {
    setT((v) => Math.min(v + delta * 0.25, 3));
    if (group.current) group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.5;
  });

  const leaves = useMemo(() => {
    const arr: { pos: THREE.Vector3; hue: number; delay: number }[] = [];
    let s = 77;
    const rand = () => ((s = (s * 16807) % 2147483647), s / 2147483647);
    for (let i = 0; i < 70; i++) {
      // cluster into a rough heart-ish canopy
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const r = 1.6 + rand() * 0.9;
      const x = Math.sin(phi) * Math.cos(theta) * r;
      const y = 2.6 + Math.cos(phi) * r * 0.9;
      const z = Math.sin(phi) * Math.sin(theta) * r;
      arr.push({ pos: new THREE.Vector3(x, y, z), hue: 20 + rand() * 40, delay: 0.4 + rand() * 1.6 });
    }
    return arr;
  }, []);

  return (
    <group ref={group} position={[0, -1.6, 0]}>
      {/* trunk */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.12, 0.28, 2.4, 12]} />
        <meshStandardMaterial color="#3a2c20" roughness={0.9} />
      </mesh>
      {/* a few branches */}
      {[-0.6, 0.5, 0].map((a, i) => (
        <mesh key={i} position={[Math.sin(a) * 0.5, 1.8, Math.cos(a) * 0.3]} rotation={[0, a, a * 0.6]}>
          <cylinderGeometry args={[0.05, 0.12, 1.2, 8]} />
          <meshStandardMaterial color="#3a2c20" roughness={0.9} />
        </mesh>
      ))}
      {leaves.map((l, i) => (
        <Leaf key={i} position={l.pos} hue={l.hue} delay={l.delay} t={t} />
      ))}
    </group>
  );
}

export default function TheHeart() {
  const [showLetter, setShowLetter] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setShowLetter(true), 2600);
    return () => clearTimeout(id);
  }, []);

  return (
    <ChapterShell
      id="the-heart"
      eyebrow={final.eyebrow}
      background={
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(100% 80% at 50% 100%, #C89B6D66 0%, #6b4a2e33 25%, #0E0E10 60%, #050505 100%)",
            }}
          />
          <Canvas camera={{ position: [0, 1, 8], fov: 45 }} dpr={[1, 2]}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 6, 4]} intensity={2} color="#FFE7C2" />
            <pointLight position={[0, 3, 2]} intensity={20} color="#C89B6D" />
            <Tree />
          </Canvas>
          <Petals count={14} seed={4} />
          <Fireflies count={24} seed={8} />
        </div>
      }
    >
      <div className="flex min-h-[70vh] flex-col items-center justify-end pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
          animate={showLetter ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-serif-title text-6xl text-primary md:text-8xl">
            <span className="gold-text">{final.title}</span>
          </h2>
          <div className="mt-6 space-y-1">
            {final.body.map((line, i) => (
              <p key={i} className="font-hand text-2xl text-highlight md:text-4xl">
                {line}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </ChapterShell>
  );
}
