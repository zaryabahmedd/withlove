import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere, Torus, Box, OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'

function FloatingSphere({ position, color, speed = 1, distort = 0.4 }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed
    ref.current.position.y = position[1] + Math.sin(t) * 0.3
    ref.current.rotation.x = t * 0.2
    ref.current.rotation.z = t * 0.1
  })

  return (
    <Sphere ref={ref} position={position} args={[1, 64, 64]}>
      <MeshDistortMaterial
        color={color}
        speed={2}
        distort={distort}
        roughness={0}
        metalness={0.6}
        envMapIntensity={1.5}
      />
    </Sphere>
  )
}

function SpinningTorus({ position, color, speed = 0.5 }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.rotation.x = t * speed
    ref.current.rotation.y = t * speed * 0.7
  })

  return (
    <Torus ref={ref} position={position} args={[1.2, 0.35, 32, 100]}>
      <meshStandardMaterial
        color={color}
        roughness={0.1}
        metalness={0.9}
        wireframe={false}
      />
    </Torus>
  )
}

function FloatingBox({ position, color, speed = 0.8 }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed
    ref.current.rotation.x = t * 0.5
    ref.current.rotation.y = t * 0.7
    ref.current.position.y = position[1] + Math.cos(t * 0.7) * 0.4
  })

  return (
    <Box ref={ref} position={position} args={[1.4, 1.4, 1.4]}>
      <meshStandardMaterial
        color={color}
        roughness={0.05}
        metalness={1}
        envMapIntensity={2}
      />
    </Box>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 70 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#7c3aed" />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#06b6d4" />
      <pointLight position={[0, 10, -5]} intensity={1} color="#f43f5e" />

      <Stars radius={80} depth={50} count={3000} factor={4} fade speed={1} />

      <FloatingSphere position={[-3.5, 0, 0]} color="#7c3aed" speed={0.8} distort={0.5} />
      <FloatingSphere position={[3.5, 0.5, -2]} color="#06b6d4" speed={1.2} distort={0.3} />
      <SpinningTorus position={[0, 0, -1]} color="#f43f5e" speed={0.4} />
      <FloatingBox position={[5.5, -1, -3]} color="#f59e0b" speed={0.6} />
      <FloatingBox position={[-5, 1.5, -4]} color="#10b981" speed={0.9} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  )
}
