import {
  MOUSE,
  PLAYER,
  PLAYER_VIEW,
  CAMERA,
  STATIC_OBJECTS,
  DINAMIC_OBJECTS,
  SCENE,
  vectorMesh,
} from '../gameEngine_0.1.js';
import * as THREE from '../libs/ThreeJsLib/build/three.module.js';
import {
  setCamera
} from './cameraMoves.js';
import * as GEN from '../myGeneralFunctions.js';
const PI180 = 0.01745;

const GRAVITY = {
  speed: 0.3,
}

function MakeVector(from, to) {
  return to.clone().sub(from).normalize();
}

function PushRay(obj) {
  if (obj.rayDistance === undefined) {
    obj.rayDistance = obj.from.distanceTo(obj.to);
  };
  const vector = MakeVector(obj.from, obj.to);
  const ray = new THREE.Raycaster(obj.from, vector, 0, obj.rayDistance);
  const intersect = ray.intersectObjects(obj.check);
  return intersect[0];
};

function MakeMyVector3(obj,xShift,yShift,zShift){
  let x,y,z;
  (!!xShift) ? x = obj.x + xShift:x = obj.x;
  (!!yShift) ? y = obj.y + yShift:y = obj.y;
  (!!zShift) ? z = obj.z + zShift:z = obj.z;
  return new THREE.Vector3(x,y,z);
};






function blockJump(){
  const ray = {
    from:MakeMyVector3(PLAYER.position,0,PLAYER.sizes.h,0),
    to:MakeMyVector3(PLAYER.position,0,(PLAYER.sizes.h+GRAVITY.speed*PLAYER.move.jump.strength),0),
    check: STATIC_OBJECTS,
  };
  if(!!PushRay(ray)){
    PLAYER.move.jump.flagPeak = true;
    PLAYER.move.jump.flagEnd = true;
    return false;
  };
  return true;
};


function checkGravity() {

  if (PLAYER.move.jump.flag) {
    //старт прыжка
    if(blockJump()){
      PLAYER.move.jump.status += PLAYER.move.jump.vector;
      if (PLAYER.move.jump.vector === 1) {
        PLAYER.position.y += GRAVITY.speed;
        PLAYER.move.jump.flagPeak = false;
        PLAYER.move.jump.flagEnd = false;
      };
      //достиг пика
      if (PLAYER.move.jump.status === PLAYER.move.jump.strength) {
        PLAYER.move.jump.vector = -1;
        PLAYER.move.jump.flagPeak = true;
      };

      //финиш прыжка
      if (PLAYER.move.jump.vector === -1 && PLAYER.move.jump.status === 0) {
        PLAYER.move.jump.vector = 1;
        PLAYER.move.jump.flag = false;
        PLAYER.move.jump.flagPeak = true;
        PLAYER.move.jump.flagEnd = true;
      };
    }else{
      PLAYER.move.jump.flag = false;
    }
  };

  const gravityRay = {
    from: MakeMyVector3(PLAYER.position,0,PLAYER.sizes.h / 3,0),
    to: MakeMyVector3(PLAYER.position,0,(PLAYER.sizes.h/-3),0),
    check: STATIC_OBJECTS,
  };
  const gravity = PushRay(gravityRay);
  if (gravity === undefined) { //не находит под ногами ничего
    PLAYER.position.onAir = true;
    if (PLAYER.move.jump.flagPeak) {
      PLAYER.position.y -= GRAVITY.speed;
      if (PLAYER.move.jump.flagEnd) {
        PLAYER.position.block = true;
      };
    };
  } else {
    if (gravity.distance < PLAYER.sizes.h / 3) { //если застрял в объекте который ниже трети тела
      PLAYER.position.onAir = false;
      PLAYER.position.y = gravity.point.y
      PLAYER.position.block = false;
    } else {
      if (PLAYER.move.jump.flagPeak) {
        if (gravity.distance >= PLAYER.sizes.h / 3) { //если что-то есть под ногами
          if (gravity.distance - PLAYER.sizes.h / 3 >= GRAVITY.speed) { //если что-то есть под ногами и объектом расстояние больше гравитации
            PLAYER.position.y -= GRAVITY.speed;
          } else {
            PLAYER.position.y = gravity.point.y;
            PLAYER.position.onAir = false;
            PLAYER.position.block = false;
          };
        };
      };
    };
  };


  // ---Apply---
  const MESH = PLAYER.mesh;
  MESH.position.y = PLAYER.position.y;
  PLAYER.moveVectorPosition.y = PLAYER.position.y + Math.tan(PLAYER.moveVectorPosition.stepAngle * PI180) * (PLAYER.move.speed * PLAYER.moveVectorPosition.step);
  vectorMesh.position.y = PLAYER.moveVectorPosition.y;
  PLAYER_VIEW.position.y = PLAYER.position.y;
  setCamera();
};






