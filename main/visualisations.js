class Visualisations {
	constructor() {
	  this.visuals = []; // Array to store visualisations
	  this.selectedVisual = null; // Currently selected vis. set to null until vis loaded in
	}
  
	// Add a new visualisation to the array
	// @param vis: a visualisation object
	add(vis) {
	  this.visuals.push(vis);
	  // If selectedVisual is null, set the new visual as the current visualisation
	  if (this.selectedVisual === null) {
		this.selectVisual(vis.name);
	  }
	}
  
	// Select a visualisation using its name property
	// @param visName: name property of the visualisation
	selectVisual(visName) {
	  const foundVisual = this.visuals.find(visual => visual.name === visName);
	  if (foundVisual) {
		this.selectedVisual = foundVisual;
	  }
	}
  }
  