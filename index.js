// Import p5.js and define the sketch
new p5((sketch) => {
  let f = 0; // Animation variable for dynamic movements
  let canvasSize; // Variable to store canvas size for responsiveness

  function randomRange(min, max) {
    return min + $fx.rand() * (max - min);
  }
  let increments = {};
  // Define numbers and their weights for different animation speeds
  const numbers = [
    {
      name: "Low",
      weight: 25,
      increment: sketch.PI / (increments["Low"] = randomRange(2, 10)),
    },
    {
      name: "Mid",
      weight: 25,
      increment: sketch.PI / (increments["Mid"] = randomRange(14, 30)),
    },
    {
      name: "High",
      weight: 25,
      increment: sketch.PI / (increments["High"] = randomRange(40, 80)),
    },
    {
      name: "Extreme",
      weight: 25,
      increment: sketch.PI / (increments["Extreme"] = randomRange(100, 300)),
    },
  ];

  // Define color palettes and their weights
  const colorPalettes = [
    {
      name: "8bit",
      weight: 20,
      colors: {
        bg: "#000000",
        outerDots: "#FF0000",
        middleDots: "#00FF00",
        innerDots: "#0000FF",
        lineStroke: "#FFFFFF", // Added lineStroke color
      },
    },
    {
      name: "IceCream",
      weight: 20,
      colors: {
        bg: "#80ffdb",
        outerDots: "#72efdd",
        middleDots: "#4ea8de",
        innerDots: "#7400b8",
        lineStroke: "#000000", // Added lineStroke color
      },
    },
    {
      name: "Hacker",
      weight: 20,
      colors: {
        bg: "#0F3D0F",
        outerDots: "#127212",
        middleDots: "#00FF00",
        innerDots: "#ADEBAD",
        lineStroke: "#00FF00", // Added lineStroke color
      },
    },
    {
      name: "BlueSky",
      weight: 20,
      colors: {
        bg: "#87CEEB",
        outerDots: "#90e0ef",
        middleDots: "#3a86ff",
        innerDots: "#F0F8FF",
        lineStroke: "#ADD8E6", // Added lineStroke color
      },
    },
    {
      name: "Monochrome",
      weight: 20,
      colors: {
        bg: "#000000",
        outerDots: "#333333",
        middleDots: "#666666",
        innerDots: "#FFD700",
        lineStroke: "#FFFFFF", // Added lineStroke color
      },
    },
  ];

  // Function to randomly select based on weights, using fx(hash) randomness
  function weightedRandomSelection(options) {
    let totalWeight = options.reduce(
      (total, option) => total + option.weight,
      0
    );
    let random = $fx.rand() * totalWeight;
    for (let i = 0; i < options.length; i++) {
      if (random < options[i].weight) {
        return options[i];
      }
      random -= options[i].weight;
    }
    return options[0];
  }

  // Select a number and a color palette randomly
  const selectedNumber = weightedRandomSelection(numbers);
  const selectedPalette = weightedRandomSelection(colorPalettes);

  // Report selected features
  $fx.features({
    Numbers: selectedNumber.name,
    IncrementValue: increments[selectedNumber.name].toFixed(2),
    ColorPalette: selectedPalette.name,
  });

  // Setup sketch
  sketch.setup = function () {
    canvasSize = sketch.min(sketch.windowWidth, sketch.windowHeight);
    sketch.createCanvas(canvasSize, canvasSize);
    sketch.loop();
  };

  // Handle window resizing
  sketch.windowResized = function () {
    canvasSize = sketch.min(sketch.windowWidth, sketch.windowHeight);
    sketch.resizeCanvas(canvasSize, canvasSize);
  };

  // Draw function for animations
  sketch.draw = function () {
    sketch.background(selectedPalette.colors.bg);
    sketch.stroke(selectedPalette.colors.lineStroke);
    let centerX = canvasSize / 2;
    let centerY = canvasSize / 2;
    let maxRadius = canvasSize / 2.35;

    for (let i = 0; i < sketch.TAU; i += selectedNumber.increment) {
      let r = maxRadius / 2;
      let x = sketch.sin(f + i) * r + centerX;
      let y = sketch.cos(f + i) * r + centerY;
      sketch.fill(selectedPalette.colors.innerDots);
      sketch.circle(x, y, canvasSize * 0.015);

      r = maxRadius;
      let X = sketch.sin(f + i) * r + centerX;
      let Y = sketch.cos(f + i) * r + centerY;
      X = sketch.constrain(X, centerX - maxRadius / 2, centerX + maxRadius / 2);
      Y = sketch.constrain(Y, centerY - maxRadius / 2, centerY + maxRadius / 2);
      sketch.fill(selectedPalette.colors.middleDots);
      sketch.line(x, y, X, Y);
      sketch.circle(X, Y, canvasSize * 0.015);

      x = sketch.sin(f + i) * r + centerX;
      y = sketch.cos(f + i) * r + centerY;
      sketch.fill(selectedPalette.colors.outerDots);
      sketch.line(x, y, X, Y);
      sketch.circle(x, y, canvasSize * 0.015);
    }

    f += 0.01; // Increment the frame animation variable
  };
});

function updateDOM() {
  // Update DOM only if necessary or during specific interactions
  const bgcolor = "#000000"; // Using a fixed background for simplicity
  const textcolor = "#ffffff";
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
