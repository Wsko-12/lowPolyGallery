import {
  MOUSE,
  PLAYER,
  PLAYER_VIEW,
  CAMERA,
  STATIC_OBJECTS,
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


function checkGravity() {
  const fall = {
    start: new THREE.Vector3(PLAYER.position.x, PLAYER.position.y, PLAYER.position.z),
    end: new THREE.Vector3(0, -1, 0),
    intersect: [],
  }
  const autoJump = {
    start: new THREE.Vector3(PLAYER.position.x, PLAYER.position.y + 0.9, PLAYER.position.z),
    end: new THREE.Vector3(0, -1, 0),
    intersect: [],
  };












  if (PLAYER.move.jump.flag) {
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
  };
  const autoJumpRay =  new THREE.Raycaster(autoJump.start, autoJump.end, 0, 0.85);
  autoJump.intersect = autoJumpRay.intersectObjects(STATIC_OBJECTS);
  if(!!autoJump.intersect[0]){
    PLAYER.position.y += autoJump.intersect[0].distance;
  }

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
    if (fall.intersect[0].distance > GRAVITY.speed) {
      if (!PLAYER.move.jump.flagPeak) {
        PLAYER.position.y -= GRAVITY.speed;
      }
      if (PLAYER.move.jump.end) {
        PLAYER.move.jump.onAir = true;
      };
    } else {
      if (!PLAYER.move.jump.flagPeak) {
        PLAYER.position.y -= fall.intersect[0].distance;
      };

      if (PLAYER.move.jump.end) {
        PLAYER.move.jump.onAir = false;
      };
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







      //----Apply----
      const MESH = PLAYER.mesh;

      MESH.rotation.y = vectors.deg * PI180;
      if (vectors.deg == alpha) {
        if (!!moves.forward || !!moves.sideways) {
          positions.x += vectors.x;
          positions.z += vectors.z;
          MESH.position.x = positions.x;
          MESH.position.z = positions.z;
          PLAYER_VIEW.position.x = positions.x;
          PLAYER_VIEW.position.z = positions.z;
        };
      };

      vectorMesh.position.x = PLAYER.moveVectorPosition.x;
      vectorMesh.position.z = PLAYER.moveVectorPosition.z;
    };
  };
  checkGravity();
};
