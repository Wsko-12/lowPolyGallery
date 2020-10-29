const SCENES_ARR = [
  'LonelyTrailer',
  'LoneStarMotel',
];


let Current_Scene_Index = 0;
let Current_Scene = SCENES_ARR[Current_Scene_Index];

function UI_ChangeScene(arg) {
  if (arg) {
    if (Current_Scene_Index != SCENES_ARR.length - 1) {
      Current_Scene_Index++;
    };
    Current_Scene = SCENES_ARR[Current_Scene_Index];

  } else {
    if (Current_Scene_Index > 0) {
      Current_Scene_Index--;
    };
    Current_Scene = SCENES_ARR[Current_Scene_Index];
  };
  document.querySelector('#arcticleMenuLine').style.transform = `translateX(-${150*Current_Scene_Index}px)`
};


window.onload = function() {
  document.querySelector('#arcticleMenuLine').style.width = 100 * SCENES_ARR.length + '%';
  document.querySelector('#arcticleMenuLine').style.transitionDuration = '1s';
};
