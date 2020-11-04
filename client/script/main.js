import * as THREE from './libs/ThreeJsLib/build/three.module.js';
import * as GF from './myGeneralFunctions.js';
import MATERIAL_LIB from './myItemsLib/materialLib.js';
import MODELS_LIB_JSON from './myItemsLib/modelsLibJSON.js';
import SCENES from './myItemsLib/scenesLib.js';
import * as MY_PARSER from './myItemsLib/MyParser.js';

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


// let stats = new Stats();
// document.body.appendChild(stats.dom);

let SceneParameters = {
  composer: false,
};


let focusSettings = {
  focus: 0,
  neededFocus: 0,
  speed: 1,
  inspected: [],
};


let Current_Scene_Render = '';


let scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(20, 1, 0.2, 100);
camera.position.set(50, 50, 50);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;









let renderScene;

let composer, bloomPass, bokehPass;





const SCENE_BUILDER = {
  build(sceneName) {
    Current_Scene_Render = Current_Scene; //Current_Scene лежит в скрипте (не модульном) uxScript
    SceneParameters = SCENES[sceneName].sceneParameters;
    scene = new THREE.Scene();

    let sceneSet = SceneParameters.scene;
    scene.background = new THREE.Color(sceneSet.background);

    if (SceneParameters.scene.fog.add) {
      switch (SceneParameters.scene.fog.type) {
        case 'fog':
          scene.fog = new THREE.Fog(sceneSet.fog.color, sceneSet.fog.near, sceneSet.fog.far);
          break;
        case 'FogExp2':
          scene.fog = new THREE.FogExp2(sceneSet.fog.color, sceneSet.fog.density);
          break;
      };
    };


    let skyLight = new THREE.HemisphereLight(sceneSet.skyLight[0], sceneSet.skyLight[1], sceneSet.skyLight[2]);
    let skyObjLight = new THREE.DirectionalLight(sceneSet.skyObj.light[0], sceneSet.skyObj.light[1]);

    let skyObj = new THREE.Mesh(new THREE.SphereBufferGeometry(2, 10, 10), new THREE.MeshPhongMaterial({
      color: sceneSet.skyObj.light[0],
      emissiveIntensity: 1,
      emissive: new THREE.Color(sceneSet.skyObj.light[0]),
      fog: false
    }));
    skyObj.position.set(sceneSet.skyObj.position[0], sceneSet.skyObj.position[1], sceneSet.skyObj.position[2]);


    skyObjLight.castShadow = true;
    skyObjLight.position.set(sceneSet.skyObj.position[0], sceneSet.skyObj.position[1], sceneSet.skyObj.position[2]);
    skyObjLight.target.position.set(0, 0, 0);
    skyObjLight.shadow.camera.zoom = 0.1;

    scene.add(skyLight);

    scene.add(skyObj);
    scene.add(skyObjLight);
    scene.add(skyObjLight.target);

    let loadModel = MY_PARSER.ObjectToModel(MY_PARSER.JsonToObject(SCENES[sceneName].model));
    scene.add(loadModel);
    findMouseObject();


    camera.position.set(SceneParameters.camera.position[0], SceneParameters.camera.position[1], SceneParameters.camera.position[2])
    if (SceneParameters.postprocessing.common) {
      this.postprocessing();
    };
  },
  postprocessing() {
    renderScene = new RenderPass(scene, camera);
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
  },
};






let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;



  if (SceneParameters.composer && SceneParameters.postprocessing.bokehPass.add) {
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(focusSettings.inspected);
    for (var i = 0; i < intersects.length; i++) {
      focusSettings.neededFocus = intersects[0].distance;
    };
  };
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









setSizes();
document.querySelector('#canvasSection').appendChild(renderer.domElement);


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


function animate() {
  if (Current_Scene_Render != Current_Scene) {
    SCENE_BUILDER.build(Current_Scene);
  };


  if (SceneParameters.composer) {
    composer.render();
  } else {
    renderer.render(scene, camera);
  };

  // requestAnimationFrame( animate );
  // stats.update();



  //______Raycaster For BokehPass postprocessing_______
  if (SceneParameters.composer && SceneParameters.postprocessing.bokehPass.add) {
    focusSettings.focus < focusSettings.neededFocus ? focusSettings.focus += focusSettings.speed : focusSettings.focus -= focusSettings.speed;
    bokehPass.uniforms["focus"].value = focusSettings.focus;
  };

  //______//Raycaster For BokehPass postprocessing______



  controls.update();
};
animate();
setInterval(animate, 1000 / 20);
