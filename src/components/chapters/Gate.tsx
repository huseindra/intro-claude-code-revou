"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import StarField from "../StarField";
import { useStore } from "@/lib/store";
import { config, gate } from "@/lib/content";

function Lock({ glow, open }: { glow: number; open: boolean }) {
  const shackle = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const openRef = useRef(0);
  const glowRef = useRef(0);

  useFrame((state, delta) => {
    openRef.current += ((open ? 1 : 0) - openRef.current) * 0.08;
    glowRef.current += (glow - glowRef.current) * 0.1;
    if (shackle.current) {
      shackle.current.rotation.z = openRef.current * 0.9;
      shackle.current.position.y = 0.9 + openRef.current * 0.5;
    }
    if (body.current) {
      const mat = body.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.2 + glowRef.current * 1.4 + openRef.current * 1.5;
    }
  });

  return (
    <group scale={1.1}>
      {/* shackle */}
      <group ref={shackle} position={[0, 0.9, 0]}>
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[0.55, 0.12, 24, 48, Math.PI]} />
          <meshStandardMaterial
            color="#C89B6D"
            metalness={0.9}
            roughness={0.25}
            emissive="#C89B6D"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[-0.55, -0.25, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.5, 24]} />
          <meshStandardMaterial color="#C89B6D" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0.55, -0.25, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.5, 24]} />
          <meshStandardMaterial color="#C89B6D" metalness={0.9} roughness={0.25} />
        </mesh>
      </group>

      {/* body */}
      <mesh ref={body} position={[0, -0.1, 0]}>
        <boxGeometry args={[1.4, 1.2, 0.6]} />
        <meshStandardMaterial
          color="#F8E8D8"
          metalness={0.6}
          roughness={0.2}
          emissive="#FFE7C2"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* keyhole */}
      <mesh position={[0, -0.15, 0.31]}>
        <circleGeometry args={[0.16, 24]} />
        <meshBasicMaterial color="#0E0E10" />
      </mesh>
      <mesh position={[0, -0.35, 0.31]}>
        <boxGeometry args={[0.12, 0.3, 0.02]} />
        <meshBasicMaterial color="#0E0E10" />
      </mesh>
    </group>
  );
}

function LockScene({ glow, open }: { glow: number; open: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 5]} intensity={40} color="#FFE7C2" />
      <pointLight position={[-4, -2, 3]} intensity={20} color="#C89B6D" />
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
        <Lock glow={glow} open={open} />
      </Float>
    </Canvas>
  );
}

/**
 * Chapter I — Private Access. Glass card, floating 3D lock, password input.
 * Wrong password shakes; correct password opens the lock, flashes white
 * (the "fly through the keyhole"), and unlocks the experience.
 */
export default function Gate() {
  const unlock = useStore((s) => s.unlock);
  const [value, setValue] = useState("");
  const [glow, setGlow] = useState(0);
  const [open, setOpen] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [flash, setFlash] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === config.password.toLowerCase()) {
      setOpen(true);
      setGlow(1);
      window.setTimeout(() => setFlash(true), 700);
      window.setTimeout(() => unlock(), 1900);
    } else {
      setWrong(true);
      window.setTimeout(() => setWrong(false), 600);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[280] flex items-center justify-center overflow-hidden bg-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4 }}
    >
      <StarField count={900} hue={38} />
      <div className="pointer-events-none absolute inset-0 vignette" />

      <motion.div
        className={`glass relative z-10 mx-6 w-full max-w-md rounded-3xl p-8 md:p-10 ${
          wrong ? "animate-shake" : ""
        }`}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.3 }}
      >
        <div className="mx-auto h-52 w-full">
          <LockScene glow={glow} open={open} />
        </div>

        <p className="mb-1 text-center text-xs uppercase tracking-cinematic text-accent">
          {gate.eyebrow}
        </p>
        <h2 className="mb-4 text-center font-serif-title text-3xl text-primary">
          {gate.title}
        </h2>
        <p className="mb-6 text-center text-sm leading-relaxed text-secondary">
          {gate.prompt}
        </p>

        <form onSubmit={submit} className="space-y-3">
          <input
            autoFocus
            type="password"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setGlow(Math.min(1, e.target.value.length / 6));
            }}
            placeholder={gate.placeholder}
            className="w-full rounded-full border border-white/10 bg-black/30 px-5 py-3 text-center text-primary outline-none transition-all placeholder:text-secondary/60 focus:border-accent focus:shadow-goldglow"
          />
          <button
            type="submit"
            data-cursor="hover"
            className="w-full rounded-full bg-gradient-to-r from-accent to-highlight px-5 py-3 text-sm font-medium uppercase tracking-cinematic text-black transition-transform hover:scale-[1.02]"
          >
            Unlock
          </button>
        </form>

        <AnimatePresence>
          {wrong && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-center text-sm text-rose-300/80"
            >
              {gate.wrong}
            </motion.p>
          )}
        </AnimatePresence>

        {config.passwordHint && (
          <p className="mt-6 text-center text-xs italic text-secondary/60">
            hint: {config.passwordHint}
          </p>
        )}
      </motion.div>

      {/* white flash = flying through the keyhole */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: flash ? 1 : 0 }}
        transition={{ duration: 1 }}
      />
    </motion.div>
  );
}
