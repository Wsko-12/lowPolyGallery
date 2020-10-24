import * as THREE from '../libs/three.module.js';

//rgb(179, 0, 0) #b0b0b0 #ffd200 #324e57 #6e6e6e
const MATERIAL_LIB = {
  LightMaterial:{
    warmYellow:  new THREE.MeshPhongMaterial({color:0x6e6e6e,emissive: new THREE.Color(0xffd200),emissiveIntensity: 1,transparent:false,opacity:0.7,fog:false}),
    pink:  new THREE.MeshPhongMaterial({color:0x6e6e6e,emissive: new THREE.Color(0xff007a),emissiveIntensity: 1,transparent:false,opacity:0.7,fog:false}),
    white:  new THREE.MeshPhongMaterial({color:0x6e6e6e,emissive: new THREE.Color(0xffffff),emissiveIntensity: 1,transparent:false,opacity:0.7,fog:false}),
  },

  Concrete:{
    red:  new THREE.MeshPhongMaterial({color:0xb30000,specular: 0x0a0a0a, shininess:10}),
    gray:  new THREE.MeshPhongMaterial({color:0x797979,specular: 0x0a0a0a, shininess:10}),
  },

  Wood:{
    white:  new THREE.MeshPhongMaterial({color:0xf0f0f0,specular: 0xb0b0b0, shininess:40}),
    red:  new THREE.MeshPhongMaterial({color:0xad0000,specular: 0x050000, shininess:40}),
    standart:  new THREE.MeshPhongMaterial({color:0xaf9f64,specular: 0x050000, shininess:40}),
    dark:  new THREE.MeshPhongMaterial({color:0x37230b,specular: 0x050000, shininess:40}),
  },

  Glass:{
    standart:  new THREE.MeshPhongMaterial({color:0x324e57,specular: 0xffffff,shininess:150,transparent:true,opacity:0.4}),
  },

  Metall:{
    red:  new THREE.MeshPhongMaterial({color:0xff0000,specular: 0xffffff, shininess:100}), //#ff0000 rgb(255, 0, 0)
    blue:  new THREE.MeshPhongMaterial({color:0x0000ff,specular: 0xffffff, shininess:100}), //#0000ff rgb(0, 0, 255)
    chrome:  new THREE.MeshPhongMaterial({color:0xababab,specular: 0x4da3ff, shininess:100}), //#ababab  rgb(171, 171, 171) #4da3ff rgb(77, 163, 255)
    white:  new THREE.MeshPhongMaterial({color:0xffffff,specular: 0x8c8c8c, shininess:100}), //#ababab  rgb(171, 171, 171) #8c8c8c rgb(140, 140, 140)
    darkGreen: new THREE.MeshPhongMaterial({color:0x133214,specular: 0xffffff, shininess:100}),
    gray: new THREE.MeshPhongMaterial({color:0x6a6a6a,specular: 0xffffff, shininess:100}),
    rusty: new THREE.MeshPhongMaterial({color:0x9f3501,specular: 0xffffff, shininess:100}),
    yellow: new THREE.MeshPhongMaterial({color:0xf2c71d,specular: 0xffffff, shininess:100}),
  },

  Plastic:{
    white: new THREE.MeshPhongMaterial({color:0xdedede,specular: 0xffffff, shininess:90}),
    black: new THREE.MeshPhongMaterial({color:0x0f0f0f,specular: 0xffffff, shininess:90}),
    orange: new THREE.MeshPhongMaterial({color:0xff5a00,specular: 0xffffff, shininess:90}),

  },

  Paper:{
    brown: new THREE.MeshPhongMaterial({color:0x49341f, shininess:5}),
  },

  Gum:{
    black:  new THREE.MeshPhongMaterial({color:0x030303,specular: 0x000000, shininess:10}), //#030303  rgb(3, 3, 3) #000000 rgb(0, 0, 0)
  },

  Ground:{
    beigeSand:  new THREE.MeshPhongMaterial({color:0xd2b585, shininess:0, flatShading:true,}), //#d2b585 rgb(210, 181, 134)
    orangeSand:  new THREE.MeshPhongMaterial({color:0xa1361b, shininess:0, flatShading:true,}), //#a1361b rgb(161, 54, 27)
    redSand:  new THREE.MeshPhongMaterial({color:0x6a0101, shininess:0, flatShading:true,}), //#6a0101 rgb(106, 1, 1)
    dirt:  new THREE.MeshPhongMaterial({color:0x601d07, shininess:0, flatShading:true,}), //#601d07 rgb(95, 29, 7)
    darkDirt:  new THREE.MeshPhongMaterial({color:0x2d140b, shininess:0, flatShading:true,}), //#2d140b rgb(45, 20, 11)
    green:  new THREE.MeshPhongMaterial({color:0x26471a, shininess:0, flatShading:true,}), //#26471a rgb(38, 71, 26)
    freshGreen:  new THREE.MeshPhongMaterial({color:0x217105, shininess:0, flatShading:true,}), //#217105 rgb(33, 113, 5)
    fallGreen:  new THREE.MeshPhongMaterial({color:0x6f750f, shininess:0, flatShading:true,}), //#6f750f rgb(111, 117, 15)

  },
  Rock:{
    gray: new THREE.MeshPhongMaterial({color:0x505050,specular: 0x838383, shininess:5}),
  },

  Asphalt:{
    black:  new THREE.MeshPhongMaterial({color:0x000000, shininess:10,}), //#000000 rgb(0, 0, 0)
    dark:  new THREE.MeshPhongMaterial({color:0x0a0a0a, shininess:10,}), //#0a0a0a rgb(10, 10, 10)
    gray:  new THREE.MeshPhongMaterial({color:0x141414, shininess:10,}), //#141414 rgb(20, 20, 20)
    lightGray:  new THREE.MeshPhongMaterial({color:0x303030, shininess:10,}), //#303030 rgb(48, 48, 48)
  },

  Paint:{
    yellow:  new THREE.MeshPhongMaterial({color:0xffee00, shininess:50,}), //#ffee00 rgb(255, 238, 0)
    orange:  new THREE.MeshPhongMaterial({color:0xff7b00, shininess:50,}), //#ff7b00 rgb(255, 123, 0)
    white:  new THREE.MeshPhongMaterial({color:0xffffff, shininess:50}),
  },

  Liquid:{
    black: new THREE.MeshPhongMaterial({color:0x000000,specular: 0xffffff, shininess:120}),
  },
  Deep:{
    black: new THREE.MeshPhongMaterial({color:0x000000, shininess:0}),
  },
  Plants:{
    darkGreen: new THREE.MeshPhongMaterial({color:0x185d34, shininess:120, side: THREE.DoubleSide}),
  },

};


export default  MATERIAL_LIB

//hemisphere up:138 216 255, down: 86 124 143
//sun: 255 254 240
