const ctx = canvas.getContext("2d");

// creates a random integer between min and max. If min only given the between 0 and the value
function randomInt(min) {
  max = min + (min = 0);
  return (Math.random() * (max - min) + min) | 0;
}

// same as above but as floats.
function randomFloat(min) {
  max = min + (min = 0);
  return Math.random() * (max - min) + min;
}

// creates a 2d point at x,y. If only x is a point than set to that point
function point(x=0, y){
  if (x.x && y === undefined) {return { x: x.x,y: x.y} }
  return {x,y: y === undefined ? 0 : y }
}

function ease (time, amount = 2) { return Math.pow(time % 1,amount) };

// stuff for stars
const skyColour = [10,30,50];
const density = 1000; // number of star per every density pixels
const colourChangeRate = 16; // Time in frames to change a colour
const stars = [];
const star = { // define a star
  draw() {
    this.count += 1; // integer counter used to triger color change every 16 frames
    if (this.count % colourChangeRate === 0) { // change colour ?
      // colour is a gaussian distribution (NOT random) centered at #888
      var c = (Math.random() + Math.random() + Math.random() + Math.random()) * 4;
      var str = "#";
      str += Math.floor(c * this.red).toString(16); // change color
      str += Math.floor(c * this.green).toString(16); // change color
      str += Math.floor(c * this.blue).toString(16); // change color
      

      this.col = str;
    }
    ctx.fillStyle = this.col;
    // move star around  a pixel. Again its not random
    // but a gaussian distribution. The movement is sub pixel and will only
    // make the stars brightness vary not look like its moving
    var ox = (Math.random() + Math.random() + Math.random() + Math.random()) / 4;
    var oy = (Math.random() + Math.random() + Math.random() + Math.random()) / 4;
    ctx.fillRect(this.pos.x + ox, this.pos.y + oy, this.size, this.size);
  }
}
// create a random star
// the size is calculated to produce many more smaller stars than big
function createStar(pos) {
  stars.push(Object.assign({}, star, {
    pos,
    col: "#ccc",
    count: randomInt(colourChangeRate),
    size: randomFloat(1) * randomFloat(1) * 2 + 0.5,
    red: 1-(randomFloat(1) * randomFloat(1) *randomFloat(1)),  // reduces colour channels
    green: 1-(randomFloat(1) * randomFloat(1) *randomFloat(1)), // but only by a very small amount
    blue: 1-(randomFloat(1) * randomFloat(1) *randomFloat(1)),  // most of the time but occasional
                                           // star will have a distinct colour
  }));
}

var starCount;
var skyGrad;

// render the stars
function mainLoop(time) {
  // resize canvas if page size changes
  if (canvas.width !== innerWidth || canvas.height !== innerHeight) {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    // create a new set of stars 
    stars.length = 0;
    // density is number of pixels one the canvas that has one star
    starCount = Math.floor((canvas.width * canvas.height) / density);
    // create the random stars;
    var star = 0;
    while (star < starCount) {
      createStar(point(randomInt(canvas.width), randomInt(canvas.height)));
      star++;
    }
    skyGrad = ctx.createLinearGradient(0,0,0,canvas.height);
    skyGrad.addColorStop(0,"black");
    /* [db] removed the lines below to make it look like space! */
    /*doFor(100,(i)=>{
        var pos  = clamp(i/100,0,1);
        var col = ease(pos);
        skyGrad.addColorStop(
            pos,
            "rgb(" + 
              Math.floor(skyColour[0] * col) + "," +
              Math.floor(skyColour[1] * col) + "," +
              Math.floor(skyColour[2] * col) + ")"
         );
     });
     // floating point error can cause problems if we dont set the top
     // at 1
     skyGrad.addColorStop(1,"rgb("+skyColour[0]+","+skyColour[1]+","+skyColour[2]+")");
  */  
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  star = 0;
  while (star < starCount) {
    stars[star].draw();
    star++;
  }

  requestAnimationFrame(mainLoop);
}
requestAnimationFrame(mainLoop);
