let faceapi;
let detections = [];
let friend;
let x = 100;
let y = 100;
let video;
let video2;
let canvas;
let image;
let imgSize;

function preload(){
  friend = loadImage('friends.png')
};

function setup() {
  if(windowWidth>windowHeight) {imgSize=windowHeight}
  else{imgSize=windowWidth};
  canvas = createCanvas(imgSize,imgSize);
  canvas.id('canvas');
 if(width>height) {imgSize=height}
 else{imgSize=width};

  // Creat the video: ビデオオブジェクトを作る
  video2 = createCapture (VIDEO,{ flipped:true});
  //Change the video input's aspect ratio according to canvas: キャンバスに合わせてビデオインプットの画面比を帰る．
  video2.size(imgSize,imgSize);
  video2.id('video');
  


  

  image = createImg('friends.png','헤위');
  image.size(imgSize,imgSize);
  image.id('image');
 

  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true,
    minConfidence: 0.5
  };


  //Initialize the model: モデルの初期化
  faceapi = ml5.faceApi(video2, faceOptions, faceReady);
}

function faceReady() {
  faceapi.detect(gotFaces);// Start detecting faces: 顔認識開始
}

// Got faces: 顔を検知
function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  detections = result;　//Now all the data in this detections: 全ての検知されたデータがこのdetectionの中に
  console.log(detections);

  clear();//Make back ground transparent: 背景を透明にする
  drawBoxs(detections);//Draw detection box: 顔の周りの四角の描画
  drawExpressions(detections, 20, 250, 14);//Draw face expression: 表情の描画

  faceapi.detect(gotFaces);// Call the function again at here: 認識実行の関数をここでまた呼び出す
}

function drawBoxs(detections){
  if (detections.length > 0) {//If at least 1 face is detected: もし1つ以上の顔が検知されていたら
    for (f=0; f < detections.length; f++){
      let {_x, _y, _width, _height} = detections[0].alignedRect._box;
      stroke(44, 169, 225);
      strokeWeight(5);
      noFill();
      rect(imgSize-_x-_width, _y-_height/8, _width, _height);
    }
  }
}



function drawExpressions(detections, x, y, textYSpace){
  if(detections.length > 0){//If at least 1 face is detected: もし1つ以上の顔が検知されていたら
    let {neutral, happy, angry, sad, disgusted, surprised, fearful} = detections[0].expressions;
    let size = imgSize/20
    textFont('Helvetica Neue');
    textSize(size);
    stroke(3);
    fill(44, 169, 225);
   


    text("친구가 되어서 기뻐요!: " + nf(happy*100, 2, 2)+"%", x, y);
    text("친구가 되어 놀라워요!:  " + nf(surprised*100, 2, 2)+"%", x, y+size);
    text("딱히...:       " + nf(neutral*100, 2, 2)+"%", x, y+size*2);
    text("별로에요..: " + nf(disgusted*100, 2, 2)+"%", x, y+size*3);
    
  }else{//If no faces is detected: 顔が1つも検知されていなかったら
    text("얼굴을 보여주세요 ", x, y);
    
  }
  
}
