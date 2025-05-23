// The RidgePlot class creates a dynamic visualization of audio waveforms.
class RidgePlot {
  // Constructor sets up the initial properties of the ridge plot.
  constructor() {
    this.name = "ridgeplot"; // Name identifier for the visualization.
    this.output = []; // Array to store the waveform data.
    this.speed = 0.7; // Speed at which the waves move.
    this.onResize(); // Initialize dimensions based on current window size.
  }

  // Method to update plot dimensions when the window is resized.
  onResize() {
    // Set starting and ending positions for the plot.
    this.startX = width / 5;
    this.endY = height / 5;
    this.startY = height - this.endY;
    this.spectrumWidth = (width / 5) * 3; // Width of the spectrum display area.
  
    // Adjust the positions of existing waves to the new dimensions.
    this.output = this.output.map(wave => {
      return wave.map(point => {
        return {
          x: map(point.x, 0, width, this.startX, this.startX + this.spectrumWidth),
          y: map(point.y, 0, height, this.startY, this.startY - (point.y - this.startY))
        };
      });
    });
  }
  
  // Method to add a new waveform to the visualization.
  addWave(fourier) {
    const w = fourier.waveform(); // Get the waveform from the Fourier analysis.
    const outputWave = []; // Array to store the new wave's points.
    const smallScale = 1; // Scale for smaller amplitude waves.
    const bigScale = 10; // Scale for larger amplitude waves.

    // Loop through the waveform data and create points for the wave.
    for (let i = 0; i < w.length; i++) {
      if (i % 15 === 0) { // Sample the waveform data every 15 points.
        const x = map(i, 0, w.length, this.startX, this.startX + this.spectrumWidth);
        const y = (i < w.length * 0.25 || i > w.length * 0.75) ?
                  map(w[i], -1, 1, -smallScale, smallScale) :
                  map(w[i], -1, 1, -bigScale, bigScale);
        outputWave.push({ x: x, y: this.startY + y }); // Add the point to the wave.
      }
    }
    this.output.push(outputWave); // Add the new wave to the output array.
  }

  // Method to draw the ridge plot with smooth lines and gradient.
  draw() {
    push(); // Save the current drawing state.
    background(0); // Set the background color.
    noFill(); // Disable filling shapes.

    // Add a new wave to the visualization every 30 frames.
    if (frameCount % 30 === 0) {
      this.addWave(fourier); // Add a new wave based on the Fourier analysis.
    }

    // Draw each wave in the output array.
    this.output.forEach((o, i) => {
      // Create a gradient for the stroke.
      const gradient = drawingContext.createLinearGradient(this.startX, this.startY, this.startX, this.endY);
      gradient.addColorStop(0, 'rgba(255, 0, 0, 1)'); // Start color: red.
      gradient.addColorStop(1, 'rgba(0, 0, 255, 1)'); // End color: blue.

      drawingContext.strokeStyle = gradient; // Apply the gradient to the stroke.
      strokeWeight(2); // Set the stroke weight.
      beginShape(); // Begin recording vertices for the shape.

      // Draw the wave using curve vertices for smoothness.
      curveVertex(o[0].x, o[0].y); // Start control point.
      o.forEach(point => {
        point.y -= this.speed; // Move the wave up at the set speed.
        curveVertex(point.x, point.y); // Add the point to the shape.
      });
      curveVertex(o[o.length - 1].x, o[o.length - 1].y); // End control point.
      endShape(); // Finish recording vertices and draw the shape.

      // Remove the wave if it has moved beyond the top of the plot area.
      if (o[0].y < this.endY) {
        this.output.splice(i, 1);
      }
    });
    pop(); // Restore the previous drawing state.
  }
}
