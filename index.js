// Import p5.js
new p5((sketch) => {
  let f = 0; // Animation variable
  let canvasSize;

  // Define numbers and their weights using fx(hash) random parameters
  const numbers = [
    { name: "Low", weight: 10, increment: sketch.PI / 28 },
    { name: "Mid", weight: 60, increment: sketch.PI / 14 },
    { name: "High", weight: 15, increment: sketch.PI / 7 },
    { name: "Extreme", weight: 5, increment: sketch.PI / 3.5 },
  ];

  function weightedRandomSelection(options) {
    let totalWeight = options.reduce(
      (total, option) => total + option.weight,
      0
    );
    let random = Math.random() * totalWeight; // Consider using $fx.random() for blockchain-based randomness
    for (let i = 0; i < options.length; i++) {
      if (random < options[i].weight) {
        return options[i];
      }
      random -= options[i].weight;
    }
    return options[0]; // Fallback if something goes wrong
  }

  const selectedNumber = weightedRandomSelection(numbers);

  sketch.setup = function () {
    canvasSize = sketch.min(sketch.windowWidth, sketch.windowHeight);
    sketch.createCanvas(canvasSize, canvasSize);
    sketch.stroke(255);
    sketch.loop();
  };

  sketch.windowResized = function () {
    canvasSize = sketch.min(sketch.windowWidth, sketch.windowHeight);
    sketch.resizeCanvas(canvasSize, canvasSize);
  };

  sketch.draw = function () {
    sketch.background(0);
    let centerX = canvasSize / 2;
    let centerY = canvasSize / 2;
    let maxRadius = canvasSize / 2.35;

    for (let i = 0; i < sketch.TAU; i += selectedNumber.increment) {
      let r = maxRadius / 2;
      let x = sketch.sin(f + i) * r + centerX;
      let y = sketch.cos(f + i) * r + centerY;
      sketch.circle(x, y, canvasSize * 0.015);

      r = maxRadius;
      let X = sketch.sin(f + i) * r + centerX;
      let Y = sketch.cos(f + i) * r + centerY;
      X = sketch.constrain(X, centerX - maxRadius / 2, centerX + maxRadius / 2);
      Y = sketch.constrain(Y, centerY - maxRadius / 2, centerY + maxRadius / 2);
      sketch.line(x, y, X, Y);
      sketch.circle(X, Y, canvasSize * 0.015);

      x = sketch.sin(f + i) * r + centerX;
      y = sketch.cos(f + i) * r + centerY;
      sketch.line(x, y, X, Y);
      sketch.circle(x, y, canvasSize * 0.015);
    }

    f += 0.01;
  };
});

function updateDOM() {
  const bgcolor = "#000000";
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

// Initiate the main drawing function after the DOM is updated
updateDOM();
