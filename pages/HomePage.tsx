import React, { useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Stars, OrbitControls, Sphere, QuadraticBezierLine } from '@react-three/drei';
import * as THREE from 'three';
import { AriseLogoIcon } from '../components/shared/Icons';

// Workaround for environments where R3F's JSX intrinsics aren't automatically picked up.
extend({
  AmbientLight: THREE.AmbientLight,
  PointLight: THREE.PointLight,
  Group: THREE.Group,
  MeshStandardMaterial: THREE.MeshStandardMaterial,
  MeshBasicMaterial: THREE.MeshBasicMaterial,
});

const GLOBE_RADIUS = 2.5;

const latLonToVector3 = (lat: number, lon: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

const LocationMarker: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <Sphere position={position} args={[0.05, 16, 16]}>
    <meshBasicMaterial color="#D4AF37" toneMapped={false} />
  </Sphere>
);

const GlobeScene = () => {
  const globeRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.1;
    }
  });
  
  const locations = useMemo(() => ({
    dubai: latLonToVector3(25.20, 55.27, GLOBE_RADIUS),
    mumbai: latLonToVector3(19.07, 72.87, GLOBE_RADIUS),
    riyadh: latLonToVector3(24.71, 46.67, GLOBE_RADIUS),
    manila: latLonToVector3(14.59, 120.98, GLOBE_RADIUS),
    doha: latLonToVector3(25.28, 51.53, GLOBE_RADIUS),
  }), []);

  const arcs = useMemo(() => [
    { start: locations.mumbai, end: locations.dubai },
    { start: locations.mumbai, end: locations.riyadh },
    { start: locations.manila, end: locations.dubai },
    { start: locations.manila, end: locations.doha },
  ], [locations]);

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#D4AF37" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <group ref={globeRef}>
        <Sphere args={[GLOBE_RADIUS, 64, 64]}>
            <meshStandardMaterial color="#073B4C" roughness={0.7} metalness={0.5} />
        </Sphere>
        <Sphere args={[GLOBE_RADIUS + 0.01, 64, 64]}>
            <meshStandardMaterial color="#D4AF37" wireframe={true} transparent opacity={0.15} />
        </Sphere>

        {Object.values(locations).map((pos, i) => <LocationMarker key={i} position={[pos.x, pos.y, pos.z]} />)}

        {arcs.map((arc, i) => {
          const midPoint = new THREE.Vector3().addVectors(arc.start, arc.end).multiplyScalar(0.5).normalize().multiplyScalar(GLOBE_RADIUS * 1.3);
          return (
            <QuadraticBezierLine 
              key={i} 
              start={arc.start} 
              mid={midPoint}
              end={arc.end} 
              color="#D4AF37" 
              lineWidth={1.5}
              dashed={true}
              dashScale={20}
              gapSize={10}
            />
          )
        })}
      </group>
      
      <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={3 * Math.PI / 4} />
    </>
  );
};


const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-screen h-screen bg-primary overflow-hidden">
      <Canvas camera={{ position: [0, 0, 7] }}>
        <GlobeScene />
      </Canvas>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black bg-opacity-40 pointer-events-none">
        <div className="max-w-4xl p-8 pointer-events-auto">
          <div className="flex justify-center items-center gap-4 mb-4">
            <AriseLogoIcon className="h-20 w-20"/>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>
            Streamlining Global Mobility
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8">
            Your trusted partner in automating Wafid medical examinations. Seamless, efficient, and reliable services for enterprises in Dubai and India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-accent text-primary font-bold rounded-lg shadow-lg hover:bg-accent-hover transition-all duration-300 transform hover:scale-105"
            >
              Login (تسجيل الدخول)
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-transparent border-2 border-accent text-accent font-semibold rounded-lg shadow-lg hover:bg-accent hover:text-primary transition-all duration-300 transform hover:scale-105"
            >
              Register (تسجيل جديد)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;