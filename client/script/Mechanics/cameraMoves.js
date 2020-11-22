import {MOUSE,PLAYER,PLAYER_VIEW,CAMERA} from '../gameEngine_0.1.js';
const PI180 = 0.01745;

document.onmousemove = function(event) {
  MOUSE.position.x = event.clientX;
  MOUSE.position.y = event.clientY;
};
document.addEventListener('touchstart', {
  handleEvent(event) {
    MOUSE.position.x = event.touches[0].clientX;
    MOUSE.position.y = event.touches[0].clientY;
  }
});
document.addEventListener('touchmove', {
  handleEvent(event) {
    MOUSE.position.x = event.touches[0].clientX;
    MOUSE.position.y = event.touches[0].clientY;
  }
});
document.addEventListener('touchend', {
  handleEvent(event) {
    MOUSE.position.x = MOUSE.windowSize.w / 2;
    MOUSE.position.y = MOUSE.windowSize.h / 2;
  }
});
export function setCamera(bool) {
  if (bool != undefined) {
    if (bool) {
      if (PLAYER_VIEW.deg + PLAYER_VIEW.rotationSpeed < 360) {
        PLAYER_VIEW.deg += PLAYER_VIEW.rotationSpeed;
      } else {
        PLAYER_VIEW.deg = 0;
      };
    } else {
      if (PLAYER_VIEW.deg - PLAYER_VIEW.rotationSpeed > 0) {
        PLAYER_VIEW.deg -= PLAYER_VIEW.rotationSpeed;
      } else {
        PLAYER_VIEW.deg = 360 - PLAYER_VIEW.rotationSpeed;
      };
    };
  };


  let cameraShift_X, cameraShift_Z;

  cameraShift_X = PLAYER_VIEW.distance * Math.sin(PLAYER_VIEW.deg * PI180);
  cameraShift_Z = PLAYER_VIEW.distance * Math.cos(PLAYER_VIEW.deg * PI180);




  PLAYER_VIEW.shift.x = cameraShift_X;
  PLAYER_VIEW.shift.z = cameraShift_Z;


  if(PLAYER_VIEW.smoothPoint.y != PLAYER.position.y){
    if(PLAYER_VIEW.smoothPoint.y < PLAYER.position.y){
      if(PLAYER_VIEW.smoothPoint.y + PLAYER_VIEW.smoothPointSpeed.z > PLAYER.position.y){
        PLAYER_VIEW.smoothPoint.y =  PLAYER.position.y;
      }else{
        PLAYER_VIEW.smoothPoint.y += PLAYER_VIEW.smoothPointSpeed.z;
      };
    }else{
      if(PLAYER_VIEW.smoothPoint.y - PLAYER_VIEW.smoothPointSpeed.z < PLAYER.position.y){
        PLAYER_VIEW.smoothPoint.y =  PLAYER.position.y;
      }else{
        PLAYER_VIEW.smoothPoint.y -= PLAYER_VIEW.smoothPointSpeed.z;
      };
    }

  }

  CAMERA.position.x = PLAYER_VIEW.position.x + PLAYER_VIEW.shift.x;
  CAMERA.position.z = PLAYER_VIEW.position.z + PLAYER_VIEW.shift.z;
  CAMERA.position.y = PLAYER_VIEW.position.y + PLAYER_VIEW.distance;
  CAMERA.lookAt(PLAYER.position.x, PLAYER_VIEW.smoothPoint.y, PLAYER.position.z);
};
