import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";

//◆◆◆1.vertexShaderとfragmentShaderのファイルを作成し、インポートする。
import vertexShader from "./shaders/vertexShader";
import fragmentShader from "./shaders/fragmentShader";

//画像の呼び出し
import skyImage from "./textures/sky.jpg";


/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const skytexture = textureLoader.load(skyImage);
scene.background = skytexture;

// Geometry
const geometry = new THREE.PlaneGeometry(10, 10, 240, 240);

// Color
const colorObject = {};
colorObject.depthColor = "#2d81ae";//ダークカラー
colorObject.surfaceColor = "#66c1f9";//ハイライトカラー

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide, //PlaneGeometryの両面が表示されるように変更

  uniforms:{
    //uWavelengthという変数を定義
    uWavelength:{ value: 0.05 },
    uFrequency:{ value: new THREE.Vector2(10, 7)},
    uTime: { value: 0 },
    uWavespeed: { value: 3.28 },
    uDepthColor: { value: new THREE.Color(colorObject.depthColor)},
    uSurfaceColor: { value: new THREE.Color(colorObject.surfaceColor)},
    
    //色のコントランストをはっきりさせる
    uColorOffset: { value: 0.1 },
    uColorMultiplier: { value: 7.0 },

    //細かな波の制御
    uSmallWaveElevation: { value: 0.15 },
    uSmallWaveFrequency: { value: 4.0 },
    uSmallWaveSpeed: { value: 0.2 },
  }
});

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2;//-90度回転
scene.add(mesh);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0.23, 0);
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const animate = () => {
  //時間取得
  const elapsedTime = clock.getElapsedTime();

  //カメラを演習場に回転させる
  camera.position.x = Math.sin(elapsedTime * 0.3) * 3.0;//（時間の経過　× 0.3（速度調整））× 3.0（回転する半径の大きさ）
  camera.position.z = Math.cos(elapsedTime * 0.3) * 3.0;

  //カメラ位置を不規則に
  camera.lookAt(
    Math.sin(elapsedTime), 
    Math.cos(elapsedTime * 0.5), 
    Math.sin(elapsedTime * 0.3)
    );


  material.uniforms.uTime.value = elapsedTime;

  //controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();

//UIデバッグの導入
const gui = new dat.GUI({width: 300});

//デバッグの追加
gui
  .add(material.uniforms.uWavelength, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uWavelength");

gui
  .add(material.uniforms.uFrequency.value, "x")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uFrequency.x");

gui
  .add(material.uniforms.uFrequency.value, "y")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uFrequency.y");

gui
  .add(material.uniforms.uWavespeed, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uWavespeed");

gui
  .addColor(colorObject, "depthColor").onChange(() =>{
    material.uniforms.uDepthColor.value.set(colorObject.depthColor);
  });

gui
  .addColor(colorObject, "surfaceColor").onChange(() =>{
    material.uniforms.uSurfaceColor.value.set(colorObject.surfaceColor);
  });


gui
  .add(material.uniforms.uColorOffset, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uColorOffset");

gui
  .add(material.uniforms.uColorMultiplier, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uColorMultiplier");

  gui
  .add(material.uniforms.uSmallWaveElevation, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uSmallWaveElevation");

  gui
  .add(material.uniforms.uSmallWaveFrequency, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uSmallWaveFrequency");

  gui
  .add(material.uniforms.uSmallWaveSpeed, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uSmallWaveSpeed");

  gui.show(false);