// function moveDinamicObject(object, vectors){
//   const widthRay ={
//     start:object.position,
//     end:new THREE.Vector3(object.position.x+vectors.x*10,object.position.y,object.position.z+vectors.z*10),
//   };
//   widthRay.direction = makeVector(widthRay.start,widthRay.end).negate();
//
//   let objectWidth, objectHeight;
//
//
//
//   const widthRayCast =  new THREE.Raycaster(widthRay.end, widthRay.direction, 0, 10);
//   widthRay.intersect = widthRayCast.intersectObject(object);
//   if(!!widthRay.intersect[0]){
//     objectWidth = widthRay.end.distanceTo(widthRay.start) - widthRay.intersect[0].distance;
//   };
//
//   const moveCast = {
//     start:object.position,
//     end:new THREE.Vector3(object.position.x+vectors.x,object.position.y,object.position.z+vectors.z),
//   };
//   moveCast.direction = makeVector(moveCast.start,moveCast.end);
//
//
//
//   const heightRay ={
//     start:object.position,
//     end:new THREE.Vector3(object.position.x,object.position.y-100,object.position.z),
//   };
//   heightRay.direction = makeVector(heightRay.end,heightRay.start);
//
//   const heightRayCast = new THREE.Raycaster(heightRay.end, heightRay.direction,0,100);
//   heightRay.intersect = heightRayCast.intersectObject(object);
//   if(!!heightRay.intersect[0]){
//     objectHeight = heightRay.end.distanceTo(heightRay.start) - heightRay.intersect[0].distance;
//   };
//
//
//   const gravityRay = {
//     start:object.position,
//     direction:new THREE.Vector3(0,-10,0),
//   };
//   const gravityRayCast = new THREE.Raycaster(gravityRay.start,gravityRay.direction,0,10);
//   gravityRay.intersect = gravityRayCast.intersectObjects(DINAMIC_OBJECTS);
//   if(!!gravityRay.intersect[0]){
//     console.log(gravityRay.intersect[0]);
//   };
//
//
//
//
//
//   const moveRayCast =  new THREE.Raycaster(moveCast.start, moveCast.direction, 0, objectWidth);
//   moveCast.intersect = moveRayCast.intersectObjects(STATIC_OBJECTS);
//   if(!!moveCast.intersect[0]){
//     return true;
//   }else{
//     object.position.x += vectors.x;
//     object.position.z += vectors.z;
//     return false;
//   };
// };

test2

function movePlayerViaView(positions, moves, vectors) {
  if (!!moves.forward) {
    vectors.x = Math.sin((180 + PLAYER_VIEW.deg) * PI180) * moves.speed * moves.forward;
    vectors.z = Math.cos((180 + PLAYER_VIEW.deg) * PI180) * moves.speed * moves.forward;
  };
  if (!!moves.sideways) {
    if (!!moves.forward) {
      vectors.x += Math.cos((180 - PLAYER_VIEW.deg) * PI180) * moves.speed * moves.sideways;
      vectors.z += Math.sin((180 - PLAYER_VIEW.deg) * PI180) * moves.speed * moves.sideways;
    } else {
      vectors.x = Math.cos((180 - PLAYER_VIEW.deg) * PI180) * moves.speed * moves.sideways;
      vectors.z = Math.sin((180 - PLAYER_VIEW.deg) * PI180) * moves.speed * moves.sideways;
    }
  };
  PLAYER.moveVectorPosition.x = positions.x + vectors.x * PLAYER.moveVectorPosition.step;
  PLAYER.moveVectorPosition.z = positions.z + vectors.z * PLAYER.moveVectorPosition.step;
};

function rotatePlayerByMove(positions, moves, vectors) {
  const x = Math.round((PLAYER.moveVectorPosition.x - positions.x) * 10000); //10000 тк очень маленькие числа
  const z = Math.round((PLAYER.moveVectorPosition.z - positions.z) * 10000);

  //positions.deg - угол персонажа(куда смотрит);

  if (x > 0 && z < 0) { //  ↗
    positions.deg = GEN.TanToAngle(Math.abs(z / x)) + 270;
  };
  if (x > 0 && z > 0) { // ↘
    positions.deg = GEN.TanToAngle(Math.abs(x / z)) + 180;
  };
  if (x < 0 && z > 0) { // ↙
    positions.deg = GEN.TanToAngle(Math.abs(z / x)) + 90;
  };
  if (x < 0 && z < 0) { // ↖
    positions.deg = GEN.TanToAngle(Math.abs(x / z));
  };
  if (x == 0 && z > 0) { // ↓
    positions.deg = 180;
  };
  if (x < 0 && z == 0) { // ←
    positions.deg = 90;
  };
  if (x > 0 && z == 0) { // →
    positions.deg = 270;
  };
  if (x == 0 & z < 0) { //  ↑
    positions.deg = 0;
  };
  positions.deg === 360 ? positions.deg = 0 : false;

  //поворот персонажа на вектор направления;
  let delta_r, delta_l;

  //по часовой или против
  if (positions.deg > vectors.deg) {
    delta_l = Math.abs(positions.deg - vectors.deg);
    delta_r = 360 - Math.abs(positions.deg - vectors.deg)
  }
  if (vectors.deg > positions.deg) {
    delta_l = 360 - Math.abs(positions.deg - vectors.deg)
    delta_r = Math.abs(positions.deg - vectors.deg);
  }

  //постепенный поворот
  if (vectors.deg != positions.deg) {
    if (delta_l < delta_r) {
      if (delta_l < moves.rotationSpeed) {
        vectors.deg = positions.deg
      } else {
        vectors.deg += moves.rotationSpeed;
      };
      if (vectors.deg >= 360) {
        vectors.deg = 0 + moves.rotationSpeed;
      };
    } else {
      if (delta_r < moves.rotationSpeed) {
        vectors.deg = positions.deg;
      } else {
        vectors.deg -= moves.rotationSpeed;
      }
      if (vectors.deg < 0) {
        vectors.deg = 360 - moves.rotationSpeed;
      };
    };
  };
};

