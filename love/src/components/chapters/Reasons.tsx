"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import ChapterShell from "../ui/ChapterShell";
import { Hearts } from "../ui/Particles";
import { reasons } from "@/lib/content";

function Crystal() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.y += d * 0.25;
      ref.current.rotation.x += d * 0.1;
    }
  });
  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial
          color="#FFE7C2"
          emissive="#C89B6D"
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.15}
          flatShading
        />
      </mesh>
    </Float>
  );
}

function OrbitStar({
  index,
  total,
  onSelect,
  dimmed,
}: {
  index: number;
  total: number;
  onSelect: (i: number) => void;
  dimmed: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const params = useMemo(() => {
    const angle = (index / total) * Math.PI * 2;
    const radius = 3.4;
    const tilt = (index % 3) - 1;
    return { angle, radius, tilt };
  }, [index, total]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * 0.25 + params.angle;
    ref.current.position.set(
      Math.cos(t) * params.radius,
      Math.sin(t * 1.3 + params.tilt) * 1.2,
      Math.sin(t) * params.radius
    );
  });

  return (
    <group ref={ref}>
      <mesh
        scale={hover ? 1.8 : 1}
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
          onSelect(index);
        }}
      >
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshBasicMaterial color={hover ? "#FFFFFF" : "#FFE7C2"} transparent opacity={dimmed ? 0.25 : 1} />
      </mesh>
      <mesh scale={2.4}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshBasicMaterial color="#C89B6D" transparent opacity={dimmed ? 0.05 : 0.18} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

export default function Reasons() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <ChapterShell
      id="reasons"
      eyebrow={reasons.eyebrow}
      title={reasons.title}
      subtitle={reasons.subtitle}
      background={
        <div className="absolute inset-0 bg-[#050506]">
          <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}>
            <ambientLight intensity={0.5} />
            <pointLight position={[3, 3, 4]} intensity={30} color="#FFE7C2" />
            <pointLight position={[-4, -2, 2]} intensity={16} color="#C89B6D" />
            <Crystal />
            {reasons.items.map((_, i) => (
              <OrbitStar
                key={i}
                index={i}
                total={reasons.items.length}
                onSelect={setSelected}
                dimmed={selected !== null}
              />
            ))}
          </Canvas>
        </div>
      }
    >
      <div className="pointer-events-none min-h-[40vh]" />

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="fixed inset-0 z-[400] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            {/* particle burst */}
            {Array.from({ length: 24 }).map((_, i) => {
              const a = (i / 24) * Math.PI * 2;
              return (
                <motion.span
                  key={i}
                  className="absolute h-2 w-2 rounded-full bg-highlight"
                  style={{ filter: "drop-shadow(0 0 6px #FFE7C2)" }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos(a) * 220,
                    y: Math.sin(a) * 220,
                    opacity: 0,
                    scale: 0.2,
                  }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                />
              );
            })}
            <Hearts count={8} seed={selected + 2} />
            <motion.p
              initial={{ scale: 0.7, opacity: 0, filter: "blur(12px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.35, duration: 1 }}
              className="relative z-10 max-w-2xl px-6 text-center font-serif-title text-3xl leading-snug text-primary md:text-5xl"
            >
              {reasons.items[selected]}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </ChapterShell>
  );
}
