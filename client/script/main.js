import * as THREE from './libs/ThreeJsLib/build/three.module.js';
import * as GF from './myGeneralFunctions.js';
import MATERIAL_LIB from './myItemsLib/materialLib.js';
import MODELS_LIB_JSON from './myItemsLib/modelsLibJSON.js';

import Stats from './libs/ThreeJsLib/examples/jsm/libs/stats.module.js';


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

import {
  OrbitControls
} from './libs/ThreeJsLib/examples/jsm/controls/OrbitControls.js';

import {
  NodePass
} from './libs/ThreeJsLib/examples/jsm/nodes/postprocessing/NodePass.js';
import * as Nodes from './libs/ThreeJsLib/examples/jsm/nodes/Nodes.js';


let stats = new Stats();
document.body.appendChild(stats.dom);


let SceneParameters = {
  composer: false,
  sceneBackground: 0x000000,
  postprocessing: {
    common: false, //Если добавил хоть один, то true;
    bloomPass: {
      add: false,
      strength: 2,
      radius: 1,
      threshold: 0.27,
    },
    nodepass: {
      add: false,
      hue: 0, //standart 0
      sataturation: 0.8, //standart 1
      vibrance: 0, //standart 0
      brightness: -0.06, //standart 0
      contrast: 2.2, //standart 1
    },
    nodepassFade: {
      add: false,
      color: 0xffffff, //standart 0xffffff
      procent: 0.1, //standart 0.1
    },
    bokehPass: {
      add: false,
      aperture: 0.001, //standart 0.001
      maxblur: 0.01, //standart 0.01
    },
  },
};





const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(20, 1, 20, 400);
camera.position.set(50, 50, 50);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;


let night = true;
//________BLOOM_POSTPROCESSING________









let renderScene = new RenderPass(scene, camera);



// ________/BLOOM_POSTPROCESSING________

let composer, bloomPass, bokehPass;

function createPostprocessing() {
  if (SceneParameters.postprocessing.common) {
    composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
  };


  if (SceneParameters.postprocessing.bloomPass.add && SceneParameters.postprocessing.common) {
    // UnrealBloomPass( resolution, strength, radius, threshold )
    bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      SceneParameters.postprocessing.bloomPass.strength,
      SceneParameters.postprocessing.bloomPass.radius,
      SceneParameters.postprocessing.bloomPass.threshold);
    composer.addPass(bloomPass);
  };





  if (SceneParameters.postprocessing.nodepass.add && SceneParameters.postprocessing.common) {
    const nodepass = new NodePass();

    const screen = new Nodes.ScreenNode();

    const hue = new Nodes.FloatNode(SceneParameters.postprocessing.nodepass.hue || 0);
    const sataturation = new Nodes.FloatNode(SceneParameters.postprocessing.nodepass.sataturation || 1);
    const vibrance = new Nodes.FloatNode(SceneParameters.postprocessing.nodepass.vibrance || 0);
    const brightness = new Nodes.FloatNode(SceneParameters.postprocessing.nodepass.brightness || 0);
    const contrast = new Nodes.FloatNode(SceneParameters.postprocessing.nodepass.contrast || 1);

    const hueNode = new Nodes.ColorAdjustmentNode(screen, hue, Nodes.ColorAdjustmentNode.HUE);
    const satNode = new Nodes.ColorAdjustmentNode(hueNode, sataturation, Nodes.ColorAdjustmentNode.SATURATION);
    const vibranceNode = new Nodes.ColorAdjustmentNode(satNode, vibrance, Nodes.ColorAdjustmentNode.VIBRANCE);
    const brightnessNode = new Nodes.ColorAdjustmentNode(vibranceNode, brightness, Nodes.ColorAdjustmentNode.BRIGHTNESS);
    const contrastNode = new Nodes.ColorAdjustmentNode(brightnessNode, contrast, Nodes.ColorAdjustmentNode.CONTRAST);
    nodepass.input = contrastNode;
    composer.addPass(nodepass);
  };



  let nodepassFade = new NodePass();
  if (SceneParameters.postprocessing.nodepassFade.add && SceneParameters.postprocessing.common) {
    const fade = new Nodes.MathNode(
      new Nodes.ScreenNode(),
      new Nodes.ColorNode(SceneParameters.postprocessing.nodepassFade.color || 0xffffff),
      new Nodes.FloatNode(SceneParameters.postprocessing.nodepassFade.procent || 0.1),
      Nodes.MathNode.MIX
    );
    nodepassFade.input = fade;
    composer.addPass(nodepassFade);
  };




  if (SceneParameters.postprocessing.bokehPass.add && SceneParameters.postprocessing.common) {
    bokehPass = new BokehPass(scene, camera, {
      focus: 0,
      aperture: SceneParameters.postprocessing.bokehPass.aperture || 0.001,
      maxblur: SceneParameters.postprocessing.bokehPass.maxblur || 0.01,

      width: window.innerWidth,
      height: window.innerHeight,
    });
    composer.addPass(bokehPass);
  };

  if (SceneParameters.postprocessing.common) {
    SceneParameters.composer = true;
  };

};

