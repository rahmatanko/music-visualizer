// Global for the controls and input
let controls;
// Store visualizations in a container
let vis;
// Variable for the p5 sound object
let sound;
// Variable for p5 fast Fourier transform
let fourier;
// Variable for scaling visualizations
const constant = 1;

// Preload the sound
function preload() {
  sound = loadSound('songs/riptide.mp3');
}

// Setup the canvas and visualizations
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  // Instantiate the FFT object
  fourier = new p5.FFT();
  amplitude = new p5.Amplitude();

  // Create a new visualization container and add visualizations
  vis = new Visualisations();
  vis.add(new Spectrum());
  vis.add(new WavePattern());
  vis.add(new Needles());
  vis.add(new RidgePlot());
  vis.add(new Spectogram());
  vis.add(new Galaxy());

  controls = new ControlsAndInput();
}

// Draw the selected visualization and controls
function draw() {
  background(0);
  // Draw the selected visualization
  vis.selectedVisual.draw();
  // Draw the controls on top
  controls.draw();
  translate(width / 100, height / 100);
}

// Handle mouse click events
function mouseClicked() {
  controls.mousePressed();
}

// Handle key press events
function keyPressed() {
  controls.keyPressed(keyCode);
}

// Resize the canvas and visualizations when the window is resized
function windowResized() {
  controls.updateMenuLayout();
  resizeCanvas(windowWidth, windowHeight);
  if (vis.selectedVisual.hasOwnProperty('onResize')) {
    vis.selectedVisual.onResize();
  }
}
