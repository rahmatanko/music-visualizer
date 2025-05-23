// The Needles function visualizes audio frequencies as needle dials.
function Needles() {
	// Name of the visualization.
	this.name = "needles";
  
	// Define the arc range for the needle plot.
	var minAngle = PI + PI / 10;
	var maxAngle = TWO_PI - PI / 10;
  
	// Define the grid layout for the plots.
	this.plotsAcross = 2;
	this.plotsDown = 2;
  
	// Define the frequency bins for the audio analysis.
	this.frequencyBins = ["bass", "lowMid", "highMid", "treble"];
  
	// Function to resize the plot sizes when the screen is resized.
	this.onResize = function() {
	  this.pad = width / 20; // Padding around the plots.
	  this.plotWidth = (width - this.pad) / this.plotsAcross; // Width of each plot.
	  this.plotHeight = (height - this.pad) / this.plotsDown; // Height of each plot.
	  this.dialRadius = (this.plotWidth - this.pad) / 2 - 5; // Radius of the dial for the needles.
	};
	// Call onResize to set initial values when the object is created.
	this.onResize();
  
	// Draw the plots to the screen.
	this.draw = function() {
	  scale(constant); // Scale the visualization by a constant factor.
	  var spectrum = fourier.analyze(); // Create an array of amplitude values from the FFT.
	  var currentBin = 0; // Iterator for selecting frequency bin.
  
	  push(); // Save the current drawing state.
	  fill('#f5c9d0'); // Set the fill color for the plots.
  
	  // Nested loop to place plots in a 2x2 grid.
	  for (var i = 0; i < this.plotsDown; i++) {
		for (var j = 0; j < this.plotsAcross; j++) {
		  // Calculate the size and position of the plots.
		  var x = this.pad + j * this.plotWidth;
		  var y = this.pad + i * this.plotHeight;
		  var w = this.plotWidth - this.pad;
		  var h = this.plotHeight - this.pad;
  
		  rect(x, y, w, h); // Draw a rectangle for the plot.
		  this.ticks(x + w / 2, y + h, this.frequencyBins[currentBin]); // Add ticks to the plot.
  
		  var energy = fourier.getEnergy(this.frequencyBins[currentBin]); // Get the energy for the current frequency.
		  this.needle(energy, x + w / 2, y + h); // Add the needle to the plot.
		  currentBin++; // Move to the next frequency bin.
		}
	  }
  
	  pop(); // Restore the previous drawing state.
	};
  
	// Draws a needle to an individual plot.
	this.needle = function(energy, centreX, bottomY) {
	  push(); // Save the current drawing state.
	  stroke('#333333'); // Set the stroke color for the needle.
	  translate(centreX, bottomY); // Translate so 0 is at the bottom of the needle.
	  var theta = map(energy, 0, 255, minAngle, maxAngle); // Map the energy to the angle for the plot.
	  var x = this.dialRadius * cos(theta); // Calculate x coordinate from angle for the length of needle.
	  var y = this.dialRadius * sin(theta); // Calculate y coordinate from angle for the length of needle.
	  line(0, 0, x, y); // Draw the needle.
	  pop(); // Restore the previous drawing state.
	};
  
	// Draw the graph ticks on an individual plot.
	this.ticks = function(centreX, bottomY, freqLabel) {
	  var nextTickAngle = minAngle; // Start angle for the first tick.
	  push(); // Save the current drawing state.
	  stroke('#333333'); // Set the stroke color for the ticks.
	  fill('#333333'); // Set the fill color for the text.
	  translate(centreX, bottomY); // Translate to the center bottom of the plot.
	  arc(0, 0, 20, 20, PI, 2 * PI); // Draw the semi-circle for the bottom of the needle.
	  textAlign(CENTER); // Align text to be centered.
	  textSize(12); // Set the text size.
	  text(freqLabel, 0, -(this.plotHeight / 2)); // Draw the frequency label.
  
	  // Draw 9 ticks from PI to 2PI.
	  for (var i = 0; i < 9; i++) {
		var x = this.dialRadius * cos(nextTickAngle); // x coordinate for the tick.
		var x1 = (this.dialRadius - 5) * cos(nextTickAngle); // x coordinate for the inner end of the tick.
		var y = this.dialRadius * sin(nextTickAngle); // y coordinate for the tick.
		var y1 = (this.dialRadius - 5) * sin(nextTickAngle); // y coordinate for the inner end of the tick.
		line(x, y, x1, y1); // Draw the tick.
		nextTickAngle += PI / 10; // Increment the angle for the next tick.
	  }
	  pop(); // Restore the previous drawing state.
	};
  }
  