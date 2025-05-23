// Class to manage user controls and input for a visualization application.
class ControlsAndInput {
	// Constructor initializes the control panel and its components.
	constructor() {
	  this.menuDisplayed = false; // Boolean to track if the menu is displayed.
	  this.playbackButton = new PlaybackButton(); // Instance of PlaybackButton for play/pause functionality.
	  this.updateMenuLayout(); // Call to set up the menu layout based on the current canvas size.
	}
  
	// Method to update the layout of the menu based on the canvas size.
	updateMenuLayout() {
	  this.columnWidth = width / 3; // Width of each column in the menu.
	  this.menuWidth = this.columnWidth * 2; // Total width of the menu.
	  this.startX = (width - this.menuWidth) / 2; // X position to start drawing the menu.
	  this.startY = 100; // Y position to start drawing the menu.
	  this.itemHeight = 50; // Height of each item in the menu.
	  // Total height of the menu, calculated based on the number of items and padding.
	  this.menuHeight = (this.itemHeight * Math.ceil(vis.visuals.length / 2)) + 20;
	  this.fontSize = width / 35; // Font size for the menu text, responsive to canvas width.
	}
  
	// Method to draw the controls and menu on the canvas.
	draw() {
	  push(); // Isolates the following style settings from the rest of the sketch.
	  textSize(this.fontSize); // Sets the font size for text elements.
	  textAlign(CENTER, CENTER); // Aligns text to be centered.
  
	  this.playbackButton.draw(); // Calls the draw method of the playback button.
  
	  // Conditionally draws the menu if it is set to be displayed.
	  if (this.menuDisplayed) {
		this.drawMenu(); // Calls the method to draw the menu.
	  }
	  pop(); // Restores previous style settings.
	}
  
	// Method to draw the menu for selecting visualizations.
	drawMenu() {
	  fill('#FFF'); // Sets the fill color for the menu background.
	  noStroke(); // Disables stroke for shapes.
	  let title = 'Select a visualization:'; // Title text for the menu.
	  let titleWidth = textWidth(title) + 40; // Width of the title box.
	  let titleHeight = this.fontSize + 20; // Height of the title box.
	  let boxX = (width - titleWidth) / 2; // X position for the title box.
	  let boxY = this.startY - titleHeight - 10; // Y position for the title box.
  
	  rect(boxX, boxY, titleWidth, titleHeight, titleHeight / 2); // Draws the title box.
  
	  fill('#333'); // Sets the fill color for the title text.
	  text(title, width / 2, boxY + titleHeight / 2); // Draws the title text.
  
	  fill('#FFF'); // Sets the fill color for the menu box.
	  let menuX = (width - this.menuWidth) / 2; // X position for the menu box.
	  let menuY = this.startY; // Y position for the menu box.
	  rect(menuX, menuY, this.menuWidth, this.menuHeight, 20); // Draws the menu box.
  
	  // Loops through each visualization option and displays it in the menu.
	  for (let i = 0; i < vis.visuals.length; i++) {
		let column = i % 2; // Determines the column for the current item based on its index.
		let xLoc = menuX + (column * this.columnWidth) + (this.columnWidth / 2); // X position for the item text.
		let yLoc = menuY + Math.floor(i / 2) * this.itemHeight + (this.itemHeight / 2); // Y position for the item text.
		fill('#333'); // Sets the fill color for the item text.
		// Draws the item text with its index and name.
		text((i + 1) + ': ' + vis.visuals[i].name, xLoc, yLoc);
	  }
	}
  
	// Method to handle mouse press events.
	mousePressed() {
	  // Checks if the playback button was pressed.
	  if (!this.playbackButton.hitCheck()) {
		let fs = fullscreen(); // Gets the current fullscreen state.
		fullscreen(!fs); // Toggles the fullscreen state.
		this.updateMenuLayout(); // Updates the menu layout to match the new canvas size.
	  }
	}
  
	// Method to handle key press events.
	keyPressed() {
	  if (keyCode === 32) { // Checks if the spacebar was pressed.
		this.menuDisplayed = !this.menuDisplayed; // Toggles the display of the menu.
	  } else if (keyCode > 48 && keyCode < 58) { // Checks if number keys (1-9) were pressed.
		let visNumber = keyCode - 49; // Converts the key code to an array index.
		// Checks if the selected index is within the range of available visualizations.
		if (visNumber >= 0 && visNumber < vis.visuals.length) {
		  vis.selectVisual(vis.visuals[visNumber].name); // Selects the visualization based on the pressed key.
		}
	  }
	}
  }
  