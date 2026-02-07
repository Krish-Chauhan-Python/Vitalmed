import { useEffect, useRef } from "react";
import * as THREE from "three";

const HEART_POINT_COUNT = 300;
const LINE_DISTANCE = 0.38;
const CAMERA_RADIUS = 3.4;

type HeartBackgroundProps = {
  className?: string;
};

const HeartBackground = ({ className }: HeartBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 50);
    camera.position.set(0, 0, CAMERA_RADIUS);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const points = new Float32Array(HEART_POINT_COUNT * 3);
    const basePoints: THREE.Vector3[] = [];
    const jitterPhaseX: number[] = [];
    const jitterPhaseY: number[] = [];
    const jitterPhaseZ: number[] = [];
    const jitterAmp: number[] = [];
    let seed = 2026;
    const seededRandom = (min: number, max: number) => {
      seed += 1;
      const value = THREE.MathUtils.seededRandom(seed);
      return THREE.MathUtils.lerp(min, max, value);
    };

    for (let i = 0; i < HEART_POINT_COUNT; i += 1) {
      const t = seededRandom(0, Math.PI * 2);
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);
      const z = seededRandom(-1.6, 1.6);

      const vec = new THREE.Vector3(x, y, z)
        .multiplyScalar(0.085)
        .add(new THREE.Vector3(seededRandom(-0.035, 0.035), seededRandom(-0.035, 0.035), 0));

      basePoints.push(vec);
      jitterPhaseX.push(seededRandom(0, Math.PI * 2));
      jitterPhaseY.push(seededRandom(0, Math.PI * 2));
      jitterPhaseZ.push(seededRandom(0, Math.PI * 2));
      jitterAmp.push(seededRandom(0.002, 0.008));
      points[i * 3] = vec.x;
      points[i * 3 + 1] = vec.y;
      points[i * 3 + 2] = vec.z;
    }

    const geometry = new THREE.BufferGeometry();
    const positionAttribute = new THREE.BufferAttribute(points, 3);
    geometry.setAttribute("position", positionAttribute);

    const pointsMaterial = new THREE.PointsMaterial({
      color: new THREE.Color("#ff2d3f"),
      size: 0.075,
      sizeAttenuation: true,
      transparent: true,
      opacity: 1,
    });

    const pointCloud = new THREE.Points(geometry, pointsMaterial);
    group.add(pointCloud);

    const linePositions: number[] = [];
    for (let i = 0; i < basePoints.length; i += 1) {
      const a = basePoints[i];
      for (let j = i + 1; j < basePoints.length; j += 1) {
        const b = basePoints[j];
        if (a.distanceToSquared(b) < LINE_DISTANCE * LINE_DISTANCE) {
          linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3)
    );

    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color("#ff2d3f"),
      transparent: true,
      opacity: 0.36,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(lines);

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const pointer = new THREE.Vector2(0, 0);
    const targetRotation = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const pointerWorld = new THREE.Vector3();

    const handlePointer = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
      const y = -(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1);
      pointer.set(x, y);
    };

    window.addEventListener("pointermove", handlePointer);

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width || window.innerWidth;
      const height = rect.height || window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };

    resize();
    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      group.scale.setScalar(1);

      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(plane, pointerWorld);

      const repelRadius = 0.6;
      const repelStrength = 0.28;

      for (let i = 0; i < basePoints.length; i += 1) {
        const base = basePoints[i];
        const jitter = jitterAmp[i];
        const jitterX = Math.sin(elapsed * 1.2 + jitterPhaseX[i]) * jitter;
        const jitterY = Math.cos(elapsed * 1.4 + jitterPhaseY[i]) * jitter;
        const jitterZ = Math.sin(elapsed * 1.6 + jitterPhaseZ[i]) * jitter;

        const dx = base.x - pointerWorld.x;
        const dy = base.y - pointerWorld.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const falloff = Math.max(0, 1 - dist / repelRadius);
        const repel = falloff * falloff * repelStrength;
        const repelX = (dx / (dist + 0.001)) * repel;
        const repelY = (dy / (dist + 0.001)) * repel;

        positionAttribute.setXYZ(
          i,
          base.x + repelX + jitterX,
          base.y + repelY + jitterY,
          base.z + jitterZ
        );
      }
      positionAttribute.needsUpdate = true;

      const offsetX = pointer.x * 0.6;
      const offsetY = pointer.y * 0.3;

      targetRotation.set(pointer.y * 0.35, pointer.x * 0.55);
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetRotation.x, 0.05);
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRotation.y, 0.05);

      camera.position.x = offsetX;
      camera.position.z = CAMERA_RADIUS;
      camera.position.y = offsetY;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointer);
      geometry.dispose();
      lineGeometry.dispose();
      pointsMaterial.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className ?? "heart-background"}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: -1, pointerEvents: "none", opacity: 0.45 }}
      aria-hidden="true"
    />
  );
};

export default HeartBackground;
