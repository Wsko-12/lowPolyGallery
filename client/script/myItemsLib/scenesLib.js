import MODELS_LIB_JSON from './modelsLibJSON.js';


//  ___________sceneParameters Default____________
//   composer: false,
//   postprocessing: {
//     common: false, //Если добавил хоть один, то true;
//     bloomPass: {
//       add: false,
//       strength: 2,
//       radius: 1,
//       threshold: 0.27,
//     },
//     nodepass: {
//       add: false,
//       hue: 0, //standart 0
//       sataturation: 1, //standart 1
//       vibrance: 0, //standart 0
//       brightness: 0, //standart 0
//       contrast: 1, //standart 1
//     },
//     nodepassFade: {
//       add: false,
//       color: 0xffffff, //standart 0xffffff
//       procent: 0.1, //standart 0.1
//     },
//     bokehPass: {
//       add: false,
//       aperture: 0.001, //standart 0.001
//       maxblur: 0.01, //standart 0.01
//     },
//   },
//   camera: {
//     position: [50, 50, 50],
//     scene: {
//       background: 0xffffff,
//       skyLight: [0xffffff, 0xffffff, 1],
//       skyObj: {
//         light:[0xffffff, 1],
//         position:[30, 30, -30],
//       },
//       fog: {
//         type: 'fog',
//         color: 0x090a12,
//         near: 0.1,
//         far: 150,
//      _______OR________
//         type: 'FogExp2',
//         color: 0xffffff,
//         density: 0.01,
//
//       },
//
//     },
//   },
// };






const SCENES = {
  LoneStarMotel: {
    sceneParameters: {
      composer: false,
      postprocessing: {
        common: true, //Если добавил хоть один, то true;
        bloomPass: {
          add: true,
          strength: 2,
          radius: 1,
          threshold: 0.27,
        },
        nodepass: {
          add: true,
          hue: 0, //standart 0
          sataturation: 0.8, //standart 1
          vibrance: 0, //standart 0
          brightness: -0.06, //standart 0
          contrast: 2.2, //standart 1
        },
        nodepassFade: {
          add: true,
          color: 0x94bfda, //standart 0xffffff
          procent: 0.1, //standart 0.1
        },
        bokehPass: {
          add: false,
          aperture: 0.001, //standart 0.001
          maxblur: 0.01, //standart 0.01
        },
      },
      camera: {
        position: [-50, 50, 50],
      },
      scene: {
        background: 0x090a12,
        skyLight: [0x394373, 0x616161, 0.2],
        skyObj: {
          light: [0x94f3f6, 0.15],
          position: [30, 15, -30],
        },
        fog: {
          add:false,
          type: 'fog',
          color: 0x090a12,
          near: 0.1,
          far: 150,
        },
      },
    },
    model: MODELS_LIB_JSON.LoneStarMotel,
  },
};


export default SCENES;
