import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
    OrbitControls, 
    PerspectiveCamera, 
    Environment, 
    Float, 
    ContactShadows, 
    useTexture,
    PresentationControls
} from '@react-three/drei';
import * as THREE from 'three';

function CoinMesh({ textureUrl }) {
    const meshRef = useRef();
    const texture = useTexture(textureUrl || '/images/slc_mask.png');
    
    // Smooth auto-rotation
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
        }
    });

    // Materials: [Side, Top, Bottom]
    // Side: Brushed Silver
    // Top: Custom Texture
    // Bottom: Custom Texture (Standard Back)
    const materials = useMemo(() => [
        new THREE.MeshStandardMaterial({ 
            color: '#d1d5db', 
            roughness: 0.2, 
            metalness: 0.9,
            envMapIntensity: 1.5
        }),
        new THREE.MeshStandardMaterial({ 
            map: texture, 
            transparent: false,
            roughness: 0.1, 
            metalness: 1.0,
            envMapIntensity: 2
        }),
        new THREE.MeshStandardMaterial({ 
            map: texture, 
            transparent: false,
            roughness: 0.1, 
            metalness: 1.0,
            envMapIntensity: 2
        }),
    ], [texture]);

    return (
        <group>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh 
                    ref={meshRef} 
                    castShadow 
                    receiveShadow
                    rotation={[Math.PI / 2, 0, 0]}
                    material={materials}
                >
                    <cylinderGeometry args={[1, 1, 0.06, 64]} />
                </mesh>
            </Float>
            
            {/* Pedestal Shadow */}
            <ContactShadows 
                position={[0, -1.2, 0]} 
                opacity={0.4} 
                scale={5} 
                blur={2.4} 
                far={1} 
            />
        </group>
    );
}

export default function Coin3D({ textureUrl, height = "400px" }) {
    return (
        <div style={{ width: '100%', height, position: 'relative' }}>
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 3.5]} fov={40} />
                
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#c4b5fd" />
                
                <PresentationControls
                    global
                    config={{ mass: 2, tension: 500 }}
                    snap={{ mass: 4, tension: 1500 }}
                    rotation={[0, 0, 0]}
                    polar={[-Math.PI / 3, Math.PI / 3]}
                    azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
                >
                    <React.Suspense fallback={null}>
                        <CoinMesh textureUrl={textureUrl} />
                    </React.Suspense>
                </PresentationControls>

                <Environment preset="city" />
                
                <OrbitControls 
                    enableZoom={false} 
                    enablePan={false}
                    minPolarAngle={Math.PI / 2.5}
                    maxPolarAngle={Math.PI / 1.5}
                />
            </Canvas>
            
            {/* Interactive hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest bg-navy-950/50 px-3 py-1 rounded-full backdrop-blur-sm">
                    Drag to Inspect · 360° View
                </p>
            </div>
        </div>
    );
}