createPostprocessing();








let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

function onMouseMove(event) {

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

};
let focusSettings = {
  focus: 0,
  speed: 1,
  inspected: [],
};

function findMouseObject() {
  focusSettings.inspected = [];
  scene.children.forEach((item) => {
    if (item.type === 'Group') {
      item.children.forEach((item2) => {
        item2.name === 'MouseElement' ? focusSettings.inspected.push(item2) : false;
      });
    };
  });
};








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
          if (item.userData.material) {
            mat = item.userData.material;
          } else {
            mat = item.userData.name.split('_');
          };
          let shadows = {
            cast: true,
            receive: true,
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
            MouseElement: false,
          };
          if (item.userData.name === 'MouseElement') {
            parent.childs[item.name].shadows.cast = false;
            parent.childs[item.name].shadows.receive = false;
            parent.childs[item.name].MouseElement = true;
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

      let material;
      if (obj.MouseElement) {
        material = MATERIAL_LIB.MouseElement;
      } else {
        material = MATERIAL_LIB[mat[0]][mat[1]];
      };
      let mesh = new THREE.Mesh(geometry, material);
      obj.MouseElement ? mesh.name = 'MouseElement' : false;

      if (mat[0] === 'Glass' || mat[0] === 'Liquid' || mat[0] === 'Deep' || mat[0] === 'LightMaterial') {
        shadows.cast = shadows.receive = false;
      }

      mesh.castShadow = shadows.cast;
      mesh.receiveShadow = shadows.cast;

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
scene.fog = new THREE.Fog(0x090a12, 0.1, 150);
let skyLight = new THREE.HemisphereLight(0x394373, 0x616161, 0.2);
let moonLight = new THREE.DirectionalLight(0x94f3f6, 0.15);
let moon = new THREE.Mesh(new THREE.SphereBufferGeometry(2, 10, 10), new THREE.MeshPhongMaterial({
  color: 0x94f3f6,
  emissiveIntensity: 1,
  emissive: new THREE.Color(0x94f3f6),
  fog: false
}));
moon.position.set(30, 15, -30);


moonLight.castShadow = true;
moonLight.position.set(30, 15, -30);
moonLight.target.position.set(0, 0, 0);
moonLight.shadow.camera.zoom = 0.1;

scene.add(moon);
scene.add(moonLight);
scene.add(moonLight.target);
scene.add(skyLight);







setSizes();
document.body.appendChild(renderer.domElement);


window.onresize = function() {
  setSizes();
};
window.addEventListener('mousemove', onMouseMove, false);





function setSizes() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const pixelRatio = window.devicePixelRatio;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(windowWidth, windowHeight);

  camera.aspect = windowWidth / windowHeight;
  camera.updateProjectionMatrix();
  if (SceneParameters.composer) {
    composer.setSize(windowWidth * pixelRatio, windowHeight * pixelRatio);
  };


};



var controls = new OrbitControls(camera, renderer.domElement);
findMouseObject();

function animate() {
  if (SceneParameters.composer) {
    composer.render();
  } else {
    renderer.render(scene, camera);
  };
  // requestAnimationFrame( animate );
  stats.update();



  //______Raycaster For BokehPass postprocessing_______

  if (SceneParameters.composer && SceneParameters.postprocessing.bokehPass.add) {
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(focusSettings.inspected);
    for (var i = 0; i < intersects.length; i++) {
      focusSettings.focus < intersects[0].distance ? focusSettings.focus += focusSettings.speed : focusSettings.focus -= focusSettings.speed;

      bokehPass.uniforms["focus"].value = focusSettings.focus;
    };
  };

  //______//Raycaster For BokehPass postprocessing______



  controls.update();
};
animate();
setInterval(animate, 1000 / 20);
