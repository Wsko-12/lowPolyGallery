import * as THREE from './libs/ThreeJsLib/build/three.module.js';
import * as GEN from './myGeneralFunctions.js';
import {
  setCamera
} from './Mechanics/cameraMoves.js';
import {
  updatePlayerPosition
} from './Mechanics/playerMoves.js';
import {
  OrbitControls
} from './libs/ThreeJsLib/examples/jsm/controls/OrbitControls.js';
import {
  EffectComposer
} from './libs/ThreeJsLib/examples/jsm/postprocessing/EffectComposer.js';
import {
  RenderPass
} from './libs/ThreeJsLib/examples/jsm/postprocessing/RenderPass.js';
import {
  ShaderPass
} from './libs/ThreeJsLib/examples/jsm/postprocessing/ShaderPass.js';
import {
  UnrealBloomPass
} from './libs/ThreeJsLib/examples/jsm/postprocessing/UnrealBloomPass.js';

import {
  BokehPass
} from './libs/ThreeJsLib/examples/jsm/postprocessing/BokehPass.js';




const PI180 = 0.01745;


export const STATIC_OBJECTS = [];
export const DINAMIC_OBJECTS = [];



export const SCENE = new THREE.Scene();
SCENE.background = new THREE.Color(0x9fd8db);
export const CAMERA = new THREE.PerspectiveCamera(20, 1, 0.2, 600);
SCENE.add(CAMERA);
CAMERA.position.set(50, 50, 50);
CAMERA.lookAt(0, 0, 0);
const RENDERER = new THREE.WebGLRenderer();
RENDERER.shadowMap.enabled = true;

// const axesHelper = new THREE.AxesHelper(100);
// SCENE.add(axesHelper);

document.querySelector('#renderBody').appendChild(RENDERER.domElement);













let material = new THREE.MeshPhongMaterial({
  color: 0xffffff,
});

let groundGeom = new THREE.BoxBufferGeometry(25, 1, 25);
let ground = new THREE.Mesh(groundGeom, material);
ground.position.y = -0.5;
ground.receiveShadow = true;
SCENE.add(ground);
STATIC_OBJECTS.push(ground);



for(let i=0;i<20;i++){
  let boxGeom = new THREE.BoxBufferGeometry(0.5, 1, 3);
  let box = new THREE.Mesh(boxGeom, material);
  box.position.x = -0.5*i;
  box.position.y = 0.5*i;

  SCENE.add(box);
  box.castShadow = true;
  box.receiveShadow = true;
  STATIC_OBJECTS.push(box);
};


{
  //box 0.8 height
  let boxGeom = new THREE.BoxBufferGeometry(3, 0.8, 3);
  let box = new THREE.Mesh(boxGeom, material);
  SCENE.add(box);
  box.castShadow = true;
  box.receiveShadow = true;
  box.position.y = 0.4;
  box.position.z =-4;
  box.position.x =5;
  STATIC_OBJECTS.push(box);
}


{
  //box 2.5height
  let boxGeom = new THREE.BoxBufferGeometry(3, 2.5, 3);
  let box = new THREE.Mesh(boxGeom, material);
  SCENE.add(box);
  box.castShadow = true;
  box.receiveShadow = true;
  box.position.y = 1.25;
  box.position.z =-4;
  STATIC_OBJECTS.push(box);
}
{
  //box 2.8height
  let boxGeom = new THREE.BoxBufferGeometry(2, 2.8, 5);
  let box = new THREE.Mesh(boxGeom, material);
  SCENE.add(box);
  box.castShadow = true;
  box.receiveShadow = true;
  box.position.y = 1.4;
  box.position.z =-4;
  box.position.x =-2;
  STATIC_OBJECTS.push(box);
}

