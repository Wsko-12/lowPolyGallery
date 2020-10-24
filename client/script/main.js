import * as THREE from './libs/three.module.js';
import * as GF from './myGeneralFunctions.js';
import MATERIAL_LIB from './myItemsLib/materialLib.js';
import MODELS_LIB_JSON from './myItemsLib/modelsLibJSON.js';

import { GUI } from './libs/dat.gui.module.js';

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

import { BokehPass } from './libs/postprocessing/BokehPass.js';


import {
  OrbitControls
} from './libs/OrbitControls.js';





const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(20, 1, 20, 400);
camera.position.set(50, 50, 50);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;


let night = true;
//________BLOOM_POSTPROCESSING________
let renderScene = new RenderPass(scene, camera);
// UnrealBloomPass( resolution, strength, radius, threshold )
let bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 2, 1.2, 0.27);

let bokehPass = new BokehPass( scene, camera, {
					focus: 40,
					aperture: 0.001,
					maxblur: 0.01,

					width: window.innerWidth,
					height: window.innerHeight,
				});


let composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);
composer.addPass(bokehPass);


// ________/BLOOM_POSTPROCESSING________




let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

};
let focusSettings = {
  focus:0,
  speed:1,
};






// let geom = new THREE.BoxBufferGeometry(1,1,1);
//
//
//
// let mat = new THREE.MeshPhongMaterial({color:0x0057ff,shininess:150,transparent:false,opacity:0.4});
// let mesh = new THREE.Mesh(geom,mat);
// mesh.position.set(1,0,0);
// scene.add(mesh);
//
//
// let mat2 = new THREE.MeshPhongMaterial({color:0xffed00,emissive: new THREE.Color(0xffed00),emissiveIntensity: 0,transparent:true,opacity:0.4});
// let mesh2 = new THREE.Mesh(geom,mat2);
// mesh2.position.set(-0.5,0,0);
// scene.add(mesh2);
//
// scene.add( new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 ) );


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








function MyJsonModelParser(json) { //for database save, without material obj, onli material info
  json = JSON.parse(json);
  let parsed = {
    type: 'model',
    name: json.object.name,
    childs: {},
    position: [0, 0, 0],
    lighting: [],
  };

  function MyJsonModelСonverter(parent, arr, geomArr) {
    arr.forEach((item) => {
      switch (item.type) {
        case 'Group':
          parent.childs[item.name] = {
            type: 'group',
            childs: {},
          };
          MyJsonModelСonverter(parent.childs[item.name], item.children, geomArr);
          break;
        case 'Mesh':
          let geom;
          geomArr.forEach((item2) => {
            item2.uuid === item.geometry ? geom = item2 : false;
          });
          let mat;
          if(item.userData.material){
            mat = item.userData.material;
          }else{
            mat = item.userData.name.split('_');
          };
          let shadows = {
            cast: true,
            receive: true
          };
          if (item.userData.shadows) {
            let shadow = item.userData.shadows;
            shadow.cast ? shadows.cast = false : false;
            shadow.receive ? shadows.receive = false : false;
          };

          parent.childs[item.name] = {
            type: 'geometry',
            material: mat,
            json: geom,
            shadows: shadows,
          };
          break;
        case 'SpotLight':
          let lightObj = item.userData;
          lightObj.type = 'SpotLight';

          parsed.lighting.push(lightObj);
          break;
        default:
      };
    });
  };
  MyJsonModelСonverter(parsed, json.object.children, json.geometries, );
  return parsed;
};


