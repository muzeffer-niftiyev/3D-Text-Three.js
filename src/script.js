import GUI from "lil-gui";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const gui = new GUI({
  title: "Debug UI",
  width: 300,
});

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const matcapsArr = [
  textureLoader.load(`/textures/matcaps/1.png`),
  textureLoader.load(`/textures/matcaps/2.png`),
  textureLoader.load(`/textures/matcaps/3.png`),
  textureLoader.load(`/textures/matcaps/4.png`),
  textureLoader.load(`/textures/matcaps/5.png`),
  textureLoader.load(`/textures/matcaps/6.png`),
  textureLoader.load(`/textures/matcaps/7.png`),
  textureLoader.load(`/textures/matcaps/8.png`),
];

const parameters = {
  matcap: 8,
};

const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshMatcapMaterial
    ) {
      child.material.matcap = matcapsArr[parameters.matcap - 1];
      matcapsArr[parameters.matcap - 1].colorSpace = THREE.SRGBColorSpace;
      child.material.needsUpdate = true;
    }
  });
};

gui
  .add(parameters, "matcap")
  .min(1)
  .max(8)
  .step(1)
  .onFinishChange(() => {
    updateAllMaterials();
  })
  .name("Matcap");

const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Muzeffer Niftiyev", {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.center();

  const material = new THREE.MeshMatcapMaterial({
    matcap: matcapsArr[parameters.matcap - 1],
  });
  material.matcap.colorSpace = THREE.SRGBColorSpace;

  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);
  gui.add(text, "visible").name("Text Visibility");
  const donutGeometry = new THREE.TorusGeometry(0.4, 0.3, 30, 85);

  for (let i = 0; i < 300; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);
    donut.position.x = (Math.random() - 0.5) * 18;
    donut.position.y = (Math.random() - 0.5) * 18;
    donut.position.z = (Math.random() - 0.5) * 18;
    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    scene.add(donut);
  }
});

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
