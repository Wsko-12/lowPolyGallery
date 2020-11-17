import * as THREE from './libs/ThreeJsLib/build/three.module.js';
import {
  OrbitControls
} from './libs/ThreeJsLib/examples/jsm/controls/OrbitControls.js';
const PI180 = 0.01745;



let SCENE = new THREE.Scene();
SCENE.background = new THREE.Color(0x9fd8db);
const CAMERA = new THREE.PerspectiveCamera(20, 1, 0.2, 600);
SCENE.add(CAMERA);
CAMERA.position.set(50, 50, 50);
CAMERA.lookAt(0, 0, 0);
const RENDERER = new THREE.WebGLRenderer();

const axesHelper = new THREE.AxesHelper(100);
SCENE.add(axesHelper);


document.querySelector('#renderBody').appendChild(RENDERER.domElement);



let mouse = {
  position: {
    x: 0,
    y: 0,
  },
  windowSize: {
    w: 0,
    h: 0,
  },
};



document.onmousemove = function(event) {
  mouse.position.x = event.clientX;
  mouse.position.y = event.clientY;
};
document.addEventListener('touchstart', {
  handleEvent(event) {
    mouse.position.x = event.touches[0].clientX;
    mouse.position.y = event.touches[0].clientY;
  }
});
document.addEventListener('touchmove', {
  handleEvent(event) {
    mouse.position.x = event.touches[0].clientX;
    mouse.position.y = event.touches[0].clientY;
  }
});
document.addEventListener('touchend', {
  handleEvent(event) {
    mouse.position.x = mouse.windowSize.w / 2;
    mouse.position.y = mouse.windowSize.h / 2;
  }
});








const playerView = {
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
  rotationSpeed: 2,
  deg: 0,
  rad: 0,
};

function rotateView(bool) {
  if (bool) {
    if (playerView.deg + playerView.rotationSpeed < 360) {
      playerView.deg += playerView.rotationSpeed;
    } else {
      playerView.deg = 0;
    }
  } else {
    if (playerView.deg - playerView.rotationSpeed > 0) {
      playerView.deg -= playerView.rotationSpeed;
    } else {
      playerView.deg = 360 - playerView.rotationSpeed;
    }
  };

  let cameraShift_X, cameraShift_Z;

  cameraShift_X = playerView.distance * Math.sin(playerView.deg * PI180);
  cameraShift_Z = playerView.distance * Math.cos(playerView.deg * PI180);





  playerView.shift.x = cameraShift_X;
  playerView.shift.z = cameraShift_Z;

  CAMERA.position.x = playerView.position.x + playerView.shift.x;
  CAMERA.position.z = playerView.position.z + playerView.shift.z;
  CAMERA.lookAt(0, 0, 0);
};




function checkMousePosition() {
  if (mouse.position.x < mouse.windowSize.w / 8) {
    rotateView(false)
  }
  if (mouse.position.x > (mouse.windowSize.w / 8 * 7)) {
    rotateView(true);
  }
};


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


let vectorMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(0.2, 0.2, 0.2), new THREE.MeshBasicMaterial({color: 0xd40b79,})); // ___________HELPER___________
vectorMesh.position.y = 1.5;
SCENE.add(vectorMesh); // ___________HELPER___________

SCENE.add(userMesh);

document.addEventListener('keydown', playerKeysEvents);
document.addEventListener('keyup', playerKeysEvents);


let PLAYER = {
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
    speed: 0.05,
    forward: false, // 1 is forward, -1 is backward;
    sideways: false, // -1 is right, 1 is left
  },
  vectors:{
    x:0,
    y:0,
    z:0,
    deg:0,
    rad:0,
  },
  moveVectorPosition:{
    x:0,
    y:0,
    z:10,
  },
  mesh:userMesh,

};


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



function updatePlayerPosition(){
  let positions = PLAYER.position;
  let moves = PLAYER.move;
  let vectors = PLAYER.vectors;

  if(!!moves.forward){
    vectors.x = Math.sin((180+playerView.deg)*PI180)*moves.speed*moves.forward;
    vectors.z = Math.cos((180+playerView.deg)*PI180)*moves.speed*moves.forward;
  };
  if(!!moves.sideways){
    if(!!moves.forward){
      vectors.x += Math.cos((180-playerView.deg)*PI180)*moves.speed*moves.sideways;
      vectors.z += Math.sin((180-playerView.deg)*PI180)*moves.speed*moves.sideways;
    }else{
      vectors.x = Math.cos((180-playerView.deg)*PI180)*moves.speed*moves.sideways;
      vectors.z = Math.sin((180-playerView.deg)*PI180)*moves.speed*moves.sideways;
    }

  };
  if(!!moves.forward || !!moves.sideways){
    positions.x += vectors.x;
    positions.z += vectors.z;
  };



  let MESH = PLAYER.mesh;
  MESH.position.x = positions.x;
  MESH.position.z = positions.z;


  PLAYER.moveVectorPosition.x = positions.x + (vectors.x*10);
  PLAYER.moveVectorPosition.z = positions.z + (vectors.z*10);

  vectorMesh.position.x = PLAYER.moveVectorPosition.x;
  vectorMesh.position.z = PLAYER.moveVectorPosition.z;
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
  mouse.windowSize.w = windowWidth;
  mouse.windowSize.h = windowHeight;
};



// var controls = new OrbitControls(camera, renderer.domElement);


animate();

function animate() {
  checkMousePosition();
  updatePlayerPosition();
  RENDERER.render(SCENE, CAMERA);
  // controls.update()
  requestAnimationFrame(animate);
}