function MyModelParser(obj, parent, parsedModel) {
  switch (obj.type) {
    case 'model':
      let model = new THREE.Group(); // Раньше было Object3D
      if (obj.lighting[0] != undefined) {
        obj.lighting.forEach((light) => {
          MyLightParser(light, model, obj);
          // model.attach(MyLightParser(light,model,obj)); //аттачит уже в функции
        });
      };
      for (let child in obj.childs) {
        MyModelParser(obj.childs[child], model, model);
      };
      model.position.set(obj.position[0], obj.position[1], obj.position[2]);
      return model;
      break;
    case 'group':
      let group = new THREE.Group(); // Раньше было Object3D
      for (let child in obj.childs) {
        MyModelParser(obj.childs[child], group, model);
      };
      parent.attach(group);
      break;
    case 'geometry':
      let geometry = new THREE.BufferGeometryLoader().parse(obj.json);
      let shadows = obj.shadows;
      let mat = obj.material;
      if (mat[0] === 'Glass' || mat[0] === 'Liquid' || mat[0] === 'Deep' || mat[0] === 'LightMaterial') {
        shadows.cast = shadows.receive = false;
      };
      let material = MATERIAL_LIB[mat[0]][mat[1]];
      let mesh = new THREE.Mesh(geometry, material);

      mesh.castShadow = obj.shadows.cast;
      mesh.receiveShadow = obj.shadows.cast;
      parent.attach(mesh);
      break;
    default:
  };
};



function MyLightParser(lightSettings, model, modelSettings) {
  let color = lightSettings.color;
  let rgb = `rgb(${color[0]},${color[1]},${color[2]})`;
  switch (lightSettings.type) {
    case 'SpotLight':
      let spotLight = new THREE.SpotLight(rgb, lightSettings.intensity);
      spotLight.castShadow = true;

      spotLight.position.set(lightSettings.position[0], lightSettings.position[1], lightSettings.position[2]);

      spotLight.angle = lightSettings.angle;

      spotLight.penumbra = lightSettings.penumbra;

      spotLight.distance = lightSettings.distance;
      spotLight.target.position.set(lightSettings.position[0] + lightSettings.target[0], lightSettings.position[1] + lightSettings.target[1], lightSettings.position[2] + lightSettings.target[2]);

      spotLight.shadow.mapSize.width = 512; //default
      spotLight.shadow.mapSize.height = 512; //default

      spotLight.shadow.camera.near = 0.1; //default
      spotLight.shadow.camera.far = 20; //default
      spotLight.shadow.camera.fov = 45; //default

      model.attach(spotLight);
      model.attach(spotLight.target);
      break;
    default:

  };


};





let loadModel = MyModelParser(MyJsonModelParser(MODELS_LIB_JSON.LoneStarMotel));
scene.add(loadModel);








scene.background = new THREE.Color(0x090a12);
//scene.fog = new THREE.Fog(0x090a12, 0.1, 150);
let skyLight = new THREE.HemisphereLight(0x394373, 0x616161, 0.3);
let moonLight =  new THREE.DirectionalLight(0x94f3f6, 0.1);
    moonLight.castShadow = true;
    moonLight.position.set(30, 30, -30);
    moonLight.target.position.set(0, 0, 0);
    moonLight.shadow.camera.zoom = 0.1;


scene.add(moonLight);
scene.add(moonLight.target);
scene.add(skyLight);









setSizes();
document.body.appendChild(renderer.domElement);


window.onresize = function() {
  setSizes();
};
window.addEventListener( 'mousemove', onMouseMove, false );

function setSizes() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const pixelRatio = window.devicePixelRatio;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(windowWidth, windowHeight);

  camera.aspect = windowWidth / windowHeight;
  camera.updateProjectionMatrix();
  composer.setSize(windowWidth * pixelRatio, windowHeight * pixelRatio);

};



var controls = new OrbitControls(camera, renderer.domElement);
console.log(scene)
function animate() {
  if (night) {
    composer.render();
  } else {
    renderer.render(scene, camera);
  };

  //requestAnimationFrame( animate );


  //______Raycaster_______

  raycaster.setFromCamera( mouse, camera );
  let intersects = raycaster.intersectObjects( scene.children[0].children );
  for ( var i = 0; i < intersects.length; i++ ) {
    //bokehPass.uniforms[ "focus" ].value =  intersects[0].distance
    focusSettings.focus < intersects[0].distance ? focusSettings.focus += focusSettings.speed : focusSettings.focus -= focusSettings.speed;
    bokehPass.uniforms[ "focus" ].value = focusSettings.focus;
  };
  //______//Raycaster_______








  controls.update();
};
animate();
setInterval(animate, 1000 / 25);
