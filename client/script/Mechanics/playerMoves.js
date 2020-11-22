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
function autoJump(){
  PLAYER.move.jump.flag = true;
  PLAYER.move.jump.flagPeak = false;
  PLAYER.move.jump.end = false;
}
function checkGravity() {
  const fall = {
    start: new THREE.Vector3(PLAYER.position.x, PLAYER.position.y, PLAYER.position.z),
    end: new THREE.Vector3(0, -1, 0),
    intersect: [],
  }
  const blockJump = {
    start: new THREE.Vector3(PLAYER.position.x, (PLAYER.position.y+PLAYER.sizes.h), PLAYER.position.z),
    end: new THREE.Vector3(0, 1, 0),
    intersect: [],
  };



  if (PLAYER.move.jump.flag) {
    let blockJumpFlag = false;
    if(PLAYER.move.jump.state === 0){
      const blockJumpRay =  new THREE.Raycaster(blockJump.start, blockJump.end, 0, (PLAYER.move.jump.strength*GRAVITY.speed));
      blockJump.intersect = blockJumpRay.intersectObjects(STATIC_OBJECTS);
      if(!!blockJump.intersect[0]){
        blockJumpFlag = true;
      };
    };
    if(blockJumpFlag){
      PLAYER.move.jump.vector = 1;
      PLAYER.move.jump.flag = false;
      PLAYER.move.jump.end = true;
      PLAYER.move.jump.flagPeak = false;
    }else{
      PLAYER.position.y += GRAVITY.speed;
      PLAYER.move.jump.state += PLAYER.move.jump.vector;
      if(PLAYER.move.jump.state === PLAYER.move.jump.strength){
        PLAYER.move.jump.vector = -1;
        PLAYER.move.jump.flagPeak = true;
      };
      if(PLAYER.move.jump.state === 0){
        PLAYER.move.jump.vector = 1;
        PLAYER.move.jump.flag = false;
        PLAYER.move.jump.end = true;
        PLAYER.move.jump.flagPeak = false;
      };
    }

  };

  const OBJECTS = [STATIC_OBJECTS,DINAMIC_OBJECTS];
  const fallRay = new THREE.Raycaster(fall.start, fall.end, 0, 5);
  fall.intersect = fallRay.intersectObjects(STATIC_OBJECTS);

  if (fall.intersect[0] === undefined) {
    if (!PLAYER.move.jump.flagPeak) {
      PLAYER.position.y -= GRAVITY.speed;
    }
    if (PLAYER.move.jump.end) {
      PLAYER.move.jump.onAir = true;
    };
  } else {
      if (PLAYER.position.y - fall.intersect[0].point.y > GRAVITY.speed) {
        if (!PLAYER.move.jump.flagPeak) {
          PLAYER.position.y -= GRAVITY.speed;
        }
        if (PLAYER.move.jump.end) {
          PLAYER.move.jump.onAir = true;
        };
      } else {
        if (!PLAYER.move.jump.flagPeak) {
          PLAYER.position.y = fall.intersect[0].point.y;
        };

        if (PLAYER.move.jump.end) {
          PLAYER.move.jump.onAir = false;
        };
      };
  };

  const up = {
    start: new THREE.Vector3(PLAYER.position.x, PLAYER.position.y + 1, PLAYER.position.z),
    end: new THREE.Vector3(PLAYER.position.x, PLAYER.position.y, PLAYER.position.z),
    intersect: [],
  };
  up.direction = up.end.clone().sub(up.start).normalize();

  const upRay =  new THREE.Raycaster(up.start, up.direction, 0, 5);
  up.intersect = upRay.intersectObjects(STATIC_OBJECTS);
  if(!!up.intersect[0]){
    if(up.intersect[0].distance<0.95){
      PLAYER.position.y = up.intersect[0].point.y+0.00000001;
    };
  };


  //---Apply---
  const MESH = PLAYER.mesh;
  MESH.position.y = PLAYER.position.y;
  PLAYER.moveVectorPosition.y = PLAYER.position.y + Math.tan(PLAYER.moveVectorPosition.stepAngle * PI180) * (PLAYER.move.speed * PLAYER.moveVectorPosition.step);
  vectorMesh.position.y = PLAYER.moveVectorPosition.y;

  if (PLAYER.move.jump.end) {
    PLAYER_VIEW.position.y = PLAYER.position.y;

  };
  setCamera();
};


