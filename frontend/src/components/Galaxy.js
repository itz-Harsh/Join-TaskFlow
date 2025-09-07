// src/components/Galaxy.js
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Stars = () => {
  const group = useRef();

  // Generate random star positions
  const starCount = 1000;
  const positions = useMemo(() => {
    const arr = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 2000; // spread in 3D space
    }
    return arr;
  }, []);

  // Create a circular star texture
  const starTexture = useMemo(() => {
    const size = 164;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, "white");
    gradient.addColorStop(0.2, "white");
    gradient.addColorStop(0.4, "rgba(255,255,255,0.2)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.z += 0.0005; // slow z-axis rotation
      group.current.rotation.y += 0.0003; // slight tilt
    }
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={positions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={12} // bigger size so it shows in Chrome too
          map={starTexture} // use circular texture
          alphaTest={0.01}
          transparent={true}
          opacity={1}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
};

const Galaxy = () => {
  return (
    <Canvas camera={{ position: [0, 0, 800], fov: 90 }}>
      <Stars />
    </Canvas>
  );
};

export default Galaxy;