export function updatePlayerPosition() {
  if (PLAYER.move.sideways || PLAYER.move.forward) {
    const positions = PLAYER.position;
    const moves = PLAYER.move;
    const vectors = PLAYER.vectors;

    // ----Move----
    movePlayerViaView(positions, moves, vectors);

    // ----Rotation----
    rotatePlayerByMove(positions, moves, vectors);





    // const moveRayVectorsHead = {
    //   start:new THREE.Vector3(positions.x,positions.y+PLAYER.sizes.h,positions.z),
    //   end:new THREE.Vector3(PLAYER.moveVectorPosition.x,positions.y+PLAYER.sizes.h,PLAYER.moveVectorPosition.z),
    //   intersect:[],
    // }
    // moveRayVectorsHead.direction = moveRayVectorsHead.end.clone().sub(moveRayVectorsHead.start).normalize();
    // const moveRayHead =  new THREE.Raycaster(moveRayVectorsHead.start, moveRayVectorsHead.direction, 0, PLAYER.move.speed*PLAYER.moveVectorPosition.step);
    // moveRayVectorsHead.intersect = moveRayHead.intersectObjects(STATIC_OBJECTS);
    // if(!!moveRayVectorsHead.intersect[0]){
    //   moveBlockFlag = true;
    // };
    //
    //
    //
    //
    // const moveRayVectors = {
    //   start:new THREE.Vector3(positions.x,positions.y,positions.z),
    //   end:new THREE.Vector3(PLAYER.moveVectorPosition.x,PLAYER.moveVectorPosition.y,PLAYER.moveVectorPosition.z),
    //   intersect:[],
    // }
    // moveRayVectors.direction = moveRayVectors.end.clone().sub(moveRayVectors.start).normalize();
    //
    // const moveRay =  new THREE.Raycaster(moveRayVectors.start, moveRayVectors.direction, 0, PLAYER.move.speed*PLAYER.moveVectorPosition.step);
    // moveRayVectors.intersect = moveRay.intersectObjects(STATIC_OBJECTS);
    // if(!!moveRayVectors.intersect[0]){
    //
    //   const moveRayMiddleVectors = {
    //     start:new THREE.Vector3(positions.x,positions.y+PLAYER.move.jump.autoJumpHeight,positions.z),
    //     end:new THREE.Vector3(PLAYER.moveVectorPosition.x,PLAYER.moveVectorPosition.y,PLAYER.moveVectorPosition.z),
    //     intersect:[],
    //   }
    //   moveRayMiddleVectors.direction = moveRayMiddleVectors.end.clone().sub(moveRayMiddleVectors.start).normalize();
    //
    //   const moveMiddleRay =  new THREE.Raycaster(moveRayMiddleVectors.start, moveRayMiddleVectors.direction, 0, PLAYER.move.speed*PLAYER.moveVectorPosition.step);
    //   moveRayMiddleVectors.intersect = moveMiddleRay.intersectObjects(STATIC_OBJECTS);
    //   if(!!moveRayMiddleVectors.intersect[0]){
    //     moveBlockFlag = true;
    //   }else{
    //     autoJump();
    //   };
    // };
    //
    //
    // let dinamicObjects = [];
    // const dinamicObjectsRay = new THREE.Raycaster(moveRayVectors.start, moveRayVectors.direction, 0, PLAYER.move.speed*PLAYER.moveVectorPosition.step);
    // dinamicObjects = dinamicObjectsRay.intersectObjects(DINAMIC_OBJECTS);
    // if(!!dinamicObjects[0]){
    //   moveBlockFlag = moveDinamicObject(dinamicObjects[0].object,vectors);
    // };
    //
    //
    //
    //
    //
    //



    //----Apply----
    const MESH = PLAYER.mesh;

    MESH.rotation.y = vectors.deg * PI180;
    if (vectors.deg === positions.deg) { //двигается только когда повернется
      if (!positions.block) {
        if (!!moves.forward || !!moves.sideways) {
          positions.x += vectors.x;
          positions.z += vectors.z;
          MESH.position.x = positions.x;
          MESH.position.z = positions.z;
          PLAYER_VIEW.position.x = positions.x;
          PLAYER_VIEW.position.z = positions.z;
        };
      };
    };
    vectorMesh.position.x = PLAYER.moveVectorPosition.x;
    vectorMesh.position.z = PLAYER.moveVectorPosition.z;
  };
  checkGravity();
};
