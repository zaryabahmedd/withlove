import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere, Float, Environment } from '@react-three/drei'

function ParticleSphere() {
  const ref = useRef()

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.15
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={ref} args={[2.2, 128, 128]}>
        <MeshDistortMaterial
          color="#7c3aed"
          speed={3}
          distort={0.35}
          roughness={0}
          metalness={0.8}
          envMapIntensity={2}
          transparent
          opacity={0.9}
        />
      </Sphere>
    </Float>
  )
}

export default function FeatureScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={3} color="#7c3aed" />
      <pointLight position={[-5, -5, 5]} intensity={2} color="#06b6d4" />
      <Environment preset="city" />
      <ParticleSphere />
    </Canvas>
  )
}
