var cnv;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function setup() {
    //manage maximum canvas size
    if (window.innerHeight > window.innerWidth){
        cnv = createCanvas((window.innerWidth/1.45), (window.innerWidth/1.45));
    } else {
        cnv = createCanvas((window.innerHeight/1.45), (window.innerHeight/1.45));
        }
    //cnv.parent('artboard');
    cnv.id('artboard')
    centerCanvas();
}

window.onresize = function() {
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    cnv.position(x, y);
    
    if (window.innerHeight > window.innerWidth){
        var h = (window.innerWidth/1.45);
    } else {
        var h = (window.innerHeight/1.45);
    }
    resizeCanvas(h,h);
    width = h;
    height = h;
}

function draw() {
    background(255, 255, 255);
    fill('grey');
    noStroke();
    //to do: check based on biggest size, make linear scale
    
    if (window.innerHeight > window.innerWidth){
        var perc = map(window.innerWidth,400,displayWidth,.4,1);
    } else {
        var perc = map(window.innerHeight,200,displayHeight,.4,1);
    }
    
    translate(width/2, width/2);
    scale(perc);
    ellipse(0, 0, 200, 200);
}

//map(value,start1,stop1,start2,stop2,[withinBounds])