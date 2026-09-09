import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Section3DCanvasProps {
  variant?: 'skills' | 'platforms' | 'generic';
}

export const Section3DCanvas: React.FC<Section3DCanvasProps> = ({ variant = 'generic' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 400;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 16;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Multi-point Lighting
    const primaryHex = variant === 'skills' ? 0x00f2fe : variant === 'platforms' ? 0xf43f5e : 0x8b5cf6;
    const secondaryHex = variant === 'skills' ? 0x8b5cf6 : 0x00f2fe;

    const ambientLight = new THREE.AmbientLight(0x1e1b4b, 1.5);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(primaryHex, 4.0, 30);
    light1.position.set(8, 6, 8);
    scene.add(light1);

    const light2 = new THREE.PointLight(secondaryHex, 3.5, 30);
    light2.position.set(-8, -6, 8);
    scene.add(light2);

    const group = new THREE.Group();
    scene.add(group);

    // 4. Glossy Floating Crystal Geometries
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const meshes: THREE.Mesh[] = [];

    const count = 7;
    for (let i = 0; i < count; i++) {
      let geo: THREE.BufferGeometry;
      if (i % 3 === 0) {
        geo = new THREE.OctahedronGeometry(1.2 + Math.random() * 0.3, 0);
      } else if (i % 3 === 1) {
        geo = new THREE.TorusGeometry(1.3, 0.2, 16, 50);
      } else {
        geo = new THREE.DodecahedronGeometry(1.1, 0);
      }
      geometries.push(geo);

      const isWire = i % 2 === 1;
      const mat = new THREE.MeshPhysicalMaterial({
        color: i % 2 === 0 ? primaryHex : secondaryHex,
        emissive: i % 2 === 0 ? primaryHex : secondaryHex,
        emissiveIntensity: 0.2,
        roughness: isWire ? 0.1 : 0.2,
        metalness: 0.8,
        clearcoat: 1.0,
        wireframe: isWire,
        transparent: true,
        opacity: isWire ? 0.45 : 0.65,
      });
      materials.push(mat);

      const mesh = new THREE.Mesh(geo, mat);

      const posX = (i - (count - 1) / 2) * 6.5 + (Math.random() - 0.5) * 2;
      const posY = (Math.random() - 0.5) * 3.5;
      const posZ = (Math.random() - 0.5) * 4;

      mesh.position.set(posX, posY, posZ);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      group.add(mesh);
      meshes.push(mesh);
    }

    // Floating Particle Dust
    const particleCount = 80;
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 38;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: primaryHex,
      size: 0.45,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const pPoints = new THREE.Points(pGeo, pMat);
    scene.add(pPoints);

    // 5. Resize Listener
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 6. Visibility Observer
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 7. Animation Loop
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      meshes.forEach((mesh, index) => {
        mesh.rotation.x = elapsedTime * (0.12 + index * 0.02);
        mesh.rotation.y = elapsedTime * (0.18 + index * 0.02);
        mesh.position.y += Math.sin(elapsedTime * 1.4 + index) * 0.004;
      });

      pPoints.rotation.y = elapsedTime * 0.025;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
    };
  }, [variant]);

  return <div ref={containerRef} className="section-3d-bg" />;
};