function makeVector(from,to){
  return to.clone().sub(from).normalize();
}



function moveDinamicObject(object, vectors){
  const widthRay ={
    start:object.position,
    end:new THREE.Vector3(object.position.x+vectors.x*10,object.position.y,object.position.z+vectors.z*10),
  };
  widthRay.direction = makeVector(widthRay.start,widthRay.end).negate();

  let objectWidth, objectHeight;



  const widthRayCast =  new THREE.Raycaster(widthRay.end, widthRay.direction, 0, 10);
  widthRay.intersect = widthRayCast.intersectObject(object);
  if(!!widthRay.intersect[0]){
    objectWidth = widthRay.end.distanceTo(widthRay.start) - widthRay.intersect[0].distance;
  };

  const moveCast = {
    start:object.position,
    end:new THREE.Vector3(object.position.x+vectors.x,object.position.y,object.position.z+vectors.z),
  };
  moveCast.direction = makeVector(moveCast.start,moveCast.end);



  const heightRay ={
    start:object.position,
    end:new THREE.Vector3(object.position.x,object.position.y-100,object.position.z),
  };
  heightRay.direction = makeVector(heightRay.end,heightRay.start);

  const heightRayCast = new THREE.Raycaster(heightRay.end, heightRay.direction,0,100);
  heightRay.intersect = heightRayCast.intersectObject(object);
  if(!!heightRay.intersect[0]){
    objectHeight = heightRay.end.distanceTo(heightRay.start) - heightRay.intersect[0].distance;
  };


  const gravityRay = {
    start:object.position,
    direction:new THREE.Vector3(0,-10,0),
  };
  const gravityRayCast = new THREE.Raycaster(gravityRay.start,gravityRay.direction,0,10);
  gravityRay.intersect = gravityRayCast.intersectObjects(DINAMIC_OBJECTS);
  if(!!gravityRay.intersect[0]){
    console.log(gravityRay.intersect[0]);
  };





  const moveRayCast =  new THREE.Raycaster(moveCast.start, moveCast.direction, 0, objectWidth);
  moveCast.intersect = moveRayCast.intersectObjects(STATIC_OBJECTS);
  if(!!moveCast.intersect[0]){
    return true;
  }else{
    object.position.x += vectors.x;
    object.position.z += vectors.z;
    return false;
  };







};


