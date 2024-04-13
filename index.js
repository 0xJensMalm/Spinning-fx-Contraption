function main() {
  new p5((sketch) => {
    let f = 0; // Animation variable
    let canvasSize;

    // Define rules and their weights
    const rules = [
      { name: "Low", weight: 10, increment: sketch.PI / 5 }, // Less frequent iterations
      { name: "Mid", weight: 60, increment: sketch.PI / 16 }, // Default value
      { name: "High", weight: 15, increment: sketch.PI / 40 }, // More frequent iterations
      { name: "Extreme", weight: 5, increment: sketch.PI / 500 }, // Very frequent iterations
    ];

    // Function to randomly select a rule based on weights
    function weightedRandomSelection(options) {
      let totalWeight = options.reduce(
        (total, option) => total + option.weight,
        0
      );
      let random = Math.random() * totalWeight;
      for (let i = 0; i < options.length; i++) {
        if (random < options[i].weight) {
          return options[i];
        }
        random -= options[i].weight;
      }
      return options[0]; // Fallback if something goes wrong
    }

    // Select a rule randomly based on the defined weights
    const selectedRule = weightedRandomSelection(rules);

    // Setup the sketch with responsive canvas
    sketch.setup = function () {
      canvasSize = sketch.min(sketch.windowWidth, sketch.windowHeight);
      sketch.createCanvas(canvasSize, canvasSize);
      sketch.stroke(255);
      sketch.loop(); // Ensure continuous looping for animation
    };

    // Adjust the canvas size when the window is resized
    sketch.windowResized = function () {
      canvasSize = sketch.min(sketch.windowWidth, sketch.windowHeight);
      sketch.resizeCanvas(canvasSize, canvasSize);
    };

    // Draw function that animates the sketch responsively
    sketch.draw = function () {
      sketch.background(0);
      let centerX = canvasSize / 2;
      let centerY = canvasSize / 2;
      let maxRadius = canvasSize / 2.35; // Adjusted for visual aesthetics

      for (let i = 0; i < sketch.TAU; i += selectedRule.increment) {
        // Calculate movement for the inner circle points
        let r = maxRadius / 2;
        let x = sketch.sin(f + i) * r + centerX;
        let y = sketch.cos(f + i) * r + centerY;
        sketch.circle(x, y, canvasSize * 0.015); // Scale circle size

        // Calculate movement for points on the square
        r = maxRadius;
        let X = sketch.sin(f + i) * r + centerX;
        let Y = sketch.cos(f + i) * r + centerY;
        X = sketch.constrain(
          X,
          centerX - maxRadius / 2,
          centerX + maxRadius / 2
        );
        Y = sketch.constrain(
          Y,
          centerY - maxRadius / 2,
          centerY + maxRadius / 2
        );
        sketch.line(x, y, X, Y);
        sketch.circle(X, Y, canvasSize * 0.015); // Scale circle size

        // Calculate movement for the outer circle points
        x = sketch.sin(f + i) * r + centerX;
        y = sketch.cos(f + i) * r + centerY;
        sketch.line(x, y, X, Y);
        sketch.circle(x, y, canvasSize * 0.015); // Scale circle size
      }

      f += 0.01; // Increment the frame animation variable
    };
  });

  updateDOM();
}

function updateDOM() {
  const bgcolor = "#000000"; // Default to black background for DOM
  const textcolor = "#ffffff"; // Default text color
  document.body.style.background = bgcolor;
  document.body.innerHTML = `
    <div style="color: ${textcolor};">
      <p>hash: ${$fx.hash}</p>
      <p>minter: ${$fx.minter}</p>
      <p>iteration: ${$fx.iteration}</p>
      <p>inputBytes: ${$fx.inputBytes}</p>
      <p>context: ${$fx.context}</p>
      <p>params:</p>
      <pre>${$fx.stringifyParams($fx.getRawParams())}</pre>
    </div>
  `;
}

main();
