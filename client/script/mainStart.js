import * as THREE from './libs/three.module.js';
import * as GF from './myGeneralFunctions.js';



// import {
//   EffectComposer
// } from './libs/postprocessing/EffectComposer.js';
// import {
//   RenderPass
// } from './libs/postprocessing/RenderPass.js';
// import {
//   ShaderPass
// } from './libs/postprocessing/ShaderPass.js';
// import {
//   UnrealBloomPass
// } from './libs/postprocessing/UnrealBloomPass.js';









const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdab861);

const camera = new THREE.PerspectiveCamera(45, 1, 10, 500);
camera.position.set(10, 10, -10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();

setSizes();
document.body.appendChild( renderer.domElement );





























window.onresize = function() {
  setSizes();
};

function setSizes() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const pixelRatio = window.devicePixelRatio;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(windowWidth, windowHeight);

  camera.aspect = windowWidth / windowHeight;
  camera.updateProjectionMatrix();


};