export function updatePlayerPosition() {
  if (!PLAYER.move.jump.onAir) {
    if (PLAYER.move.sideways || PLAYER.move.forward) {
      const positions = PLAYER.position;
      const moves = PLAYER.move;
      const vectors = PLAYER.vectors;

      // ----Move----
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


      // ----Rotation----
      let alpha = vectors.deg;
      const x = Math.round((PLAYER.moveVectorPosition.x - positions.x) * 10000); //10000 тк очень маленькие числа
      const z = Math.round((PLAYER.moveVectorPosition.z - positions.z) * 10000);

      //alpha - угол, вектора персонажа(куда смотрит);


      if (x > 0 && z < 0) { //  ↗
        alpha = GEN.TanToAngle(Math.abs(z / x)) + 270;
      };
      if (x > 0 && z > 0) { // ↘
        alpha = GEN.TanToAngle(Math.abs(x / z)) + 180;
      };
      if (x < 0 && z > 0) { // ↙
        alpha = GEN.TanToAngle(Math.abs(z / x)) + 90;
      };
      if (x < 0 && z < 0) { // ↖
        alpha = GEN.TanToAngle(Math.abs(x / z));
      };
      if (x == 0 && z > 0) { // ↓
        alpha = 180;
      };
      if (x < 0 && z == 0) { // ←
        alpha = 90;
      };
      if (x > 0 && z == 0) { // →
        alpha = 270;
      };
      if (x == 0 & z < 0) { //  ↑
        alpha = 0;
      };
      alpha === 360 ? alpha = 0 : false;

      //поворот персонажа на вектор направления;
      let delta_r, delta_l;

      //по часовой или против
      if (alpha > vectors.deg) {
        delta_l = Math.abs(alpha - vectors.deg);
        delta_r = 360 - Math.abs(alpha - vectors.deg)
      }
      if (vectors.deg > alpha) {
        delta_l = 360 - Math.abs(alpha - vectors.deg)
        delta_r = Math.abs(alpha - vectors.deg);
      }

      //постепенный поворот
      if (vectors.deg != alpha) {
        if (delta_l < delta_r) {
          if (delta_l < moves.rotationSpeed) {
            vectors.deg = alpha
          } else {
            vectors.deg += moves.rotationSpeed;
          };
          if (vectors.deg >= 360) {
            vectors.deg = 0 + moves.rotationSpeed;
          };
        } else {
          if (delta_r < moves.rotationSpeed) {
            vectors.deg = alpha;
          } else {
            vectors.deg -= moves.rotationSpeed;
          }
          if (vectors.deg < 0) {
            vectors.deg = 360 - moves.rotationSpeed;
          };
        };
      };





      let moveBlockFlag = false;
      const moveRayVectorsHead = {
        start:new THREE.Vector3(positions.x,positions.y+PLAYER.sizes.h,positions.z),
        end:new THREE.Vector3(PLAYER.moveVectorPosition.x,positions.y+PLAYER.sizes.h,PLAYER.moveVectorPosition.z),
        intersect:[],
      }
      moveRayVectorsHead.direction = moveRayVectorsHead.end.clone().sub(moveRayVectorsHead.start).normalize();
      const moveRayHead =  new THREE.Raycaster(moveRayVectorsHead.start, moveRayVectorsHead.direction, 0, PLAYER.move.speed*PLAYER.moveVectorPosition.step);
      moveRayVectorsHead.intersect = moveRayHead.intersectObjects(STATIC_OBJECTS);
      if(!!moveRayVectorsHead.intersect[0]){
        moveBlockFlag = true;
      };




      const moveRayVectors = {
        start:new THREE.Vector3(positions.x,positions.y,positions.z),
        end:new THREE.Vector3(PLAYER.moveVectorPosition.x,PLAYER.moveVectorPosition.y,PLAYER.moveVectorPosition.z),
        intersect:[],
      }
      moveRayVectors.direction = moveRayVectors.end.clone().sub(moveRayVectors.start).normalize();

      const moveRay =  new THREE.Raycaster(moveRayVectors.start, moveRayVectors.direction, 0, PLAYER.move.speed*PLAYER.moveVectorPosition.step);
      moveRayVectors.intersect = moveRay.intersectObjects(STATIC_OBJECTS);
      if(!!moveRayVectors.intersect[0]){

        const moveRayMiddleVectors = {
          start:new THREE.Vector3(positions.x,positions.y+PLAYER.move.jump.autoJumpHeight,positions.z),
          end:new THREE.Vector3(PLAYER.moveVectorPosition.x,PLAYER.moveVectorPosition.y,PLAYER.moveVectorPosition.z),
          intersect:[],
        }
        moveRayMiddleVectors.direction = moveRayMiddleVectors.end.clone().sub(moveRayMiddleVectors.start).normalize();

        const moveMiddleRay =  new THREE.Raycaster(moveRayMiddleVectors.start, moveRayMiddleVectors.direction, 0, PLAYER.move.speed*PLAYER.moveVectorPosition.step);
        moveRayMiddleVectors.intersect = moveMiddleRay.intersectObjects(STATIC_OBJECTS);
        if(!!moveRayMiddleVectors.intersect[0]){
          moveBlockFlag = true;
        }else{
          autoJump();
        };
      };


      let dinamicObjects = [];
      const dinamicObjectsRay = new THREE.Raycaster(moveRayVectors.start, moveRayVectors.direction, 0, PLAYER.move.speed*PLAYER.moveVectorPosition.step);
      dinamicObjects = dinamicObjectsRay.intersectObjects(DINAMIC_OBJECTS);
      if(!!dinamicObjects[0]){
        moveBlockFlag = moveDinamicObject(dinamicObjects[0].object,vectors);
      };









      //----Apply----
      const MESH = PLAYER.mesh;

      MESH.rotation.y = vectors.deg * PI180;

      if (vectors.deg == alpha) {
        if(!moveBlockFlag){
          if (!!moves.forward || !!moves.sideways) {







            positions.x += vectors.x;
            positions.z += vectors.z;
            MESH.position.x = positions.x;
            MESH.position.z = positions.z;
            PLAYER_VIEW.position.x = positions.x;
            PLAYER_VIEW.position.z = positions.z;
          };
        }

      };
      if(!moveBlockFlag){
        vectorMesh.position.x = PLAYER.moveVectorPosition.x;
        vectorMesh.position.z = PLAYER.moveVectorPosition.z;
      };
    };
  };
  checkGravity();
};
