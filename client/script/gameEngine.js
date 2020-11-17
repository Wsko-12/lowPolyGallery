import * as THREE from './libs/ThreeJsLib/build/three.module.js';
import {
  OrbitControls
} from './libs/ThreeJsLib/examples/jsm/controls/OrbitControls.js';




let scene = new THREE.Scene();
scene.background = new THREE.Color(0x9fd8db);
const camera = new THREE.PerspectiveCamera(20, 1, 0.2, 600);
scene.add(camera);
camera.position.set(0, 50, 50);
const renderer = new THREE.WebGLRenderer();
camera.__deg = 45;
camera.__degSpeed = 1;
camera.clientShift = {
  x:0,
  z:0,
};
camera.clientPosition = {
  x:0,
  y:50,
  z:50,
};

document.querySelector('#renderBody').appendChild(renderer.domElement);

let material = new THREE.MeshPhongMaterial({
  color: 0xffffff
});



let groundGeom = new THREE.BoxBufferGeometry(10, 1, 10);

let ground = new THREE.Mesh(groundGeom, material);
// scene.add(ground);

scene.add(new THREE.HemisphereLight(0xdffffa, 0x4a4a4a, 1));

let mouse = {
  position: {
    x: 0,
    y: 0,
  },
  windowSize: {
    w: 0,
    h: 0,
  },
}

function cameraRotation(bool) {
  if (bool) {
    if (camera.__deg + camera.__degSpeed <= 90) {
      camera.__deg += camera.__degSpeed;
    } else {
      camera.__deg = 90;
    }
  } else {
    if (camera.__deg - camera.__degSpeed >= 0) {
      camera.__deg -= camera.__degSpeed;
    } else {
      camera.__deg = 0;
    }
  };
  camera.clientShift.x = Math.sin(camera.__deg * Math.PI / 180)*50;
  camera.clientShift.z = Math.cos(camera.__deg * Math.PI / 180)*50;

}

function checkMousePosition() {
  if (mouse.position.x < mouse.windowSize.w / 5) {
    cameraRotation(false)
  }
  if (mouse.position.x > (mouse.windowSize.w / 5 * 4)) {
    cameraRotation(true);
  }
}

document.onmousemove = function(event) {
  mouse.position.x = event.clientX;
  mouse.position.y = event.clientY;
};
document.addEventListener('touchstart', {handleEvent(event) {
  mouse.position.x = event.touches[0].clientX;
  mouse.position.y = event.touches[0].clientY;
}});
document.addEventListener('touchmove', {handleEvent(event) {
  mouse.position.x = event.touches[0].clientX;
  mouse.position.y = event.touches[0].clientY;
}});
document.addEventListener('touchend', {handleEvent(event) {
  mouse.position.x = mouse.windowSize.w/2;
  mouse.position.y =  mouse.windowSize.h/2;
}});



let userMesh = new THREE.Group();
let bodyMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(0.8, 1.8, 0.8), material);
let weaponMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(0.1, 1, 0.2), material);
weaponMesh.rotation.x = Math.PI/180*90;
weaponMesh.position.x = 0.45;
weaponMesh.position.z = -0.5;
userMesh.add(bodyMesh);
userMesh.add(weaponMesh);

let user = {
  position: {
    x: 0,
    y: 0,
    z: 0,
  },
  vector_rad:0,
  vector_deg:0,
  rotationSpeed:0.05,
  size: {
    w: 0.8,
    h: 1.8,
  },
  move: {
    speed: 0.2,
    x: false,
    z: false,
  },
  mesh:userMesh,
  updatePosition() {
    if (!!this.move.x) {
      let shiftZ = (this.position.x - camera.position.x) / 50 * this.move.x;
      let shiftX = -(this.position.z - camera.position.z) / 50 * this.move.x;

      camera.clientPosition.x += shiftX * this.move.speed;
      this.position.x += shiftX * this.move.speed;
      camera.clientPosition.z += shiftZ * this.move.speed;
      this.position.z += shiftZ * this.move.speed;
    }
    if (!!this.move.z) {
      let shiftX = (this.position.x - camera.position.x) / 50 * this.move.z;
      let shiftZ = (this.position.z - camera.position.z) / 50 * this.move.z;

      camera.clientPosition.x += shiftX * this.move.speed;
      this.position.x += shiftX * this.move.speed;
      camera.clientPosition.z += shiftZ * this.move.speed;
      this.position.z += shiftZ * this.move.speed;
    }

    if (!!this.move.x||!!this.move.z){
      let positionBefore = user.mesh.position;
      let positionAfter = this.position;

      let vectorX = positionBefore.x - positionAfter.x;
      let vectorZ = positionBefore.z - positionAfter.z;
      if(vectorX == 0 && vectorZ!=0){
        if(vectorZ > 0){
          user.vector_rad = 0;
          user.vector_deg = 0;
        }else{
          user.vector_rad = Math.PI;
          user.vector_deg = 180;
        };
      }
      else if(vectorZ == 0 && vectorX!=0){
        if(vectorX > 0){
          user.vector_rad = 90 * Math.PI/180;
          user.vector_deg = 90;
        }else{
          user.vector_rad = 270 * Math.PI/180;
          user.vector_deg = 270;
        };
      }
      else{
        let tan = vectorX/vectorZ;
        let atan = Math.atan(tan);
        if(vectorZ>0){
          user.vector_rad = atan;
          user.vector_deg = atan * 180/Math.PI;
        }else{
           user.vector_rad = (180 + atan*180/Math.PI) * Math.PI/180;
           user.vector_deg = (180 + atan*180/Math.PI);
        };
      };

    };


    camera.position.x = camera.clientShift.x + this.position.x;
    camera.position.z = camera.clientShift.z + this.position.z;
    camera.lookAt(this.position.x, this.position.y, this.position.z);




    this.mesh.position.copy(this.position);

    // user.mesh.rotation.y > user.vector_rad ? user.mesh.rotation.y -= user.rotationSpeed : user.mesh.rotation.y += user.rotationSpeed;

    // user.mesh.rotation.y = user.vector_rad;

  },
};
scene.add(user.mesh);



document.onkeydown = function(event) {
  if (event.keyCode === 68) { //d
    user.move.x = 1
  }
  if (event.keyCode === 83) { //s
    user.move.z = -1
  }
  if (event.keyCode === 65) { //a
    user.move.x = -1
  }
  if (event.keyCode === 87) { // w
    user.move.z = 1
  }
};
document.onkeyup = function(event) {
  if (event.keyCode === 68) //d
    user.move.x = false;
  if (event.keyCode === 83) //s
    user.move.z = false;
  if (event.keyCode === 65) //a
    user.move.x = false;
  if (event.keyCode === 87) // w
    user.move.z = false;
};







setSizes();
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
  mouse.windowSize.w = windowWidth;
  mouse.windowSize.h = windowHeight;
};


const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);
// var controls = new OrbitControls(camera, renderer.domElement);


animate();

function animate() {
  user.updatePosition();
  checkMousePosition();
  renderer.render(scene, camera);
  // controls.update()
  requestAnimationFrame(animate);
}
