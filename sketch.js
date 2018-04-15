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
}

//map(value,start1,stop1,start2,stop2,[withinBounds])




//-------------------------------------------


/*global Chance, chance, Snap, console, alert, window, location,*/
/*jslint plusplus: true*/

//instantiate new vars
//seededChance is only used to generate the hashes, then those values are used for URLs and Colors, sizes, etc.
var seededChance = new Chance(chance.hash({length: 3})),
    hashes = [],
    h,
    latest,
    s;

//COLORS
var palette = [["422ef4", "ff84a8", "ffdd8e", "ffffff"], //load these from a txt file?
               ["000000", "ff6050", "95e2e7", "fff8d3"],
               ["1b1e9b", "c342a3", "44c0ff", "f6d579"],
               ["1e2e62", "f9517e", "44c0ff", "dce8eb"],
               ["3a1464", "ef3c25", "fbb03b", "ffffff"],
               ["1b1e9b", "e1116a", "ffcd06", "75d9f8"],
               ["921e51", "c93559", "66d3a9", "fff8d3"],
               ["cc3e3e", "ff6050", "75d9f8", "ffffff"],
               ["094bd1", "ffcd06", "93e3da", "fff5c5"],
               ["000000", "147dff", "cccccc", "ffffff"],
               ["000000", "fa2cc4", "02feff", "ffffff"],
               ["000000", "147dff", "ffff02", "ffffff"],
               ["c64f4f", "7594ff", "eadcb9", "c2fff6"],
               ["000000", "4d4d4d", "cccccc", "ffffff"],
               ["000000", "ff6050", "cccccc", "ffffff"],
               ["000000", "ff6050", "cccccc", "ffffff"],
               ["000000", "fa2cc4", "cccccc", "ffffff"],
               ["000000", "e1116a", "147dff", "ffffff"]];

function genArt(g) {
    console.log("Seed: " + g);

    var gen = new Chance(g);
    
    var leg_v = gen.integer({min: 2, max: 8}),
        ele_v = gen.integer({min: 2, max: 10}),
        gri_v = gen.bool(),
        pad_v = gen.bool(),
        siz_v = gen.bool(),
        col_v = gen.color({format: 'hex'});
    
    //may not be nessecary but an obj is helpful for org
    gen.mixin({
    'artwork': function() {
        return {
            legs: leg_v,
            elements: ele_v,
            grid: gri_v,
            padding: pad_v,
            size: siz_v,
            color: col_v
        }; 
    }
    });
    
    print("legs: " + gen.artwork().legs);
    print("legs: " + leg_v);
    print(gen.artwork());
    //fill('red');
    //ellipse(0, 0, 200, 200);
}

function generateHash() {
    location.hash = seededChance.hash({length: 4});
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

window.onload = function () {
    console.log("onLoad");

    if (window.location.hash.substring(window.location.hash.lastIndexOf('/') + 1).length === 0) {
        generateHash();
    } else {
        console.log("Linked to pre-hashed page " + location.hash);
        genArt(location.hash);
    }
};

window.onkeyup = function (e) {
    switch (e.keyCode) {
    case 32: //space
        console.log("onkeyup");
        generateHash();
        break;
    }
};