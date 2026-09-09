import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090d16, 0.025);

    // 2. Camera setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);
    camera.position.set(0, 0, 22);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 4. MULTI-POINT NEON LIGHTING SYSTEM
    const ambientLight = new THREE.AmbientLight(0x1e1b4b, 1.8);
    scene.add(ambientLight);

    // Point Light 1: Electric Cyan
    const cyanLight = new THREE.PointLight(0x00f2fe, 5.5, 45);
    cyanLight.position.set(12, 10, 10);
    scene.add(cyanLight);

    // Point Light 2: Hot Magenta
    const magentaLight = new THREE.PointLight(0xf43f5e, 5.0, 45);
    magentaLight.position.set(-12, -10, 10);
    scene.add(magentaLight);

    // Point Light 3: Deep Violet Glow
    const violetLight = new THREE.PointLight(0x8b5cf6, 4.5, 40);
    violetLight.position.set(0, 12, -8);
    scene.add(violetLight);

    // Directional Specular Rim Light
    const rimLight = new THREE.DirectionalLight(0xffffff, 2.0);
    rimLight.position.set(5, 15, 15);
    scene.add(rimLight);

    // 5. Main Root Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // --- LIQUID METAL / GLASS MORPHING CORE ---
    const coreGeometry = new THREE.IcosahedronGeometry(3.2, 32);
    
    // Store original vertex positions for wave morphing
    const posAttr = coreGeometry.attributes.position;
    const originalPositions = new Float32Array(posAttr.array.length);
    originalPositions.set(posAttr.array);

    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x4f46e5,
      emissive: 0x1e1b4b,
      emissiveIntensity: 0.4,
      roughness: 0.12,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreMesh);

    // --- OUTER GLOSSY TRANSLUCENT GLASS SHELL ---
    const glassShellGeo = new THREE.DodecahedronGeometry(4.8, 1);
    const glassShellMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f2fe,
      roughness: 0.05,
      transmission: 0.9,
      transparent: true,
      opacity: 0.45,
      wireframe: true,
      clearcoat: 1.0,
    });
    const glassShellMesh = new THREE.Mesh(glassShellGeo, glassShellMat);
    mainGroup.add(glassShellMesh);

    // --- DUAL NEON GLOW RINGS ---
    const ring1Geo = new THREE.TorusGeometry(6.6, 0.09, 24, 120);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xf43f5e,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.9,
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.rotation.x = Math.PI / 2.5;
    ring1Mesh.rotation.y = Math.PI / 6;
    mainGroup.add(ring1Mesh);

    const ring2Geo = new THREE.TorusGeometry(8.0, 0.06, 24, 120);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.9,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.x = -Math.PI / 3;
    ring2Mesh.rotation.y = Math.PI / 4;
    mainGroup.add(ring2Mesh);

    // --- 6. FLOATING GLOSSY 3D CRYSTALS & TECH GEMS ---
    const gemCount = 14;
    const gemsGroup = new THREE.Group();
    mainGroup.add(gemsGroup);

    interface FloatingGem {
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      rotSpeedX: number;
      rotSpeedY: number;
      floatPhase: number;
      floatSpeed: number;
    }

    const floatingGems: FloatingGem[] = [];
    const coneGeo = new THREE.ConeGeometry(0.5, 1.1, 5);
    const octaGeo = new THREE.OctahedronGeometry(0.7, 0);
    const dodecGeo = new THREE.DodecahedronGeometry(0.65, 0);

    const gemMaterials = [
      new THREE.MeshPhysicalMaterial({ color: 0x00f2fe, roughness: 0.1, metalness: 0.8, clearcoat: 1.0 }),
      new THREE.MeshPhysicalMaterial({ color: 0xf43f5e, roughness: 0.15, metalness: 0.7, clearcoat: 1.0 }),
      new THREE.MeshPhysicalMaterial({ color: 0x8b5cf6, roughness: 0.1, metalness: 0.85, clearcoat: 1.0 }),
      new THREE.MeshPhysicalMaterial({ color: 0x10b981, roughness: 0.2, metalness: 0.75, clearcoat: 0.9 }),
    ];

    for (let i = 0; i < gemCount; i++) {
      const geoChoice = i % 3 === 0 ? coneGeo : i % 3 === 1 ? octaGeo : dodecGeo;
      const matChoice = gemMaterials[i % gemMaterials.length];

      const gemMesh = new THREE.Mesh(geoChoice, matChoice);

      // Spherical distribution around the liquid orb
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 7.8 + Math.random() * 4.5;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      gemMesh.position.set(x, y, z);
      gemMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      gemsGroup.add(gemMesh);

      floatingGems.push({
        mesh: gemMesh,
        baseX: x,
        baseY: y,
        baseZ: z,
        rotSpeedX: (Math.random() - 0.5) * 0.035,
        rotSpeedY: (Math.random() - 0.5) * 0.035,
        floatPhase: Math.random() * Math.PI * 2,
        floatSpeed: 0.9 + Math.random() * 0.9,
      });
    }

    // --- 7. STAR DUST PARTICLE NEBULAE ---
    const particleCount = 350;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color(0x00f2fe);
    const colorPink = new THREE.Color(0xf43f5e);
    const colorPurple = new THREE.Color(0x8b5cf6);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 40;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 32;

      const rVal = Math.random();
      const c = rVal < 0.4 ? colorCyan : rVal < 0.75 ? colorPink : colorPurple;
      particleColors[i * 3] = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.85)');
        gradient.addColorStop(0.6, 'rgba(139, 92, 246, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.75,
      map: createParticleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // --- 8. RESPONSIVE POSITIONING ---
    const updateLayout = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        mainGroup.position.set(0, 1.8, -6);
        mainGroup.scale.set(0.58, 0.58, 0.58);
      } else {
        mainGroup.position.set(5.8, 0.2, 0);
        mainGroup.scale.set(1, 1, 1);
      }
    };
    updateLayout();

    // --- 9. MOUSE INTERACTION & SMOOTH PARALLAX ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) * 0.0009;
      mouseY = (e.clientY - windowHalfY) * 0.0009;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // --- 10. RESIZE HANDLING ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      updateLayout();
    };

    window.addEventListener('resize', handleResize);

    // --- 11. INTERSECTION OBSERVER FOR ZERO SCROLL LAG ---
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // --- 12. ANIMATION LOOP WITH WAVE DISPLACEMENT ---
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isVisible) return; // Pause WebGL loop when offscreen!

      const time = clock.getElapsedTime();

      // Liquid Orb Vertex Morphing Wave Effect
      const positions = coreGeometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const uX = originalPositions[i * 3];
        const uY = originalPositions[i * 3 + 1];
        const uZ = originalPositions[i * 3 + 2];

        // 3D Sine wave displacement along vertex normals
        const wave = Math.sin(time * 2.2 + uX * 1.5 + uY * 1.5 + uZ * 1.5) * 0.28;
        
        positions.setXYZ(
          i,
          uX + uX * wave * 0.1,
          uY + uY * wave * 0.1,
          uZ + uZ * wave * 0.1
        );
      }
      positions.needsUpdate = true;
      coreGeometry.computeVertexNormals();

      // Core rotations
      coreMesh.rotation.y = time * 0.2;
      coreMesh.rotation.x = time * 0.15;

      glassShellMesh.rotation.y = -time * 0.18;
      glassShellMesh.rotation.z = time * 0.12;

      ring1Mesh.rotation.z = time * 0.25;
      ring2Mesh.rotation.z = -time * 0.2;

      particles.rotation.y = time * 0.04;
      particles.rotation.x = Math.sin(time * 0.025) * 0.1;

      // Animate floating glossy gems
      floatingGems.forEach((gem) => {
        gem.mesh.rotation.x += gem.rotSpeedX;
        gem.mesh.rotation.y += gem.rotSpeedY;

        const floatOffsetY = Math.sin(time * gem.floatSpeed + gem.floatPhase) * 0.6;
        const floatOffsetX = Math.cos(time * gem.floatSpeed * 0.8 + gem.floatPhase) * 0.45;

        gem.mesh.position.y = gem.baseY + floatOffsetY;
        gem.mesh.position.x = gem.baseX + floatOffsetX;
      });

      // Orbit point lights for dynamic specular highlights across glass surfaces
      cyanLight.position.x = Math.sin(time * 0.8) * 15;
      cyanLight.position.z = Math.cos(time * 0.8) * 15;

      magentaLight.position.x = -Math.sin(time * 0.7) * 15;
      magentaLight.position.z = -Math.cos(time * 0.7) * 15;

      // Mouse parallax tilt lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      mainGroup.rotation.y = targetX * 1.8;
      mainGroup.rotation.x = targetY * 1.8;

      // Anti-gravity core levitation
      mainGroup.position.y = (window.innerWidth <= 768 ? 1.8 : 0.2) + Math.sin(time * 1.5) * 0.45;

      renderer.render(scene, camera);
    };

    animate();

    // --- 13. CLEANUP ---
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      coreGeometry.dispose();
      coreMaterial.dispose();
      glassShellGeo.dispose();
      glassShellMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      coneGeo.dispose();
      octaGeo.dispose();
      dodecGeo.dispose();
      gemMaterials.forEach((m) => m.dispose());
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="hero-3d-canvas" />;
};
