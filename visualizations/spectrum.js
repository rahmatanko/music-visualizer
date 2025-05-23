// Class representing a visual spectrum analyzer.
class Spectrum {
	// Constructor sets the name property of the spectrum.
	constructor() {
	  this.name = "spectrum"; // Name identifier for the spectrum object.
	}
  
	// Draw method to render the spectrum analysis on the canvas.
	draw() {
	  scale(constant); // Scales the spectrum visualization by a constant factor.
	  push(); // Saves the current drawing state.
	  let spectrum = fourier.analyze(); // Performs a Fourier transform to get frequency data.
	  noStroke(); // Disables drawing the stroke (outline) for shapes.
  
	  // Define the colors for the gradient outside the loop.
	  const colours = [
		color(238, 175, 97), // Light orange.
		color(251, 144, 98), // Coral.
		color(238, 93, 108), // Soft red.
		color(206, 73, 147), // Purple.
		color(106, 13, 131)  // Dark violet.
	  ];
	  const ranges = [0.2, 0.4, 0.6, 0.8, 1.0]; // Thresholds for color interpolation.
  
	  // Loop through each value in the spectrum array.
	  for (let i = 0; i < spectrum.length; i++) {
		// Map the spectrum value to a range between 0 and 1 for interpolation.
		let amt = map(spectrum[i], 0, 255, 0, 1);
  
		// Interpolate between the colors based on the mapped amount.
		let col = colours[0]; // Default to the first color.
		for (let j = 0; j < ranges.length - 1; j++) {
		  if (amt <= ranges[j + 1]) {
			// Find the appropriate color range and interpolate between the two colors.
			col = lerpColor(colours[j], colours[j + 1], map(amt, ranges[j], ranges[j + 1], 0, 1));
			break; // Exit the loop once the color is found.
		  }
		}
  
		// Apply the interpolated color to the fill.
		fill(col);
  
		// Draw each bin as a rectangle.
		let y = map(i, 0, spectrum.length, 0, height); // Map the bin index to y position.
		let w = map(spectrum[i], 0, 255, 0, width); // Map the spectrum value to rectangle width.
		// Draw the rectangle with rounded corners.
		rect(0, y, w, height / spectrum.length + 5, 70);
	  }
	  pop(); // Restores the previous drawing state.
	}
  }
  