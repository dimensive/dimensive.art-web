/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define */
var colors = [],
    hashes = [],
    artwork = [];

var hashgenerator = new HashGenerator();
    
var managerSeed = new Chance(chance.hash({length: 4}));

function setup() {
    console.log("onLoad");
    
    //if there is no hash, make a new one!
    if (window.location.hash.substring(window.location.hash.lastIndexOf('/') + 1).length === 0) {
        hashgenerator.newHash(managerSeed.hash({length: 5}));
    } else { //or if a user specified one, load it instead
        console.log("Linked to pre-hashed page " + location.hash);
        hashgenerator.recycleHash();
    }
    
    var cnv;
    
    //manage maximum canvas size
    if (window.innerHeight > window.innerWidth) {
        cnv = createCanvas((window.innerWidth / 1.45), (window.innerWidth / 1.45));
    } else {
        cnv = createCanvas((window.innerHeight / 1.45), (window.innerHeight / 1.45));
    }
    
    cnv.parent('container');
    cnv.id('artboard');
    
    txt = createDiv(hashgenerator.seed);
    txt.style('color','colors[2]');
    txt.id('desc');
    txt.parent('container');
    
    tip = createDiv("press space to regenerate");
    tip.style('color','#d9d9d9');
    tip.id('tooltip');
    tip.parent('container');
    
    //description
    hashgenerator.seed = location.hash;
    updateDescription();
    
    centerCanvas();
}

function draw() {
    background(230);
    noStroke();
    var perc;
    
    if (window.innerHeight > window.innerWidth){
        perc = map(window.innerWidth, 400, displayWidth, .4, 1);
    } else {
        perc = map(window.innerHeight, 200, displayHeight, .4, 1);
    }
    
    translate( width / 2, width / 2 );
    scale(perc);
    fill(colors[0]);
    rectMode(CENTER);
    
    for (cnt = 0; cnt < artwork.length; cnt++) {
        artwork[cnt].display();
    }
    
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
        var h = (window.innerWidth / 1.2);
    } else {
        var h = (window.innerHeight / 1.2);
    }
    
    //h,h because it needs to remain square not rectangle. Whichever is smaller (w or h) .
    resizeCanvas(h,h);
    width = h;
    height = h;
};

//space bar detect / reload regenerate function
window.onkeydown = function(e) {
    switch (e.keyCode) {
    case 32: //space
        console.log("onkeyup");
        colors = [];
          
        hashgenerator.newHash(managerSeed.hash({length: 5}));
        updateDescription();
            
        if (artwork != []) {
            artwork[0].display();
            console.log(artwork[0]);
        } else {
            console.log("nothing to print!");
        }
        tip.class("fade");
        break;
    }
}

function updateDescription() {
    select('#desc').html(hashgenerator.seed);
    select('#desc').style('color', colors[0]);
}

function addArtObject(a) {
    artwork.push(new Artwork (a));
}

function HashGenerator() {

    this.newHash = function(seedyboy) {
        this.hashedName = seedyboy;
        location.hash = this.hashedName;
        this.seed = location.hash;
        console.log("new hash generated: " + this.seed);
        hashes.push(this.seed);
        artwork = [];
        addArtObject(this.seed);
        console.log("added: " + this.seed);
    };
    
    this.recycleHash = function() {
        this.seed = window.location.hash.substring(window.location.hash.lastIndexOf('#') + 1);
        console.log("recycled seed: #" + this.seed);
        addArtObject("#" + this.seed);
    };
    
    return this.seed;
}

//function make2Darray(cols, rows) {
//    var arr = new Array(cols);
//    for (var i = 0; i < arr.length; i++) {
//        arr[i] = new Array(rows);
//    }
//    return arr;
//}

//main function that determines stats about art
function Artwork(g) {
    
    this.gen = new Chance(g);
    
    this.seed = g,
    this.legs = this.gen.integer({min: 2, max: 8}),
    this.elements = this.gen.integer({min: 2, max: 10}),
    this.grid = this.gen.bool(),
    this.padding = this.gen.bool(),
    this.oversize = this.gen.bool(),
    this.anchor = this.gen.weighted(['Center', 'Top Left', 'Top Right', 'Bottom Right', 'Bottom Left'], [100, 10, 5, 5, 5]);
    
    //decide layout 1x2, 1x3, 1x4, 2x2, 2x3, 2x4, 3x3, 3x4
    this.columns = this.gen.integer({min: 2, max: 6});
    this.rows = this.gen.integer({min: 2, max: 6});
    
    //this.shape = gen.weighted(['blank', 'rect', 'tri', 'circle'], [5, 2, 1, 2]);
    this.shape = this.gen.n(this.gen.weighted, this.columns, ['blank', 'rect', 'tri', 'circle'], [3, 2, 1, 3]);
    
    //monochromatic stepper (saturation++)
    //triad (rand hue, 100 sat, 50 light)
    
    this.hue = this.gen.integer({min: 0, max: 360});
    this.saturation = this.gen.integer({min: 50, max: 100});
    this.lightness = this.gen.integer({min: 30, max: 80});
    
    //delta hue,sat,light
    this.delta_hue = this.gen.integer({min: 10, max: 100});
    this.delta_saturation = this.gen.integer({min: 15, max: 40});
    this.delta_lightness = this.gen.integer({min: 5, max: 20});
    
    this.colorHsluv = function(h, s, l) {
        var rgb = hsluv.hsluvToRgb([h, s, l]);
        return color(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
    };
    
    for(var i = 0; i < 3; i++) {
        if(this.hue < 80) {
            this.saturation = 100;
            this.lightness = 50;
        }
        
      colors.push(
        this.colorHsluv(
          this.hue + (i * this.delta_hue),
          this.saturation + (i * this.delta_saturation),
          this.lightness + (i * this.delta_lightness)
        )
      )
    }

    //avoid super white
    if (colors[2] == "rgba(255,255,255,1)") {
        colors[2] = "rgba(238,238,238,1)";
    }
    
    this.printStats = function(){
        print("seed: " + this.seed);
        print("legs: " + this.legs);
        print("elements: " + this.elements);
        print("grid: " + this.grid);
        print("padding: " + this.padding);
        print("oversized [off]: " + this.oversize);
        print("color 1: " + colors[0]);
        print("color 2: " + colors[1]);
        print("color 3: " + colors[2]);
        print("position [off]: " + this.anchor);
    };
    
    this.display = function() {
        for(var j = 0; j < this.rows; j++) {
            for(var k = 0; k < this.columns; k++) {
                switch(this.shape[j]) {
                    case "blank":
                        //console.log(j + ", " + k + ": " + shape_gen);
                        break;
                    case "circle":
                        fill(this.gen.pickone(colors));
                        ellipse(j*30,k*30,30,30);
                        //console.log(j + ", " + k + ": " + shape_gen);
                        break;
                    case "rect":
                        fill(this.gen.pickone(colors));
                        rect(j*30,k*30,31,31);
                        //console.log(j + ", " + k + ": " + shape_gen);
                        break;
                    case "tri":
                        fill(this.gen.pickone(colors));
                        //x1,y1,x2,y2,x3,y3
                        triangle((j*30)-15,((k)*30)-15,(j*30)-15,((k+1)*30)-15,((j+1)*30)-15,((k+1)*30)-15);
                        //console.log(j + ", " + k + ": " + shape_gen);
                        break;
                    default:
                        break;
                }
            } 
        }
    };
}