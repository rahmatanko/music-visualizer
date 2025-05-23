// Class representing a wave pattern visualization.
class WavePattern {
	// Constructor sets the name property of the wave pattern.
	constructor() {
	  this.name = "wavepattern"; // Name identifier for the wave pattern object.
	}
  
	// Custom smoothing function to create a smoother wave pattern.
	smoothWave(wave, smoothness) {
	  let smoothedWave = []; // Array to hold the smoothed wave values.
	  // Iterate over each point in the wave array.
	  for (let i = 0; i < wave.length; i++) {
		let sum = 0; // Sum of weighted values for smoothing.
		let weightSum = 0; // Sum of weights for normalization.
		// Apply smoothing over a range defined by the smoothness parameter.
		for (let j = -smoothness; j <= smoothness; j++) {
		  let index = i + j; // Index of the neighboring point.
		  let weight = smoothness + 1 - Math.abs(j); // Weight decreases with distance from the center point.
		  // Check if the index is within the bounds of the wave array.
		  if (index >= 0 && index < wave.length) {
			sum += wave[index] * weight; // Add the weighted value to the sum.
			weightSum += weight; // Add the weight to the weight sum.
		  }
		}
		// Push the normalized smoothed value to the smoothedWave array.
		smoothedWave.push(sum / weightSum);
	  }
	  return smoothedWave; // Return the smoothed wave array.
	}
  
	// Draw method to render the wave pattern on the canvas.
	draw() {
	  push(); // Saves the current drawing state.
	  noFill(); // Disables filling geometry.
	  stroke(255, 0, 0); // Sets the stroke color to red.
	  strokeWeight(2); // Sets the stroke weight to 2 pixels.
  
	  // Translate the origin to the center of the canvas for symmetry.
	  translate(width / 2, height / 2);
  
	  var wave = fourier.waveform(); // Retrieves the waveform from the Fourier transform.
	  // Apply custom smoothing to the waveform with a smoothness factor of 8.
	  wave = this.smoothWave(wave, 8);
  
	  beginShape(); // Begins recording vertices for a shape.
	  // Draw the first anchor point of the wave.
	  var x0 = map(0, 0, wave.length, -width / 2, width / 2);
	  var y0 = map(wave[0], -1, 1, -height / 2, height / 2);
	  vertex(x0, y0); // Sets the position of the first vertex.
  
	  // Draw Bezier vertices for a smooth curve.
	  for (var i = 1; i < wave.length - 2; i += 2) {
		// Calculate the x and y coordinates for the current, next, and the vertex after the next points.
		var xc = map(i, 0, wave.length, -width / 2, width / 2);
		var yc = map(wave[i], -1, 1, -height / 2, height / 2);
		var xc_next = map(i + 1, 0, wave.length, -width / 2, width / 2);
		var yc_next = map(wave[i + 1], -1, 1, -height / 2, height / 2);
		var xc_after = map(i + 2, 0, wave.length, -width / 2, width / 2);
		var yc_after = map(wave[i + 2], -1, 1, -height / 2, height / 2);
  
		// Calculate control points for the Bezier curve based on the current and next points.
		var cp1x = (xc + xc_next) / 2;
		var cp1y = yc;
		var cp2x = (xc_next + xc_after) / 2;
		var cp2y = yc_next;
  
		// Create a Bezier vertex with the calculated control points and the position of the next anchor point.
		bezierVertex(cp1x, cp1y, cp2x, cp2y, xc_after, yc_after);
	  }
  
	  // Draw the last anchor point of the wave.
	  var xEnd = map(wave.length - 1, 0, wave.length, -width / 2, width / 2);
	  var yEnd = map(wave[wave.length - 1], -1, 1, -height / 2, height / 2);
	  vertex(xEnd, yEnd); // Sets the position of the last vertex.
  
	  endShape(); // Finishes recording vertices and draws the shape.
	  pop(); // Restores the previous drawing state.
	}
  }
  