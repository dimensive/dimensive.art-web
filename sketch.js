//ugly global vars
var colors = [],
    seededChance = new Chance(chance.hash({length: 4})),
    hashes = [];

function setup() {
    console.log("onLoad");
    
    //if there is no hash, make a new one!
    if (window.location.hash.substring(window.location.hash.lastIndexOf('/') + 1).length === 0) {
        generateHash();
    } else { //or if a user specified one, load it instead
        console.log("Linked to pre-hashed page " + location.hash);
        genData(location.hash);
    }
    
    //manage maximum canvas size
    if (window.innerHeight > window.innerWidth){
        cnv = createCanvas((window.innerWidth/1.45), (window.innerWidth/1.45));
    } else {
        cnv = createCanvas((window.innerHeight/1.45), (window.innerHeight/1.45));
    }
    
    cnv.parent('container');
    cnv.id('artboard');
    
    txt = createDiv(see_v);
    txt.style('color','colors[2]');
    txt.id('desc');
    txt.parent('container');
    
    tip = createDiv("press space to regenerate");
    tip.style('color','#d9d9d9');
    tip.id('tooltip');
    tip.parent('container');
    
    centerCanvas();
}

function draw() {
    background(230);
    noStroke();
    
    if (window.innerHeight > window.innerWidth){
        perc = map(window.innerWidth, 400, displayWidth, .4, 1);
    } else {
        perc = map(window.innerHeight, 200, displayHeight, .4, 1);
    }
    
    translate(width/2, width/2);
    scale(perc);
    
    fill(colors[0]);
    
    //description
    select('#desc').html(see_v);
    select('#desc').style('color',colors[0]);
    
    rectMode(CENTER);
    createShapes();

    //saveCanvas(cnv,toString(location.hash),'jpg')
}

//centering helper function
function centerCanvas() {
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
}

//window resize detection
window.onresize = function() {
    if (window.innerHeight > window.innerWidth) {
        var h = (window.innerWidth/1.2);
    } else {
        var h = (window.innerHeight/1.2);
    }
    
    //h,h because it needs to remain square not rectangle. Whichever is smaller (w or h) .
    resizeCanvas(h,h);
    width = h;
    height = h;
};

//space bar detect / regenerate function
window.onkeydown = function (e) {
    switch (e.keyCode) {
    case 32: //space
        console.log("onkeyup");
        colors = [];
        generateHash();
        tip.class("fade");
        break;
    }
}

//color helper function
function colorHsluv(h, s, l) {
    var rgb = hsluv.hsluvToRgb([h, s, l]);
    return color(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}


//main function that determines stats about art
function genData(g) {
    var gen = new Chance(g);
    
    see_v = g,
    leg_v = gen.integer({min: 2, max: 8}),
    ele_v = gen.integer({min: 2, max: 10}),
    gri_v = gen.bool(),
    pad_v = gen.bool(),
    siz_v = gen.bool(),
    pos_v = gen.weighted(['Center', 'Top Left', 'Top Right', 'Bottom Right', 'Bottom Left'], [100, 10, 5, 5, 5]);
    
    //decide layout 1x2, 1x3, 1x4, 2x2, 2x3, 2x4, 3x3, 3x4
    column_v = gen.integer({min: 1, max: 4});
    row_v = gen.integer({min: 2, max: 5});
    
//    shape_gen = gen.weighted(['blank', 'rect', 'tri', 'circle'], [5, 2, 1, 2]);
    shape_gen = gen.weighted(['rect', 'tri', 'circle'], [2, 1, 3]);
    
    //monochromatic stepper (saturation++)
    //triad (rand hue, 100 sat, 50 light)
    
    var startHue = gen.integer({min: 0, max: 360});
    var startSat = gen.integer({min: 50, max: 100});
    var startLig = gen.integer({min: 30, max: 80});

    var changeHue = gen.integer({min: 10, max: 100});
    var changeSat = gen.integer({min: 15, max: 40});
    var changeLig = gen.integer({min: 5, max: 20});

    for(var i = 0; i < 3; i++) {
        if(startHue < 80) {
            startSat = 100;
            startLig = 50;
        }
        
      colors.push(
        colorHsluv(
          startHue + (i * changeHue),
          startSat + (i * changeSat),
          startLig + (i * changeLig)
        )
      )
    }

    //avoid super white
    if (colors[2] == "rgba(255,255,255,1)") {
        colors[2] = "rgba(238,238,238,1)";
    }
    
    printStats();
}

//printer function
function printStats() {
    print("seed: " + see_v);
    print("legs: " + leg_v);
    print("elements: " + ele_v);
    print("grid: " + gri_v);
    print("padding: " + pad_v);
    print("oversized [off]: " + siz_v);
    print("color 1: " + colors[0]);
    print("color 2: " + colors[1]);
    print("color 3: " + colors[2]);
    print("position [off]: " + pos_v);    
}

//fills each row/col with shapes
function createShapes() {
   for(var j = 0; j < row_v; j++) {
        for(var k = 0; k < column_v; k++) {
            fill(colors[0]);
            switch(shape_gen) {
                case "blank":
                    //console.log(j + ", " + k + ": " + shape_gen);
                    break;
                case "circle":
                    ellipse(j*30,k*30,30,30);
                    //console.log(j + ", " + k + ": " + shape_gen);
                    break;
                case "rect":
                    rect(j*30,k*30,31,31);
                    //console.log(j + ", " + k + ": " + shape_gen);
                    break;
                case "tri":
                    //x1,y1,x2,y2,x3,y3
                    triangle((j*30)-15,((k)*30)-15,(j*30)-15,((k+1)*30)-15,((j+1)*30)-15,((k+1)*30)-15);
                    //console.log(j + ", " + k + ": " + shape_gen);
                    break;
                default:
                    break;
            }
        } 
    }
}

//helper function for gen
function generateHash() {
    location.hash = seededChance.hash({length: 5});
    console.log("new hash generated: " + location.hash);
    hashes.push(location.hash);
    genData(location.hash);
}

//generates art based on the previous hash
function sameHash() {
    var sHash = window.location.hash.substring(window.location.hash.lastIndexOf('#') + 1);
    genData(sHash);
}