{
  //box cline
  let boxGeom = new THREE.BoxBufferGeometry(2, 10, 2);
  let box = new THREE.Mesh(boxGeom, material);
  box.rotation.z = 10*PI180;
  box.position.z = 4;
  box.position.x = -8;
  box.position.y = 1;
  SCENE.add(box);
  box.castShadow = true;
  box.receiveShadow = true;
  STATIC_OBJECTS.push(box);
}
{
  //box cline
  let boxGeom = new THREE.BoxBufferGeometry(2, 10, 2);
  let box = new THREE.Mesh(boxGeom, material);
  box.rotation.z = 20*PI180;
  box.position.z = 6;
  box.position.x = -8;
  box.position.y = 1;
  SCENE.add(box);
  box.castShadow = true;
  box.receiveShadow = true;
  STATIC_OBJECTS.push(box);
}
{
  //box cline
  let boxGeom = new THREE.BoxBufferGeometry(2, 10, 2);
  let box = new THREE.Mesh(boxGeom, material);
  box.rotation.z = 30*PI180;
  box.position.z = 8;
  box.position.x = -8;
  box.position.y = 1;
  SCENE.add(box);
  box.castShadow = true;
  box.receiveShadow = true;
  STATIC_OBJECTS.push(box);
}
{
  //box cline
  let boxGeom = new THREE.BoxBufferGeometry(2, 10, 2);
  let box = new THREE.Mesh(boxGeom, material);
  box.rotation.z = 40*PI180;
  box.position.z = 10;
  box.position.x = -8;
  box.position.y = 1.5;
  SCENE.add(box);
  box.castShadow = true;
  box.receiveShadow = true;
  STATIC_OBJECTS.push(box);
}

{
  //box cline
  let boxGeom = new THREE.BoxBufferGeometry(1, 1, 1);
  let box = new THREE.Mesh(boxGeom, material);
  box.position.z = 2;
  box.position.x = 2;
  box.position.y = 0.5;
  SCENE.add(box);
  box.castShadow = true;
  box.receiveShadow = true;
  DINAMIC_OBJECTS.push(box);
}



const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.castShadow = true;
sun.position.set(60, 60, 60);
sun.target.position.set(0, 0, 0);
sun.shadow.camera.zoom = 0.2;
sun.shadow.mapSize.width = 512; //default
sun.shadow.mapSize.height = 512; //default;
SCENE.add(sun);
SCENE.add(sun.target);
SCENE.add(new THREE.HemisphereLight(0xdffffa, 0x4a4a4a, 0.3));

let userMesh = new THREE.Group();
let bodyMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(0.8, 1.8, 0.8), material);
let weaponMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(0.1, 1, 0.2), material);
weaponMesh.rotation.x = Math.PI / 180 * 90;
weaponMesh.position.x = 0.45;
weaponMesh.position.z = -0.5;
bodyMesh.position.y = 0.9;
weaponMesh.position.y = 0.9;

userMesh.add(bodyMesh);
userMesh.add(weaponMesh);
weaponMesh.castShadow = true;
weaponMesh.receiveShadow = true;
bodyMesh.castShadow = true;
bodyMesh.receiveShadow = true;
SCENE.add(userMesh);



export const vectorMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(0.2, 0.2, 0.2), new THREE.MeshBasicMaterial({
  color: 0xd40b79,
})); // ___________HELPER___________
vectorMesh.position.y = 1.5;
SCENE.add(vectorMesh); // ___________HELPER___________

