import * as THREE from './libs/three.module.js';
import * as GF from './myGeneralFunctions.js';



import {
  EffectComposer
} from './libs/postprocessing/EffectComposer.js';
import {
  RenderPass
} from './libs/postprocessing/RenderPass.js';
import {
  ShaderPass
} from './libs/postprocessing/ShaderPass.js';
import {
  UnrealBloomPass
} from './libs/postprocessing/UnrealBloomPass.js';
import {
  OrbitControls
} from './libs/OrbitControls.js';







const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, 1, 10, 500);
camera.position.set(10, 10, -10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();







let night = true;
//________BLOOM_POSTPROCESSING________
let renderScene = new RenderPass( scene, camera );
                  // UnrealBloomPass( resolution, strength, radius, threshold )
let bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 2, 1, 0.8 );

let composer = new EffectComposer( renderer );
			composer.addPass( renderScene );
			composer.addPass( bloomPass );

// ________/BLOOM_POSTPROCESSING________













let geom = new THREE.BoxBufferGeometry(1,1,1);



let mat = new THREE.MeshPhongMaterial({color:0xc4c4c4,/*emissive: new THREE.Color(0xeb00ff),*/shininess:150});
let mesh = new THREE.Mesh(geom,mat);
mesh.position.set(1,0,0);
scene.add(mesh);


let mat2 = new THREE.MeshBasicMaterial({color:0xbbff00});
let mesh2 = new THREE.Mesh(geom,mat2);
mesh2.position.set(-0.5,0,0);
scene.add(mesh2);

scene.add( new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.5 ) );


// const light = new THREE.PointLight(0x43c8e6, 1);
// light.position.set(2, 2, 0);
// scene.add(light);
// const helper = new THREE.PointLightHelper(light);
// scene.add(helper);
//
// setInterval(function(){
//   if(mat.emissiveIntensity){
//     mat.emissiveIntensity = 0;
//   }else{
//     mat.emissiveIntensity = 1;
//   }
//
// },200)





scene.background = new THREE.Color(0x00ff7d)



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
  composer.setSize( windowWidth*pixelRatio, windowHeight*pixelRatio );

};



var controls = new OrbitControls( camera, renderer.domElement );

function animate() {

        if(night){
          composer.render();
        }else{
          renderer.render(scene, camera);
        };

        requestAnimationFrame( animate );
        controls.update();
			};
animate();
