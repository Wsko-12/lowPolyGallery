import * as THREE from '../libs/ThreeJsLib/build/three.module.js';
import MATERIAL_LIB from './materialLib.js';


export function JsonToObject(json) { //for database save, without material obj, onli material info
  json = JSON.parse(json);
  let parsed = {
    type: 'model',
    name: json.object.name,
    childs: {},
    position: [0, 0, 0],
    lighting: [],
  };

  function Сonverter(parent, arr, geomArr) {
    arr.forEach((item) => {
      switch (item.type) {
        case 'Group':
          parent.childs[item.name] = {
            type: 'group',
            childs: {},
          };
          Сonverter(parent.childs[item.name], item.children, geomArr);
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
  Сonverter(parsed, json.object.children, json.geometries, );
  return parsed;
};

export function ObjectToModel(obj, parent, parsedModel) {
  switch (obj.type) {
    case 'model':
      let model = new THREE.Group(); // Раньше было Object3D
      if (obj.lighting[0] != undefined) {
        obj.lighting.forEach((light) => {
          LightTo3DObject(light, model, obj);
          // model.attach(MyLightParser(light,model,obj)); //аттачит уже в функции
        });
      };
      for (let child in obj.childs) {
        ObjectToModel(obj.childs[child], model, model);
      };
      model.position.set(obj.position[0], obj.position[1], obj.position[2]);
      return model;
      break;
    case 'group':
      let group = new THREE.Group(); // Раньше было Object3D
      for (let child in obj.childs) {
        ObjectToModel(obj.childs[child], group, model);
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

      if (mat[0] === 'Glass' || mat[0] === 'Liquid' || mat[0] === 'Deep' || mat[0] === 'LightMaterial' || mat[0] === 'LightTrail') {
        shadows.cast = shadows.receive = false;
      };

      mesh.castShadow = shadows.cast;
      mesh.receiveShadow = shadows.cast;

      parent.attach(mesh);
      break;
    default:
  };
};


export function LightTo3DObject(lightSettings, model, modelSettings) {
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
