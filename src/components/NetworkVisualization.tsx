
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface NetworkVisualizationProps {
  scanActive?: boolean;
  threatLevel?: 'low' | 'medium' | 'high' | 'none';
}

const NetworkVisualization = ({ 
  scanActive = false, 
  threatLevel = 'none' 
}: NetworkVisualizationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    nodes: THREE.Mesh[];
    controls: OrbitControls | null;
    animationId: number | null;
  }>({
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(),
    renderer: new THREE.WebGLRenderer(),
    nodes: [],
    controls: null,
    animationId: null,
  });

  // Get color based on threat level
  const getThreatColor = (): THREE.Color => {
    switch (threatLevel) {
      case 'high':
        return new THREE.Color('#f87171');
      case 'medium':
        return new THREE.Color('#fb923c');
      case 'low':
        return new THREE.Color('#4cc38a');
      default:
        return new THREE.Color('#4361ee');
    }
  };
  
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070c16');
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 15;
    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Create grid for reference
    const gridHelper = new THREE.GridHelper(20, 20, 0x4361ee, 0x4361ee);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.15;
    scene.add(gridHelper);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Add point light
    const pointLight = new THREE.PointLight(0x4361ee, 2, 100);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);
    
    // Create network nodes
    const nodes: THREE.Mesh[] = [];
    const nodeCount = 12;
    const radius = 8;
    
    // Create central node
    const centralGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const centralMaterial = new THREE.MeshStandardMaterial({
      color: 0x4361ee,
      emissive: 0x4361ee,
      emissiveIntensity: 0.5,
    });
    const centralNode = new THREE.Mesh(centralGeometry, centralMaterial);
    scene.add(centralNode);
    nodes.push(centralNode);
    
    // Create surrounding nodes
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 5;
      
      const geometry = new THREE.SphereGeometry(0.4 + Math.random() * 0.3, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: 0x4cc38a,
        emissive: 0x4cc38a,
        emissiveIntensity: 0.3,
      });
      
      const node = new THREE.Mesh(geometry, material);
      node.position.set(x, y, z);
      scene.add(node);
      nodes.push(node);
      
      // Create connection line to central node
      const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, y, z),
      ];
      
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x4cc38a,
        transparent: true,
        opacity: 0.5,
      });
      
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    }
    
    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      // Rotate central node
      centralNode.rotation.y += 0.01;
      
      // Animation for nodes
      nodes.forEach((node, index) => {
        if (index > 0) {
          node.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
          
          // Pulse effect for active scan
          if (scanActive) {
            const scale = 1 + Math.sin(Date.now() * 0.003 + index) * 0.1;
            node.scale.set(scale, scale, scale);
          }
        }
      });
      
      controls.update();
      renderer.render(scene, camera);
      
      sceneRef.current.animationId = animationId;
    };
    
    animate();
    
    // Store references for cleanup
    sceneRef.current = {
      scene,
      camera,
      renderer,
      nodes,
      controls,
      animationId: null,
    };
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  // Update node colors when threat level changes
  useEffect(() => {
    const threatColor = getThreatColor();
    
    sceneRef.current.nodes.forEach((node, index) => {
      if (index > 0) { // Skip central node
        (node.material as THREE.MeshStandardMaterial).color = threatColor;
        (node.material as THREE.MeshStandardMaterial).emissive = threatColor;
      }
    });
  }, [threatLevel]);
  
  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden"
    >
      {scanActive && (
        <div className="absolute top-0 left-0 right-0 p-2 bg-cyber-darker bg-opacity-80 text-cyber-green text-xs">
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-cyber-green animate-pulse mr-2"></div>
            <div className="terminal-text">
              SCAN_ACTIVE: {Math.floor(Math.random() * 100)}% COMPLETE
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkVisualization;
