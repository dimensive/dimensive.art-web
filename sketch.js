var cnv;

var colors = [];

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function setup() {
    
    console.log("onLoad");
    
    if (window.location.hash.substring(window.location.hash.lastIndexOf('/') + 1).length === 0) {
        generateHash();
    } else {
        console.log("Linked to pre-hashed page " + location.hash);
        genArt(location.hash);
    }
    
    //manage maximum canvas size
    if (window.innerHeight > window.innerWidth){
        cnv = createCanvas((window.innerWidth/1.45), (window.innerWidth/1.45));
    } else {
        cnv = createCanvas((window.innerHeight/1.45), (window.innerHeight/1.45));
        }
    //cnv.parent('artboard');
    cnv.id('artboard');
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
    //colorMode(HSL);
    background(255, 255, 255);
    noStroke();
    //to do: check based on biggest size, make linear scale
    
    if (window.innerHeight > window.innerWidth){
        var perc = map(window.innerWidth,400,displayWidth,.4,1);
    } else {
        var perc = map(window.innerHeight,200,displayHeight,.4,1);
    }
    
    translate(width/2, width/2);
    scale(perc);
    
    fill(colors[0]);
    ellipse(255/-2,0,225,225);
    fill(colors[1]);
    ellipse(255/2,0,225,225);
    fill(colors[2]);
    ellipse(0,0,225,225);
    //saveCanvas(cnv,toString(location.hash),'jpg')
}

//seededChance is only used to generate the url, then those values are used for repeatable URLs and Colors, sizes, etc.
var seededChance = new Chance(chance.hash({length: 3})),
    hashes = [],
    h,
    latest,
    s;

function genArt(g) {
    console.log("Seed: " + g);

    var gen = new Chance(g);
    
    leg_v = gen.integer({min: 2, max: 8}),
    ele_v = gen.integer({min: 2, max: 10}),
    gri_v = gen.bool(),
    pad_v = gen.bool(),
    siz_v = gen.bool(),
    pos_v = gen.weighted(['Center', 'Top Left', 'Top Right', 'Bottom Right', 'Bottom Left'], [100, 10, 5, 5, 5]) ;
    
    var startHue = gen.integer({min: 0, max: 360});
    var startSat = gen.integer({min: 40, max: 100});
    var startLig = gen.integer({min: 0, max: 80});

    var changeHue = gen.integer({min: 10, max: 100});
    var changeSat = gen.integer({min: 15, max: 40});
    var changeLig = gen.integer({min: 5, max: 20});

    for(var i = 0; i < 3; i++) {
      colors.push(
        colorHsluv(
          startHue + (i * changeHue),
          startSat + (i * changeSat),
          startLig + (i * changeLig)
        )
      )
    }
     
    print("legs: " + leg_v);
    print("elements: " + ele_v);
    print("grid?: " + gri_v);
    print("padding?: " + pad_v);
    print("oversized?: " + siz_v);
    print("color: " + colors);
    print("position: " + pos_v);
}

function generateHash() {
    location.hash = seededChance.hash({length: 6});
    console.log("new hash generated: " + location.hash);
    h = location.hash;
    hashes.push(h);
    genArt(location.hash);
}

//generates art based on the previous hash
function sameHash() {
    var sHash = window.location.hash.substring(window.location.hash.lastIndexOf('#') + 1);
    genArt(sHash);
}

window.onkeydown = function (e) {
    switch (e.keyCode) {
    case 32: //space
        console.log("onkeyup");
        colors = [];
        generateHash();
        break;
    }
};

function colorHsluv(h, s, l) {
    var rgb = hsluv.hsluvToRgb([h, s, l]);
    return color(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}