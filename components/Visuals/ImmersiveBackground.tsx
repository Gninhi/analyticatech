import React, { useEffect, useRef, memo, useState } from 'react';
import * as THREE from 'three';

/**
 * OPTIMIZED IMMERSIVE BACKGROUND
 * Performance optimizations for Lighthouse > 95:
 * - Reduced particle count for mobile
 * - Throttled animation loop
 * - Intersection Observer for visibility
 * - Reduced motion support
 * - Efficient memory cleanup
 */
const ImmersiveBackground: React.FC = memo(() => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Intersection Observer - pause when not visible
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    
    if (mountRef.current) {
      intersectionObserver.observe(mountRef.current);
    }

    return () => intersectionObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let particlesGeometry: THREE.BufferGeometry | null = null;
    let particlesMaterial: THREE.PointsMaterial | null = null;
    let particlesMesh: THREE.Points | null = null;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    
    // OPTIMIZED: Drastically reduce particles for better performance
    const particlesCount = prefersReducedMotion ? 30 : (isMobile ? 150 : 600);

    scene = new THREE.Scene();
    scene.background = null;

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 30;

    renderer = new THREE.WebGLRenderer({ 
      antialias: false, // OPTIMIZED: Disable antialiasing for performance
      alpha: true, 
      powerPreference: "high-performance",
      stencil: false, // OPTIMIZED: No stencil buffer needed
      depth: true
    });
    
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // OPTIMIZED: Cap at 1.5
    
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 70;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const isDark = document.documentElement.classList.contains('dark');

    particlesMaterial = new THREE.PointsMaterial({
      size: isDark ? 0.15 : 0.2,
      color: isDark ? '#F26D3D' : '#03318C',
      transparent: true,
      opacity: isDark ? 0.4 : 0.6,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // OPTIMIZED: Throttled color update
    let lastColorUpdate = 0;
    const updateColors = () => {
      const now = Date.now();
      if (now - lastColorUpdate < 100) return; // Throttle
      lastColorUpdate = now;
      
      const isDarkNow = document.documentElement.classList.contains('dark');
      if (particlesMaterial) {
        particlesMaterial.color.set(isDarkNow ? '#F26D3D' : '#03318C');
        particlesMaterial.opacity = isDarkNow ? 0.4 : 0.6;
        particlesMaterial.blending = isDarkNow ? THREE.AdditiveBlending : THREE.NormalBlending;
      }
    };

    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // OPTIMIZED: Frame throttling for battery/performance
    let lastFrameTime = 0;
    const targetFPS = isMobile ? 30 : 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = currentTime - lastFrameTime;
      
      if (deltaTime >= frameInterval) {
        lastFrameTime = currentTime - (deltaTime % frameInterval);
        
        if (particlesMesh && !prefersReducedMotion) {
          // OPTIMIZED: Slower rotation for better performance
          particlesMesh.rotation.y += 0.0003;
          particlesMesh.rotation.x += 0.0001;
        }
        
        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // OPTIMIZED: Debounced resize
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (camera && renderer) {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      
      // Complete cleanup
      if (renderer) {
        renderer.dispose();
        if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
      }
      if (particlesGeometry) particlesGeometry.dispose();
      if (particlesMaterial) particlesMaterial.dispose();
    };
  }, [isVisible]);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 z-0 pointer-events-none transition-colors duration-700
        bg-[#f8fafc] dark:bg-[#000000]
        bg-[radial-gradient(circle_at_top,_#f1f5f9_0%,_#f8fafc_100%)] 
        dark:bg-[radial-gradient(circle_at_top,_#0B1121_0%,_#000000_100%)]"
      aria-hidden="true"
    />
  );
});

ImmersiveBackground.displayName = 'ImmersiveBackground';

export default ImmersiveBackground;