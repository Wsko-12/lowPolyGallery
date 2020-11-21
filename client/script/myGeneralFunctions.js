
export function round(num, numeral) {
  let exp = Math.pow(10, numeral);
  return Math.round(num * exp) / exp;
};

export function generateId(type,x){
    let letters = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnPpQqRrSsTtUuVvWwXxYyZz';

    let numbers = '0123456789';
    let lettersMix,numbersMix;
    for(let i=0; i<100;i++){
      lettersMix += letters;
      numbersMix += numbers;
    }

    let mainArr = lettersMix.split('').concat(numbersMix.split(''));
    let shuffledArr = mainArr.sort(function(){
                        return Math.random() - 0.5;
                    });
    let id = type +'_';
    for(let i=0; i<=x;i++){
        id += shuffledArr[i];

    };
    return id;
};


const TAN = [0,
  0.0174,0.0349,0.0524,0.0699,0.0874,0.1051,0.1227,0.1405,0.1583,0.1763,
  0.1943,0.2125,0.2308,0.2493,0.2679,0.2867,0.3057,0.3249,0.3443,0.364,
  0.3839,0.404,0.4245,0.4452,0.4663,0.4877,0.5095,0.5317,0.5543,0.5774,
  0.6009,0.6249,0.6494,0.6745,0.7002,0.7265,0.7535,0.7813,0.8098,0.8390,
  0.8693,0.9004,0.9325,0.9657,1,1.0355,1.0724,1.1106,1.1504,1.1918,
  1.2349,1.2799,1.327,1.3764,1.4281,1.4826,1.5399,1.6003,1.6643,1.7321,
  1.804,1.8807,1.9626,2.0503,2.1445,2.2460,2.3559,2.475,2.605,2.7475,
  2.9042,3.0777,3.2709,3.4874,3.732,4.0108,4.3315,4.7046,5.1446,5.6713,
  6.3138,7.1154,8.1443,9.5144,11.4301,14.3007,19.0811,28.6363,57.29,1000,
];



export function TanToAngle(tan){
  for(let i = 0;i<TAN.length;i++){
    if(tan < TAN[i]){
      return i-1;
    }else if(tan === TAN[i]){
      return i;
    }
  };
};
