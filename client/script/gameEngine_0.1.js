import * as THREE from './libs/ThreeJsLib/build/three.module.js';
import * as GEN from './myGeneralFunctions.js';
import {rotateCamera} from './Mechanics/cameraMoves.js';
import {updatePlayerPosition} from './Mechanics/playerMoves.js';
import {
  OrbitControls
} from './libs/ThreeJsLib/examples/jsm/controls/OrbitControls.js';
const PI180 = 0.01745;



let SCENE = new THREE.Scene();
SCENE.background = new THREE.Color(0x9fd8db);
export const CAMERA = new THREE.PerspectiveCamera(20, 1, 0.2, 600);
SCENE.add(CAMERA);
CAMERA.position.set(50, 50, 50);
CAMERA.lookAt(0, 0, 0);
const RENDERER = new THREE.WebGLRenderer();

const axesHelper = new THREE.AxesHelper(100);
SCENE.add(axesHelper);

document.querySelector('#renderBody').appendChild(RENDERER.domElement);



let material = new THREE.MeshPhongMaterial({
  color: 0xffffff
});
let groundGeom = new THREE.BoxBufferGeometry(10, 1, 10);
let ground = new THREE.Mesh(groundGeom, material);
// ground.position.y = -0.5;
SCENE.add(ground);
SCENE.add(new THREE.HemisphereLight(0xdffffa, 0x4a4a4a, 1));

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
    y: 50,
    z: 0,
  },
  shift: {
    x: 0,
    y: 0,
    z: 0,
  },
  distance: 50,
  rotationSpeed: 1.5,
  deg: 0,
  rad: 0,
};
export const PLAYER = {
  position: {
    x: 0,
    y: 0,
    z: 0,
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
    stepAngle: 50, //угол, на который может наступить
    step: 2, //сколько шагов от него вектор

  },
  mesh: userMesh,

};














rotateCamera();
function checkMousePosition() {
  if (MOUSE.position.x < MOUSE.windowSize.w / 8) {
    rotateCamera(false);
  };
  if (MOUSE.position.x > (MOUSE.windowSize.w / 8 * 7)) {
    rotateCamera(true);
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

  MOUSE.position.x = windowWidth / 2;
  MOUSE.position.y = windowHeight / 2;
};






animate();

function animate() {
  checkMousePosition();
  updatePlayerPosition();
  RENDERER.render(SCENE, CAMERA);
  // setTimeout(animate,500);
  requestAnimationFrame(animate);
}