export const MOUSE = {
  position: {
    x: 0,
    y: 0,
  },
  windowSize: {
    w: 0,
    h: 0,
  },
};
export const PLAYER_VIEW = {
  position: {
    x: 0,
    y: 0,
    z: 0,
  },
  shift: {
    x: 0,
    y: 0,
    z: 0,
  },
  smoothPosition:{
    x: 0,
    y: 0,
    z: 0,
  },
  smoothPoint:{
    x: 0,
    y: 0,
    z: 0,
  },
  smoothPointSpeed:{
    x: 0,
    y: 0,
    z: 0.05,
  },
  distance: 50,
  facticalDistance:0,
  rotationSpeed: 1.5,
  deg: 0,
  rad: 0,
};
export const PLAYER = {
  position: {
    x: 0,
    y: 10,
    z: 0,
    deg:0,
    block:false,
  },
  sizes:{
    w:0.8,
    h:1.8,
  },
  rotation: {
    x: 0,
    y: 0,
    z: 0,
  },
  move: {
    speed: 0.2,
    forward: false, // 1 is forward, -1 is backward;
    sideways: false, // -1 is right, 1 is left
    rotationSpeed: 15,
    jump:{
      flag:false,
      flagPeak:true,
      flagEnd:true,
      status:0,
      strength:5,//min 5:max 10 лучше всего
      vector:1,

    },
  },
  vectors: {
    x: 0,
    y: 0,
    z: 0,
    deg: 0,
    rad: 0,
  },
  moveVectorPosition: {
    x: 0,
    y: 0,
    z: 0,
    stepAngle: 55, //угол, на который может наступить
    step: 5, //сколько шагов от него вектор

  },
  mesh: userMesh,

};



const composer = new EffectComposer(RENDERER);
const renderScene = new RenderPass(SCENE, CAMERA);
composer.addPass(renderScene);
export const bokehPass = new BokehPass(SCENE, CAMERA, {
  focus: 70,
  aperture:  0.001,
  maxblur:  0.01,

  width: window.innerWidth,
  height: window.innerHeight,
});
composer.addPass(bokehPass);





setCamera();

function checkMousePosition() {
  if (MOUSE.position.x < MOUSE.windowSize.w / 3) {
    setCamera(false);
  };
  if (MOUSE.position.x > (MOUSE.windowSize.w / 3 * 2)) {
    setCamera(true);
  };
};






document.addEventListener('keydown', playerKeysEvents);
document.addEventListener('keyup', playerKeysEvents);




function playerKeysEvents(event) {

    switch (event.code) {
      case 'KeyW': {
        if (event.type === 'keydown') {
          PLAYER.move.forward = 1;
        } else if (event.type === 'keyup') {
          PLAYER.move.forward = false;
        };
      }
      break;


    case 'KeyS': {
      if (event.type === 'keydown') {
        PLAYER.move.forward = -1;
      } else if (event.type === 'keyup') {
        PLAYER.move.forward = false;
      };
    }
    break;


    case 'KeyA': {
      if (event.type === 'keydown') {
        PLAYER.move.sideways = 1;
      } else if (event.type === 'keyup') {
        PLAYER.move.sideways = false;
      };
    }
    break;


    case 'KeyD': {
      if (event.type === 'keydown') {
        PLAYER.move.sideways = -1;
      } else if (event.type === 'keyup') {
        PLAYER.move.sideways = false;
      };
    };
    break;

    };
  if(event.code === 'Space') {
      if (event.type === 'keydown' && !PLAYER.move.jump.flag && !PLAYER.position.onAir){
        PLAYER.move.jump.flag = true;
      };
  };
};









setSizes();
window.onresize = function() {
  setSizes();
};

function setSizes() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const pixelRatio = window.devicePixelRatio;

  RENDERER.setPixelRatio(window.devicePixelRatio);
  RENDERER.setSize(windowWidth, windowHeight);

  CAMERA.aspect = windowWidth / windowHeight;
  CAMERA.updateProjectionMatrix();
  MOUSE.windowSize.w = windowWidth;
  MOUSE.windowSize.h = windowHeight;
  composer.setSize(windowWidth * pixelRatio, windowHeight * pixelRatio);
  MOUSE.position.x = windowWidth / 2;
  MOUSE.position.y = windowHeight / 2;
};






animate();
updatePlayerPosition();

function animate() {
  checkMousePosition();
  updatePlayerPosition();
  composer.render();
  // RENDERER.render(SCENE, CAMERA);
  // setTimeout(animate,500);
  requestAnimationFrame(animate);
}
