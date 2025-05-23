// Class representing a star with variable brightness and size.
class Star {
  // Constructor initializes the star with random position and size.
  constructor() {
    this.x = random(width); // Random x position within the canvas width.
    this.y = random(height); // Random y position within the canvas height.
    this.baseSize = random(1, 3); // Base size of the star.
    this.size = this.baseSize; // Current size of the star, starts at base size.
    this.sensitivity = random(0.5, 1.5); // Sensitivity to sound amplitude.
  }

  // Updates the star's size based on the sound amplitude level.
  update(amplitudeLevel) {
    // Increase the star's size based on its sensitivity and the amplitude level.
    this.size = this.baseSize + (amplitudeLevel * this.sensitivity * 5);
  }

  // Renders the star on the canvas.
  show() {
    noStroke(); // Stars do not have an outline.
    fill(255, this.size * 50); // Set the brightness based on the size.
    ellipse(this.x, this.y, this.size); // Draw the star as an ellipse.
  }
}

// Class representing a planet with orbiting rings.
class Planet {
  // Constructor initializes the planet with random properties.
  constructor() {
    this.angle = random(TWO_PI); // Starting angle for the orbit.
    this.distance = random(50, 200); // Distance from the orbit center.
    this.size = random(10, 30); // Size of the planet.
    this.orbitSpeed = random(0.01, 0.05); // Speed of the orbit.
    this.ringCount = floor(random(1, 4)); // Number of rings around the planet.
  }

  // Updates the planet's orbit and size based on the sound amplitude level.
  update(amplitudeLevel) {
    this.angle += this.orbitSpeed; // Increment the orbit angle.
    // Dynamically map the amplitude level to the planet's size.
    this.size = map(amplitudeLevel, 0, 1, 10, 50);
  }

  // Renders the planet and its rings on the canvas.
  show(centerX, centerY) {
    // Calculate the planet's current position based on its orbit.
    let x = centerX + this.distance * cos(this.angle);
    let y = centerY + this.distance * sin(this.angle);
  
    // Draw the front half of the rings.
    for (let i = 0; i < this.ringCount; i++) {
      let ringSize = this.size + (20 * (i + 1)); // Calculate the ring size.
      let ringThickness = 5 + i; // Calculate the ring thickness.
      // Create a gradient color for the rings.
      let gradient = lerpColor(color(232, 160, 176), color(107, 10, 32), 0.6);
  
      stroke(gradient); // Set the ring color.
      strokeWeight(ringThickness); // Set the ring thickness.
      noFill(); // Rings are only outlines.
      // Draw the top half of the ring as an arc.
      arc(x, y, ringSize, ringSize / 2, 0, PI);
    }
  
    // Draw the planet itself.
    fill(107, 10, 32); // Set the planet color.
    noStroke(); // The planet has no outline.
    // Draw the planet as an oval, taller and wider than its size.
    ellipse(x, y, this.size * 1.5, this.size * 2);
  
    // Draw the back half of the rings.
    for (let i = 0; i < this.ringCount; i++) {
      let ringSize = this.size + (20 * (i + 1)); // Calculate the ring size.
      let ringThickness = 5 + i; // Calculate the ring thickness.
      // Reuse the gradient color for the back half of the rings.
      let gradient = lerpColor(color(232, 160, 176), color(107, 10, 32), 0.6);
  
      stroke(gradient); // Set the ring color.
      strokeWeight(ringThickness); // Set the ring thickness.
      noFill(); // Rings are only outlines.
      // Draw the bottom half of the ring as an arc.
      arc(x, y, ringSize, ringSize / 2, PI, TWO_PI);
    }
  }
}

// Class representing a galaxy with stars and planets.
class Galaxy {
  // Constructor initializes the galaxy with a name and empty arrays for stars and planets.
  constructor() {
    this.name = "galaxy"; // Name of the galaxy.
    this.stars = []; // Array to hold the stars.
    this.planets = []; // Array to hold the planets.
    this.setup(); // Call the setup method to populate the galaxy.
  }

  // Setup method populates the galaxy with stars and planets.
  setup() {
    // Create 100 stars and add them to the stars array.
    for (let i = 0; i < 100; i++) {
      this.stars.push(new Star());
    }
    // Create 5 planets and add them to the planets array.
    for (let i = 0; i < 5; i++) {
      this.planets.push(new Planet());
    }
  }

  // Draw method renders the galaxy on the canvas.
  draw() {
    push(); // Save the current drawing state.
    background(0); // Set the background to black.
    // Get the current amplitude level from the sound.
    let level = amplitude.getLevel();

    // Update and show each star.
    this.stars.forEach(star => {
      star.update(level); // Update the star's size based on the amplitude.
      star.show(); // Render the star.
    });

    // Calculate the center of the canvas.
    let centerX = width / 2;
    let centerY = height / 2;
    // Update and show each planet.
    this.planets.forEach(planet => {
      planet.update(level); // Update the planet's orbit and size.
      planet.show(centerX, centerY); // Render the planet.
    });
    pop(); // Restore the previous drawing state.
  }

  // onResize method updates the positions of stars and planets when the canvas size changes.
  onResize() {
    // Update the position of each star.
    this.stars.forEach(star => {
      star.x = random(width); // New random x position.
      star.y = random(height); // New random y position.
    });

    // Update the orbit distance of each planet.
    this.planets.forEach(planet => {
      planet.distance = random(50, 200); // New random orbit distance.
    });
  }
}
