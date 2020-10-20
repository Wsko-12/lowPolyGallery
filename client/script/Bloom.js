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





var renderScene = new RenderPass( scene, camera );
                  // UnrealBloomPass( resolution, strength, radius, threshold )
var bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
			bloomPass.threshold = 0;
			bloomPass.strength = 1.5;
			bloomPass.radius = 1;

var composer = new EffectComposer( renderer );
			composer.addPass( renderScene );
			composer.addPass( bloomPass );















let geom = new THREE.BoxBufferGeometry(1,1,1);



let mat = new THREE.MeshPhongMaterial({color:0xeb00ff});
let mesh = new THREE.Mesh(geom,mat);
mesh.position.set(1,0,0);
scene.add(mesh);


let mat2 = new THREE.MeshBasicMaterial({color:0xbbff00});
let mesh2 = new THREE.Mesh(geom,mat2);
mesh2.position.set(-0.5,0,0);
scene.add(mesh2);

scene.add( new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.2 ) );














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
  composer.setSize( windowWidth, windowHeight );

};



var controls = new OrbitControls( camera, renderer.domElement );
scene.background = new THREE.Color(0x01000a)

function animate() {

        if(night){
          composer.render();
        }else{
          renderer.render(scene, camera);
        }

        requestAnimationFrame( animate );
        controls.update();

			};
animate();
