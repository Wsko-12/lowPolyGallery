import * as THREE from '../libs/three.module.js';

const Material = {
  BackLight:{

  },

  Concrete:{

  },

  Wood:{

  },

  Glass:{

  },

  Metall:{
    red: new THREE.MashPhongMaterial({color:0xff0000,specular: 0xffffff, shininess:50}), //#ff0000 rgb(255, 0, 0)
    blue: new THREE.MashPhongMaterial({color:0x0000ff,specular: 0xffffff, shininess:120}), //#0000ff rgb(0, 0, 255)
    chrome: new THREE.MashPhongMaterial({color:0xababab,specular: 0x4da3ff, shininess:120}), //#ababab  rgb(171, 171, 171) #4da3ff rgb(77, 163, 255)
    white: new THREE.MashPhongMaterial({color:0xffffff,specular: 0x8c8c8c, shininess:120}), //#ababab  rgb(171, 171, 171) #8c8c8c rgb(140, 140, 140)
  },

  Plastic:{

  },

  Paper:{

  },

  Gum:{

  },

  Ground:{
    beigeSand: new THREE.MashPhongMaterial({color:0xd2b585, shininess:0, flatShading:true,}), //#d2b585 rgb(210, 181, 134)
    orangeSand: new THREE.MashPhongMaterial({color:0xa1361b, shininess:0, flatShading:true,}), //#a1361b rgb(161, 54, 27)
    redSand: new THREE.MashPhongMaterial({color:0x6a0101, shininess:0, flatShading:true,}), //#6a0101 rgb(106, 1, 1)
    dirt: new THREE.MashPhongMaterial({color:0x601d07, shininess:0, flatShading:true,}), //#601d07 rgb(95, 29, 7)
    darkDirt: new THREE.MashPhongMaterial({color:0x2d140b, shininess:0, flatShading:true,}), //#2d140b rgb(45, 20, 11)
    green: new THREE.MashPhongMaterial({color:0x26471a, shininess:0, flatShading:true,}), //#26471a rgb(38, 71, 26)
    freshGreen: new THREE.MashPhongMaterial({color:0x217105, shininess:0, flatShading:true,}), //#217105 rgb(33, 113, 5)
    fallGreen: new THREE.MashPhongMaterial({color:0x6f750f, shininess:0, flatShading:true,}), //#6f750f rgb(111, 117, 15)

  },


  Asphalt:{
    black: new THREE.MashPhongMaterial({color:0x000000, shininess:10,}), //#000000 rgb(0, 0, 0)
    dark: new THREE.MashPhongMaterial({color:0x0a0a0a, shininess:10,}), //#0a0a0a rgb(10, 10, 10)
    gray: new THREE.MashPhongMaterial({color:0x141414, shininess:10,}), //#141414 rgb(20, 20, 20)
    lightGray: new THREE.MashPhongMaterial({color:0x303030, shininess:10,}), //#303030 rgb(48, 48, 48)
  },

  Paint:{
    yellow: new THREE.MashPhongMaterial({color:0xffee00, shininess:50,}), //#ffee00 rgb(255, 238, 0)
    orange: new THREE.MashPhongMaterial({color:0xff7b00, shininess:50,}), //#ff7b00 rgb(255, 123, 0)
  },


};




//hemisphere up:138 216 255, down: 86 124 143
//sun: 255 254 240
