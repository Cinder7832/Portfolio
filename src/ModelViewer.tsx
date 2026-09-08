import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import type { Artwork } from "./data";

const STUDIO_BACKGROUND = 0x202124;
const DEFAULT_EXPOSURE = 0.68;
const DEFAULT_KEY_INTENSITY = 1.45;
const DEFAULT_FILL_INTENSITY = 0.2;
const DEFAULT_RIM_INTENSITY = 0.38;
const DEFAULT_MODEL_YAW = 180;

const modelUrlFor = (artwork: Artwork) => {
  if (!artwork.modelUrl) {
    return null;
  }

  if (/^https?:\/\//.test(artwork.modelUrl)) {
    return artwork.modelUrl;
  }

  return `${import.meta.env.BASE_URL}${artwork.modelUrl.replace(/^\/+/, "")}`;
};

const disposeObjectResources = (root: THREE.Object3D) => {
  const textures = new Set<THREE.Texture>();
  const materials = new Set<THREE.Material>();
  const geometries = new Set<THREE.BufferGeometry>();

  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) {
      return;
    }

    geometries.add(object.geometry);
    const meshMaterials = Array.isArray(object.material) ? object.material : [object.material];
    meshMaterials.forEach((material) => {
      materials.add(material);
      Object.values(material).forEach((value) => {
        if (value instanceof THREE.Texture) {
          textures.add(value);
        }
      });
    });
  });

  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
  geometries.forEach((geometry) => geometry.dispose());
};

const createFallbackModel = (artwork: Artwork) => {
  const group = new THREE.Group();
  const isTower = artwork.id.includes("tower");
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: isTower ? 0x8a98a8 : 0xb87b44,
    roughness: 0.68,
    metalness: 0.08,
  });
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: isTower ? 0xd7c3a2 : 0x3d2b1f,
    roughness: 0.82,
  });
  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: 0x1f2328,
    roughness: 0.62,
    metalness: 0.18,
  });

  const bodyGeometry = isTower
    ? new THREE.CylinderGeometry(0.8, 1, 2.2, 6)
    : new THREE.BoxGeometry(1.75, 1.25, 1.45);
  const body = new THREE.Mesh(bodyGeometry, baseMaterial);
  body.position.y = isTower ? 1.1 : 0.625;
  group.add(body);

  if (isTower) {
    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.05, 0.8, 6), accentMaterial);
    roof.position.y = 2.6;
    group.add(roof);

    [-0.64, 0.1, 0.84].forEach((position) => {
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.84, 0.98, 0.08, 6), edgeMaterial);
      band.position.y = 1.1 + position;
      group.add(band);
    });
  } else {
    [
      { x: 0, y: 0.68, z: 0, sx: 1.98, sy: 0.12, sz: 1.64 },
      { x: 0, y: -0.68, z: 0, sx: 1.98, sy: 0.12, sz: 1.64 },
      { x: -0.94, y: 0, z: 0, sx: 0.12, sy: 1.45, sz: 1.62 },
      { x: 0.94, y: 0, z: 0, sx: 0.12, sy: 1.45, sz: 1.62 },
    ].forEach((slat) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(slat.sx, slat.sy, slat.sz), edgeMaterial);
      mesh.position.set(slat.x, 0.625 + slat.y, slat.z);
      group.add(mesh);
    });

    const brace = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.85, 1.62), accentMaterial);
    brace.rotation.z = Math.PI / 4;
    brace.position.y = 0.625;
    group.add(brace);
  }

  return group;
};

