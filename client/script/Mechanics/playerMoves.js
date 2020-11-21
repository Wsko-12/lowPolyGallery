import {MOUSE,PLAYER,PLAYER_VIEW,CAMERA,vectorMesh} from '../gameEngine_0.1.js';
import {rotateCamera} from './cameraMoves.js';
import * as GEN from '../myGeneralFunctions.js';
const PI180 = 0.01745;



export function updatePlayerPosition() {
  if (PLAYER.move.sideways || PLAYER.move.forward) {

    let positions = PLAYER.position;
    let moves = PLAYER.move;
    let vectors = PLAYER.vectors;

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
    PLAYER.moveVectorPosition.y = positions.y + Math.tan(PLAYER.moveVectorPosition.stepAngle * PI180) * (moves.speed * PLAYER.moveVectorPosition.step);



    // ----Rotation----

    let alpha = vectors.deg;
    let x = Math.round((PLAYER.moveVectorPosition.x - positions.x) * 10000); //10000 тк очень маленькие числа
    let z = Math.round((PLAYER.moveVectorPosition.z - positions.z) * 10000);

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

    //console.log(alpha, x, z);
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

    // ----//Rotation----

    //----Apply----
    let MESH = PLAYER.mesh;

    MESH.rotation.y = vectors.deg * PI180;
    if (vectors.deg == alpha) {
      if (!!moves.forward || !!moves.sideways) {
        positions.x += vectors.x;
        positions.z += vectors.z;
        MESH.position.x = positions.x;
        MESH.position.z = positions.z;
        PLAYER_VIEW.position.x = positions.x;
        PLAYER_VIEW.position.z = positions.z;
        rotateCamera();
      };
    };

    vectorMesh.position.x = PLAYER.moveVectorPosition.x;
    vectorMesh.position.z = PLAYER.moveVectorPosition.z;
    vectorMesh.position.y = PLAYER.moveVectorPosition.y;

  };
};
