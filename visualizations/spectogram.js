class Spectogram {
  // Constructor initializes the spectogram with default settings
  constructor() {
    this.name = "spectogram"; // Name of the spectogram
    this.onResize(); // Calls the onResize method to set initial dimensions
  }

  // Called when the spectogram needs to adjust its size
  onResize() {
    this.unit = height / 4; // Sets the unit size relative to the canvas height
    this.cx = width / 4; // Sets the center x-coordinate relative to the canvas width
    this.cy = height / 4; // Sets the center y-coordinate relative to the canvas height
  }

  // Method to draw the spectogram on the canvas
  draw() {
    scale(constant); // Scales the drawing by a constant factor
    push(); // Saves the current drawing state
    noStroke(); // Disables drawing outlines for shapes
    let cells = 2048; // Number of cells in the spectogram

    // Converts polar coordinates to Cartesian and plots a vertex
    function vertexPolar(radius, angle){
      let x = sin(angle); // Calculate the x-component
      let y = cos(angle); // Calculate the y-component
      vertex(radius*x + width/2, radius*y + height/2); // Plot the vertex
    }

    // Calculates the octave of a frequency
    function octave(freq){
      return log(freq, 2); // Returns the base-2 logarithm of the frequency
    }

    // Calculates the note value of a frequency
    function note(freq){
      let calibration = 9.065; // Calibration constant
      let match = calibration / (2* PI); // Adjusts the calibration for the note calculation
      return log(freq, 2) * match; // Returns the adjusted note value
    }

    // Generates a color based on a value
    function colorramp(val){
      let from = color(0, 0, 0, 255); // Starting color (black)
      let to = color(255, 0, 64, 255); // Ending color (reddish)

      // The following lines modify the input value to create a color gradient effect
      let spec = val;
      let spec0 = spec;
      spec *= spec * 0.8 + 0.2;
      spec = 2 * spec - 0.8;

      let spec2 = spec * spec;
      let spec3 = 1 - spec;
      spec3 = spec3 * spec3 * spec3;
      let rd = spec * 3;
      let bl = (spec3 * 3 - 2) * (10 * spec);
      let grn = spec2 * 3 - 0.5;

      // Ensures the RGB values are within the valid range
      if (rd < 0) rd = 0;
      if (spec < 0) grn = 0;

      // Interpolates between the starting and ending colors based on the modified value
      let color1 = lerpColor(from, to, spec0 * 1);
      let color2 = color(255 * rd, 255 * grn, 255 * bl);
      return lerpColor(color1, color2, .6); // Returns the final color
    }

    // Analyzes the audio and returns an array representing the spectrum
    var spectrum = fourier.analyze();
    var amount = cells / 2048 * spectrum.length; // Determines the number of cells to display based on the spectrum length

    // The following variables are used to calculate the dimensions and positions of the cells
    var cell_width = 1.0;
    var cell_depth = 1.0;
    var calibration = 9.065;
    var match = calibration / (2* PI);
    var rmax = note(spectrum.length)+1;
    var sw = this.unit /rmax;

    // Maps the first spectrum value to a range and sets the fill color
    var spec = map(spectrum[0], 0, 255, 0, 1);
    fill(colorramp(spec));
    var r_null = 2*match*sw*cell_depth;
    ellipse(width/2, height/2, r_null, r_null); // Draws an ellipse at the center

    // Loops through the spectrum to draw each cell
    for (let n = 0; Math.pow(2, n) < amount; n++) {
      for (let i = Math.pow(2, n); i < Math.pow(2, n + 1) && i < amount; i++) {
        spec = map(spectrum[i], 0, 255, 0, 1); // Maps the spectrum value to a range
        fill(colorramp(spec)); // Sets the fill color based on the spectrum value

        // The following variables calculate the positions for the vertices of the cells
        let freq = i;
        let freq2 = freq + 0.5;
        let oct = 2 * PI * note(freq2 - 0.5 * cell_width);
        let oct2 = 2 * PI * note(freq2 + 0.5 * cell_width);

        let ro = sw * (octave(freq2 - 0.5 * cell_width) * match + cell_depth);
        let ri = sw * octave(freq2 - 0.5 * cell_width) * match;

        let ro2 = sw * (octave(freq2 + 0.5 * cell_width) * match + cell_depth);
        let ri2 = sw * octave(freq2 + 0.5 * cell_width) * match;

        fill(colorramp(spec)); // Sets the fill color for the cell

        // Determines the number of slices for the cell shape
        var minslices = 4;
        var slice_amt_i = Math.pow(2,n-2)/minslices;
        var slice_amt_o = slice_amt_i *0.5;
        if(slice_amt_o>0.5)slice_amt_o=0.5;

        // Draws the shape for the frequency bin
        noStroke(); // Disables outlines
        beginShape(); // Begins a new shape
        vertexPolar(ro,oct); // Sets the first vertex
        // Loops to create the outer edge of the cell
        for(let slice=slice_amt_o; slice<1.0; slice+=slice_amt_o){
          vertexPolar(lerp(ro,ro2,slice),lerp(oct,oct2,slice));
        }
        vertexPolar(ro2,oct2); // Sets the vertex at the other end of the outer edge
        
        vertexPolar(ri2,oct2); // Sets the first vertex of the inner edge
        // Loops to create the inner edge of the cell
        for(let slice=slice_amt_i; slice<1.0; slice+=slice_amt_i){
          vertexPolar(lerp(ri2,ri,slice),lerp(oct2,oct,slice));
        }
        vertexPolar(ri,oct); // Sets the last vertex of the inner edge
        endShape(); // Finishes the shape
      }
    }
    pop(); // Restores the previous drawing state
  }
}