export default function ModelViewer({
  artwork,
  compact = false,
}: {
  artwork: Artwork;
  compact?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [viewerVersion, setViewerVersion] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    RectAreaLightUniformsLib.init();

    const viewer = artwork.viewer ?? {};
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(STUDIO_BACKGROUND);

    const camera = new THREE.PerspectiveCamera(36, 1, 0.01, 100);
    const initialCameraDirection = new THREE.Vector3(3.1, 2.8, 4.25).normalize();
    camera.position.copy(initialCameraDirection).multiplyScalar(6);

    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true,
      powerPreference: "high-performance",
    });
    const pixelRatio = Math.min(window.devicePixelRatio, compact ? 1.35 : 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(STUDIO_BACKGROUND, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.AgXToneMapping;
    renderer.toneMappingExposure = viewer.exposure ?? DEFAULT_EXPOSURE;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.zIndex = "1";
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.autoRotate = viewer.autoRotate ?? true;
    controls.autoRotateSpeed = -0.62;
    controls.minPolarAngle = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.025;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnvironment = new RoomEnvironment();
    const environmentTarget = pmremGenerator.fromScene(roomEnvironment, 0.03);
    disposeObjectResources(roomEnvironment);
    scene.environment = environmentTarget.texture;
    scene.environmentIntensity = 0.075;

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    const ambientLight = new THREE.AmbientLight(0xfff5e7, 0.006);
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0xfff4e4, 0x090a0b, 0.025);
    scene.add(hemisphereLight);

    const keyIntensity = viewer.keyIntensity ?? DEFAULT_KEY_INTENSITY;
    const fillIntensity = viewer.fillIntensity ?? DEFAULT_FILL_INTENSITY;
    const rimIntensity = viewer.rimIntensity ?? DEFAULT_RIM_INTENSITY;

    const keyPanel = new THREE.RectAreaLight(0xffe7c6, keyIntensity * 1.35, 3.2, 2.6);
    scene.add(keyPanel);

    const keyShadow = new THREE.DirectionalLight(0xffead0, keyIntensity);
    keyShadow.castShadow = true;
    keyShadow.shadow.mapSize.set(compact ? 1024 : 2048, compact ? 1024 : 2048);
    keyShadow.shadow.bias = 0.00045;
    keyShadow.shadow.normalBias = 0.022;
    keyShadow.shadow.radius = compact ? 5 : 8;
    keyShadow.shadow.blurSamples = compact ? 8 : 16;
    scene.add(keyShadow);

    const keyTarget = new THREE.Object3D();
    scene.add(keyTarget);
    keyShadow.target = keyTarget;

    const fillPanel = new THREE.RectAreaLight(0xcad8ff, fillIntensity, 3.8, 3.2);
    scene.add(fillPanel);

    const rimPanel = new THREE.RectAreaLight(0xdce7ff, rimIntensity, 2.8, 3.4);
    scene.add(rimPanel);

    const floorMaterial = new THREE.ShadowMaterial({
      color: 0x050505,
      opacity: compact ? 0.1 : 0.16,
      transparent: true,
      depthWrite: false,
    });
    floorMaterial.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "opacity * ( 1.0 - getShadowMask() )",
        "opacity * smoothstep( 0.16, 0.72, 1.0 - getShadowMask() )",
      );
    };
    floorMaterial.customProgramCacheKey = () => "thresholded-studio-shadow-v1";
    const shadowCatcher = new THREE.Mesh(new THREE.CircleGeometry(1, 128), floorMaterial);
    shadowCatcher.rotation.x = -Math.PI / 2;
    shadowCatcher.receiveShadow = true;
    shadowCatcher.renderOrder = 2;
    scene.add(shadowCatcher);

    const renderPass = new RenderPass(scene, camera);
    const gtaoPass = new GTAOPass(scene, camera, 1, 1);
    const gtaoVisibility = gtaoPass as GTAOPass & {
      _overrideVisibility: () => void;
      _visibilityCache: THREE.Object3D[];
    };
    const overrideGtaoVisibility = gtaoVisibility._overrideVisibility.bind(gtaoPass);
    gtaoVisibility._overrideVisibility = () => {
      overrideGtaoVisibility();
      if (shadowCatcher.visible) {
        shadowCatcher.visible = false;
        gtaoVisibility._visibilityCache.push(shadowCatcher);
      }
    };
    gtaoPass.updateGtaoMaterial({
      radius: compact ? 0.18 : 0.24,
      distanceExponent: 1.2,
      thickness: compact ? 0.75 : 1.05,
      distanceFallOff: 1,
      scale: 1,
      samples: compact ? 8 : 16,
      screenSpaceRadius: false,
    });
    gtaoPass.updatePdMaterial({
      lumaPhi: 10,
      depthPhi: 2,
      normalPhi: 3,
      radius: compact ? 6 : 8,
      radiusExponent: 2,
      rings: compact ? 1 : 2,
      samples: compact ? 8 : 16,
    });
    gtaoPass.blendIntensity = compact ? 0.48 : 0.72;
    const smaaPass = new SMAAPass();
    const outputPass = new OutputPass();
    const composerTarget = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      samples: Math.min(compact ? 2 : 4, renderer.capabilities.maxSamples),
    });
    const composer = new EffectComposer(renderer, composerTarget);
    composer.addPass(renderPass);
    composer.addPass(gtaoPass);
    composer.addPass(smaaPass);
    composer.addPass(outputPass);

    const textureAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const prepareModelForViewer = (object: THREE.Object3D) => {
      object.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) {
          return;
        }

        child.castShadow = true;
        child.receiveShadow = true;

        if (!child.geometry.attributes.normal) {
          child.geometry.computeVertexNormals();
        }

        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => {
          if (!(material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshPhysicalMaterial)) {
            return;
          }

          [
            material.map,
            material.normalMap,
            material.roughnessMap,
            material.metalnessMap,
            material.aoMap,
            material.emissiveMap,
            material.alphaMap,
          ].forEach((texture) => {
            if (texture) {
              texture.anisotropy = textureAnisotropy;
              texture.needsUpdate = true;
            }
          });
          material.needsUpdate = true;
        });
      });
    };

    let fittedBounds: THREE.Box3 | null = null;
    let lastFitDistance = 0;
    let disposed = false;

    const frameCamera = (bounds: THREE.Box3, preserveZoom: boolean) => {
      const size = bounds.getSize(new THREE.Vector3());
      const stageScale = Math.max(size.x, size.y, size.z, 0.01);
      const targetYOffset = viewer.targetYOffset ?? 0;
      const target = new THREE.Vector3(
        (bounds.min.x + bounds.max.x) / 2,
        bounds.min.y + size.y * (0.48 + targetYOffset),
        (bounds.min.z + bounds.max.z) / 2,
      );
      controls.target.copy(target);

      const verticalFov = THREE.MathUtils.degToRad(camera.fov);
      const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
      const targetFill = compact ? 0.86 : 0.78;
      const sortedDimensions = [size.x, size.y, size.z].sort((left, right) => right - left);
      const elongation = sortedDimensions[0] / Math.max(sortedDimensions[1], 0.001);
      const shapeBoost = THREE.MathUtils.clamp(
        1 + Math.max(0, elongation - 2) * 0.045,
        1,
        compact ? 1.14 : 1.08,
      );
      const effectiveTargetFill = Math.min(compact ? 0.98 : 0.88, targetFill * shapeBoost);
      const cameraDirection = camera.position.clone().sub(controls.target).normalize();
      const viewDirection =
        preserveZoom && cameraDirection.lengthSq() > 0
          ? cameraDirection
          : initialCameraDirection;
      const cameraRight = new THREE.Vector3().crossVectors(camera.up, viewDirection).normalize();
      const cameraUp = new THREE.Vector3().crossVectors(viewDirection, cameraRight).normalize();
      const corners = [
        new THREE.Vector3(bounds.min.x, bounds.min.y, bounds.min.z),
        new THREE.Vector3(bounds.min.x, bounds.min.y, bounds.max.z),
        new THREE.Vector3(bounds.min.x, bounds.max.y, bounds.min.z),
        new THREE.Vector3(bounds.min.x, bounds.max.y, bounds.max.z),
        new THREE.Vector3(bounds.max.x, bounds.min.y, bounds.min.z),
        new THREE.Vector3(bounds.max.x, bounds.min.y, bounds.max.z),
        new THREE.Vector3(bounds.max.x, bounds.max.y, bounds.min.z),
        new THREE.Vector3(bounds.max.x, bounds.max.y, bounds.max.z),
      ];
      const verticalLimit = Math.tan(verticalFov / 2) * effectiveTargetFill;
      const horizontalLimit = Math.tan(horizontalFov / 2) * effectiveTargetFill;
      let projectedFitDistance = stageScale * 0.5;

      corners.forEach((corner) => {
        const relativeCorner = corner.sub(target);
        const depthTowardCamera = relativeCorner.dot(viewDirection);
        const horizontalDistance = Math.abs(relativeCorner.dot(cameraRight)) / horizontalLimit;
        const verticalDistance = Math.abs(relativeCorner.dot(cameraUp)) / verticalLimit;
        projectedFitDistance = Math.max(
          projectedFitDistance,
          depthTowardCamera + horizontalDistance,
          depthTowardCamera + verticalDistance,
        );
      });

      const baseDistance = projectedFitDistance * (viewer.cameraDistanceMultiplier ?? 1);
      const zoomRatio = preserveZoom && lastFitDistance > 0
        ? camera.position.distanceTo(controls.target) / lastFitDistance
        : 1;
      const distance = baseDistance * THREE.MathUtils.clamp(zoomRatio, 0.62, 1.8);
      camera.position.copy(target).add(viewDirection.clone().multiplyScalar(distance));
      camera.near = Math.max(0.01, distance - stageScale * 3.5);
      camera.far = distance + stageScale * 24;
      camera.updateProjectionMatrix();
      controls.minDistance = baseDistance * 0.62;
      controls.maxDistance = baseDistance * 2.2;
      controls.update();
      lastFitDistance = baseDistance;

      const lightTarget = new THREE.Vector3(target.x, bounds.min.y + size.y * 0.55, target.z);
      keyTarget.position.copy(lightTarget);
      keyPanel.position.copy(lightTarget).add(new THREE.Vector3(-1.65, 2.05, 1.55).multiplyScalar(stageScale));
      keyPanel.width = stageScale * 1.4;
      keyPanel.height = stageScale * 1.15;
      keyPanel.lookAt(lightTarget);
      keyShadow.position.copy(lightTarget).add(new THREE.Vector3(-1.4, 2.25, 1.65).multiplyScalar(stageScale));

      fillPanel.position.copy(lightTarget).add(new THREE.Vector3(1.8, 1.15, 1.55).multiplyScalar(stageScale));
      fillPanel.width = stageScale * 1.75;
      fillPanel.height = stageScale * 1.5;
      fillPanel.lookAt(lightTarget);

      rimPanel.position.copy(lightTarget).add(new THREE.Vector3(1.35, 1.8, -2.05).multiplyScalar(stageScale));
      rimPanel.width = stageScale * 1.3;
      rimPanel.height = stageScale * 1.55;
      rimPanel.lookAt(lightTarget);

      const shadowExtent = stageScale * 2.2;
      keyShadow.shadow.camera.near = stageScale * 0.05;
      keyShadow.shadow.camera.far = stageScale * 8;
      keyShadow.shadow.camera.left = -shadowExtent;
      keyShadow.shadow.camera.right = shadowExtent;
      keyShadow.shadow.camera.top = shadowExtent;
      keyShadow.shadow.camera.bottom = -shadowExtent;
      keyShadow.shadow.camera.updateProjectionMatrix();

      shadowCatcher.position.set(target.x, bounds.min.y - stageScale * 0.0025, target.z);
      shadowCatcher.scale.setScalar(stageScale * 1.85);
    };

    const mountModel = (object: THREE.Object3D) => {
      object.rotation.y = THREE.MathUtils.degToRad(viewer.modelYaw ?? DEFAULT_MODEL_YAW);
      const initialBounds = new THREE.Box3().setFromObject(object);
      const center = initialBounds.getCenter(new THREE.Vector3());
      object.position.x -= center.x;
      object.position.y -= initialBounds.min.y;
      object.position.z -= center.z;
      prepareModelForViewer(object);
      modelGroup.clear();
      modelGroup.add(object);
      fittedBounds = new THREE.Box3().setFromObject(object);
      frameCamera(fittedBounds, false);
    };

    const modelUrl = modelUrlFor(artwork);
    if (modelUrl) {
      new GLTFLoader().load(
        modelUrl,
        (gltf) => {
          if (disposed) {
            disposeObjectResources(gltf.scene);
            return;
          }
          mountModel(gltf.scene);
        },
        undefined,
        (error) => {
          if (!disposed) {
            console.error(`Could not load 3D model: ${modelUrl}`, error);
            mountModel(createFallbackModel(artwork));
          }
        },
      );
    } else {
      mountModel(createFallbackModel(artwork));
    }

    let frameId = 0;
    let remountTimeout = 0;
    let isVisible = true;

    const renderFrame = () => {
      frameId = 0;
      if (disposed || !isVisible) {
        return;
      }
      controls.update();
      composer.render();
      frameId = window.requestAnimationFrame(renderFrame);
    };

    const startRendering = () => {
      if (!frameId && !disposed && isVisible) {
        frameId = window.requestAnimationFrame(renderFrame);
      }
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      renderer.setSize(width, height, false);
      composer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      if (fittedBounds) {
        frameCamera(fittedBounds, true);
      }
      startRendering();
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      window.cancelAnimationFrame(frameId);
      frameId = 0;
      window.clearTimeout(remountTimeout);
      remountTimeout = window.setTimeout(() => {
        setViewerVersion((version) => version + 1);
      }, 160);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startRendering();
        } else if (frameId) {
          window.cancelAnimationFrame(frameId);
          frameId = 0;
        }
      },
      { rootMargin: "160px" },
    );
    visibilityObserver.observe(container);
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    resize();
    startRendering();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(remountTimeout);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      controls.dispose();
      gtaoPass.dispose();
      smaaPass.dispose();
      outputPass.dispose();
      composer.dispose();
      environmentTarget.dispose();
      pmremGenerator.dispose();
      disposeObjectResources(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [artwork, compact, viewerVersion]);

  return (
    <div
      ref={containerRef}
      className={`relative isolate cursor-grab overflow-hidden bg-[var(--model-viewer-bg)] active:cursor-grabbing ${
        compact ? "h-full w-full" : "h-full min-h-[22rem] w-full"
      }`}
      aria-label={`${artwork.title} interactive 3D model viewer`}
      role="img"
    />
  );
}
