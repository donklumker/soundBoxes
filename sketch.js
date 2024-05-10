let d = 9; //diameter of boxes
let i, j, n; //ariables for constructing grid
let mic, fft; //variables for sound input
let band = 256; //setting for number of band in sound analysis
let unit = d + 1; //spacing per grid cell
let count; //total number of cells
let modA = []; //array of objects

function setup() {
  createCanvas(windowWidth - 30, windowHeight - 30, WEBGL);
  ortho(); //sets object as a paraline projection

  mic = new p5.AudioIn(); //pathes to mic input
  mic.start(); //turns mic on?
  fft = new p5.FFT(0.9, band); //establishes fft analysis
  fft.setInput(mic); //patches mic to fft analysis

  let wideCount = band / sqrt(band); //
  let highCount = band / sqrt(band);
  count = wideCount * highCount;

  let index = 0;
  for (let y = 0; y < highCount; y++) {
    for (let x = 0; x < wideCount; x++) {
      modA[index++] = new Module(unit * x, unit * y, d, d, unit, x * y);
    }
  }
}
function draw() {
  background(255, 129, 22);

  // Turn on the lights.
  //ambientLight(228, 255, 255);
  //directionalLight(128, 128, 128, 0, 0, -1);

  for (let i = 0; i < count; i++) {
    modA[i].updateDraw();
  }
}

function keyTyped() {
  if (key === "s" || key === "S") {
    saveCanvas("3d-grid-box", "png");
  }
}

class Module {
  constructor(xOff, yOff, xsz, ysz, unit, band) {
    this.xOff = xOff;
    this.yOff = yOff;
    this.xsz = xsz;
    this.ysz = ysz;
    this.zsz;
    this.band;
    this.lrp;
    this.unit = unit;
    this.band = band;
  }

  // Custom method for updating the variables
  updateDraw() {
    //noStroke();
    stroke(255);
    orbitControl();
    let spectrum = fft.analyze();

    for (i = 0; i < band; i++) {
      this.zsz = map(spectrum[this.band], 0, 200, 0, height);
      this.lrp = lerp(0, this.zsz, 0.05);

      point(this.xOff, this.yOff, this.lrp);

      /*
      push();
      fill(155 + this.lrp, 0, 255 - this.lrp);
      translate(this.xOff, this.yOff, this.lrp / 2);
      box(this.xsz, this.ysz, this.lrp);
      pop();
      */
    }
  }
}
