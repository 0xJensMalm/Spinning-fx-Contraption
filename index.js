// Import p5.js and define the sketch
new p5((sketch) => {
  let f = 0; // Animation variable for dynamic movements
  let canvasSize; // Variable to store canvas size for responsiveness
  let randomStartEnabled = $fx.rand() < 0.5; // Set this based on your dynamic needs or keep it static
  let startAngle = randomStartEnabled ? $fx.rand() * sketch.TAU : 0; // Calculate once

  function randomRange(min, max) {
    return min + $fx.rand() * (max - min);
  }
  let increments = {};
  // Define numbers and their weights for different animation speeds
  const numbers = [
    {
      name: "low",
      weight: 30,
      increment: sketch.PI / (increments["low"] = randomRange(2, 10)),
    },
    {
      name: "mid",
      weight: 30,
      increment: sketch.PI / (increments["mid"] = randomRange(10, 20)),
    },
    {
      name: "high",
      weight: 30,
      increment: sketch.PI / (increments["high"] = randomRange(20, 60)),
    },
    {
      name: "extreme",
      weight: 10,
      increment: sketch.PI / (increments["extreme"] = randomRange(100, 300)),
    },
  ];

  // Define color palettes and their weights
  const colorPalettes = [
    {
      name: "Retro",
      weight: 20,
      colors: {
        bg: "#F4D03F", // Mustard Yellow background
        outerDots: "#D35400", // Burnt Orange for outer dots
        middleDots: "#2980B9", // Retro Blue for middle dots
        innerDots: "#F39C12", // Golden Yellow for inner dots
        lineStroke: "#CD6155", // Soft Red for line strokes
      },
    },
    {
      name: "icecream",
      weight: 20,
      colors: {
        bg: "#80ffdb",
        outerDots: "#F39C12",
        middleDots: "#4ea8de",
        innerDots: "#7400b8",
        lineStroke: "#000000", // Added lineStroke color
      },
    },
    {
      name: "forest",
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
      name: "bluesky",
      weight: 20,
      colors: {
        bg: "#87CEEB",
        outerDots: "#90e0ef",
        middleDots: "#3a86ff",
        innerDots: "#F0F8FF",
        lineStroke: "#F0F8FF", // Added lineStroke color
      },
    },
    {
      name: "monochrome",
      weight: 5,
      colors: {
        bg: "#000000",
        outerDots: "#333333",
        middleDots: "#666666",
        innerDots: "#FFD700",
        lineStroke: "#FFFFFF", // Added lineStroke color
      },
    },
    {
      name: "sunset",
      weight: 20,
      colors: {
        bg: "#FFDAB9", // Peach background
        outerDots: "#FF6347", // Tomato for outer dots
        middleDots: "#FF4500", // OrangeRed for middle dots
        innerDots: "#DB7093", // PaleVioletRed for inner dots
        lineStroke: "#FA8072", // Salmon for line strokes
      },
    },
    {
      name: "blueprint",
      weight: 20,
      colors: {
        bg: "#D6EAF8", // Light Sky Blue background
        outerDots: "#2980B9", // Blueprint Blue for outer dots
        middleDots: "#21618C", // Dark Blueprint Blue for middle dots
        innerDots: "#90e0ef", // Deep Ocean Blue for inner dots
        lineStroke: "#154360", // Navy Blue for line strokes
      },
    },
    {
      name: "neon",
      weight: 20,
      colors: {
        bg: "#000000", // Black background to highlight neon colors
        outerDots: "#FFD700", // Gold for outer dots
        middleDots: "#4B0082", // Indigo for middle dots
        innerDots: "#00FF00", // Lime for inner dots
        lineStroke: "#FF00FF", // Magenta for line strokes
      },
    },
    {
      name: "fiesta",
      weight: 20,
      colors: {
        bg: "#FF6347", // Tomato background
        outerDots: "#FFD700", // Gold for outer dots
        middleDots: "#32CD32", // LimeGreen for middle dots
        innerDots: "#00BFFF", // DeepSkyBlue for inner dots
        lineStroke: "#FFD700", // OrangeRed for line strokes
      },
    },
    {
      name: "space",
      weight: 20,
      colors: {
        bg: "#0B0C10", // Deep Space Black for background
        outerDots: "#1F2833", // Dark Grey mimicking the quiet of space for outer dots
        middleDots: "#C5C6C7", // Light Grey representing distant stars for middle dots
        innerDots: "#66FCF1", // Electric Cyan for inner dots, reminiscent of pulsar stars
        lineStroke: "#45A29E", // Teal Blue for line strokes, adding a vibrant touch
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
    range: selectedNumber.name,
    n: Math.round(increments[selectedNumber.name]),
    palette: selectedPalette.name,
    spiraling: randomStartEnabled ? "true" : "false",
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

    f += 0.01; // Increment the frame animation variable

    for (let i = 0; i < sketch.TAU; i += selectedNumber.increment) {
      let r = maxRadius / 2;
      let x = sketch.sin(f + i + startAngle) * r + centerX;
      let y = sketch.cos(f + i + startAngle) * r + centerY;
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
