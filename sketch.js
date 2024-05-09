let d = 2;
let i, j, n;

let mic, fft;

let band = 64;

let unit = 8;
let count;
let modA = [];

function setup() {
  createCanvas(windowWidth - 30, windowHeight - 30, WEBGL);
  ortho();

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT(0.1, band);
  fft.setInput(mic);

  modA = new Module(unit, unit);

  let wideCount = band / 16;
  let highCount = band / 16;
  count = wideCount * highCount;

  let index = 0;
  for (let y = 0; y < highCount; y++) {
    for (let x = 0; x < wideCount; x++) {
      modA[index++] = new Module(unit * x, unit * y, 4, 4, unit);
    }
  }
}
function draw() {
  background(255);

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
  constructor(xOff, yOff, xsz, ysz, unit) {
    this.xOff = xOff;
    this.yOff = yOff;
    this.xsz = xsz;
    this.ysz = ysz;
    this.zsz;
    this.band;
    this.lrp;
    this.unit = unit;
  }

  // Custom method for updating the variables
  updateDraw() {
    orbitControl();
    let spectrum = fft.analyze();
    for (i = 0; i < band; i++) {
      this.zsz = map(spectrum[18], 0, 255, 0, height);
      this.lrp = lerp(0, this.zsz, 0.1);

      push();
      fill(100 + this.lrp, 0, 255 - this.lrp);

      translate(this.xOff, this.yOff, this.lrp / 2);
      box(this.xsz, this.ysz, this.lrp);
      pop();
    }
  }
}
