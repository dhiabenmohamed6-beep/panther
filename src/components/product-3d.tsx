"use client";

import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Mouse, RotateCcw } from "lucide-react";

const textureLoader = new THREE.TextureLoader();

const PantherModel = React.forwardRef<THREE.Group, { position?: [number, number, number] }>((props, ref) => {
  const groupRef = React.useRef<THREE.Group>(null);

  React.useImperativeHandle(ref, () => groupRef.current!);

  return (
    <group ref={groupRef} position={props.position} scale={[0.8, 0.8, 0.8]}>
      {/* Body */}
      <mesh receiveShadow castShadow>
        <sphereGeometry args={[1.2, 0.8, 2.5, 32, 32]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.5, 2.2]} receiveShadow castShadow>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Snout */}
      <mesh position={[0, 1.2, 2.8]} receiveShadow castShadow>
        <sphereGeometry args={[0.45, 0.4, 0.6, 16, 16]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 1.15, 3.25]} receiveShadow castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>

      {/* Left Eye */}
      <mesh position={[-0.25, 1.65, 2.85]} receiveShadow castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#5a0891"
          roughness={0.1}
          metalness={0.9}
          emissive="#5a0891"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Right Eye */}
      <mesh position={[0.25, 1.65, 2.85]} receiveShadow castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#5a0891"
          roughness={0.1}
          metalness={0.9}
          emissive="#5a0891"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Left Ear */}
      <mesh position={[-0.5, 2.0, 2.0]} rotation={[-0.3, 0, -0.3]} receiveShadow castShadow>
        <coneGeometry args={[0.35, 0.6, 16]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Right Ear */}
      <mesh position={[0.5, 2.0, 2.0]} rotation={[-0.3, 0, 0.3]} receiveShadow castShadow>
        <coneGeometry args={[0.35, 0.6, 16]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Front Left Leg */}
      <mesh position={[-0.6, -0.8, 1.5]} receiveShadow castShadow>
        <cylinderGeometry args={[0.15, 0.12, 1.8, 16]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Front Right Leg */}
      <mesh position={[0.6, -0.8, 1.5]} receiveShadow castShadow>
        <cylinderGeometry args={[0.15, 0.12, 1.8, 16]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Back Left Leg */}
      <mesh position={[-0.5, -0.8, -1.2]} receiveShadow castShadow>
        <cylinderGeometry args={[0.15, 0.12, 1.8, 16]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Back Right Leg */}
      <mesh position={[0.5, -0.8, -1.2]} receiveShadow castShadow>
        <cylinderGeometry args={[0.15, 0.12, 1.8, 16]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Tail */}
      <mesh position={[0, -0.2, -2.2]} rotation={[0.3, 0, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.08, 0.03, 1.5, 16]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Purple glow accents on body */}
      <mesh position={[0, 0.5, 0]} receiveShadow castShadow>
        <sphereGeometry args={[1.1, 0.7, 2.3, 32, 32]} />
        <meshBasicMaterial
          color="#5a0891"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
});

const AutoRotate = ({
  enabled = true,
  speed = 0.3,
  pausedRef,
}: { enabled?: boolean; speed?: number; pausedRef: React.RefObject<boolean> }) => {
  const { scene } = useThree();

  useFrame((_, delta) => {
    if (!enabled || pausedRef.current) return;
    scene.rotation.y += delta * speed;
  });

  return null;
};

const ShirtViewer = React.forwardRef<HTMLDivElement, { className?: string }>(({ className }, ref) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [modelLoaded, setModelLoaded] = React.useState(false);
  const pausedRef = React.useRef(false);
  const groupRef = React.useRef<THREE.Group>(null);

  const handleMouseDown = React.useCallback(() => {
    setIsDragging(true);
    pausedRef.current = true;
  }, []);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
    pausedRef.current = false;
  }, []);

  const handleTouchStart = React.useCallback(() => {
    setIsDragging(true);
    pausedRef.current = true;
  }, []);

  const handleTouchEnd = React.useCallback(() => {
    setIsDragging(false);
    pausedRef.current = false;
  }, []);

  React.useEffect(() => {
    setModelLoaded(true);
  }, []);

  return (
    <div
      ref={ref}
      className={cn("relative w-full h-full", className)}
      onMouseEnter={() => { setIsHovered(true); pausedRef.current = true; }}
      onMouseLeave={() => { setIsHovered(false); pausedRef.current = false; }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0.5, 6], fov: 40 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
        style={{ touchAction: "none" }}
      >
        <fog attach="fog" args={["#0a0a0a", 2, 15]} />

        <ambientLight intensity={0.4} color="#1a1a2e" />
        <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow color="#ffffff">
          <orthographicCamera attach="shadow-camera" left={-5} right={5} top={5} bottom={-5} near={0.1} far={30} />
        </directionalLight>
        
        {/* Purple rim lights */}
        <pointLight position={[-4, 2, -2]} color="#5a0891" intensity={3} decay={2} />
        <pointLight position={[4, 2, -2]} color="#5a0891" intensity={3} decay={2} />
        <pointLight position={[0, 4, 3]} color="#7c3aed" intensity={2} decay={2} />
        <pointLight position={[0, -2, 0]} color="#5a0891" intensity={1.5} decay={2} />

        <group ref={groupRef}>
          <PantherModel position={[0, -0.5, 0]} />
        </group>

        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.3}
          scale={8}
          blur={3}
          color="#5a0891"
        />

        <AutoRotate speed={0.1} pausedRef={pausedRef} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI / 1.3}
          minZoom={0.7}
          maxZoom={2.5}
        />
      </Canvas>

      {!modelLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-purple-500/50 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60 text-sm">LOADING PANTHER...</p>
          </div>
        </div>
      )}

      <div
        className={cn(
          "absolute bottom-6 left-6 right-6 flex flex-col items-center gap-2 pointer-events-none",
          isDragging && "opacity-0"
        )}
      >
        <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider">
          <Mouse className="h-4 w-4" aria-hidden="true" />
          <span>DRAG TO ROTATE</span>
          <RotateCcw className="h-4 w-4 animate-spin text-purple-400" aria-hidden="true" />
        </div>
        {isHovered && !isDragging && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-1.5 bg-black/80 backdrop-blur-sm border border-purple-500/30 rounded-full text-white/70 text-xs uppercase tracking-wider"
          >
            <span>PAUSED</span>
            <RotateCcw className="h-3 w-3 text-purple-400" aria-hidden="true" />
          </motion.div>
        )}
      </div>

      <div className="absolute top-6 left-6 right-6 flex flex-col items-center gap-1 pointer-events-none">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="font-bold tracking-widest uppercase text-white text-lg sm:text-xl"
        >
          THE PANTHER
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-purple-400/70 text-sm uppercase tracking-wider"
        >
          BUILT DIFFERENT
        </motion.p>
      </div>
    </div>
  );
});

ShirtViewer.displayName = "ShirtViewer";

interface Product3DProps {
  className?: string;
}

export function Product3D({ className }: Product3DProps) {
  return (
    <section
      id="product-3d"
      className={cn("relative w-full h-[70vh] min-h-[500px] max-h-[700px] bg-black", className)}
      aria-labelledby="product-3d-title"
    >
      <ShirtViewer className="w-full h-full" />
    </section>
  );
}