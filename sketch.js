let wipers = [];
let k;
let canvas;
let traceCanvas;
let started = false;
let n = 3;

function start() {
  let p5Canvas = document.getElementById('defaultCanvas0');
  p5Canvas.style.visibility = "";
  wipers.splice(0);
  history.splice(0);
  for (index in form) {
    wipers.push({
      r: form[index].length.value() / 100,
      speed: form[index].speed.value() / 10,
      angle: form[index].angle.value()
    });
  }
  print(wipers);
  window.scrollTo(0, document.body.scrollHeight);

  traceCanvas.clear();
  started = true;
}

function exportCanvas() {
  let h = hour();
  if (h < 10) h = 0 + h;
  let m = minute();
  if (m < 10) h = 0 + m;
  let s = second();
  if (s < 10) s = 0 + s;
  let string = `img ${day()}-${month()}-${year()} ${h}${m}${s}.png`
  save(traceCanvas, string);
}

function reset() {
  wipers.splice(0);
  history.splice(0);
  let p5Canvas = document.getElementById('defaultCanvas0');
  p5Canvas.style.visibility = "hidden";
}

function setup() {
  canvas = createCanvas(1000, 800);
  canvas.position((windowWidth - width) / 2);
  canvas.parent('sketch-holder');
  k = height / 5;

  traceCanvas = createGraphics(width, height);
  traceCanvas.clear();
  traceCanvas.translate(width / 2, height / 2);

  makeForm(n);
}

function draw() {
  canvas.position((windowWidth - width) / 2);

  if (started && wipers.length > 0) {
    background(255);
    translate(width / 2, height / 2);
    angleMode(DEGREES);

    imageMode(CENTER);
    image(traceCanvas, 0, 0);

    noFill();
    strokeWeight(4);
    stroke(0);
    point(0, 0);
    stroke(0, 0, 0, 20);

    let x = 0;
    let y = 0;
    let prevX = 0;
    let prevY = 0;
    for (let i in wipers) {
      push();
      translate(x * k / 2, y * k / 2);
      ellipse(0, 0, wipers[i].r * k, wipers[i].r * k);
      x += wipers[i].r * cos(wipers[i].angle);
      y += wipers[i].r * sin(wipers[i].angle);
      point(x, y);
      pop();

      stroke(0, 0, 0, 80);
      line(prevX * k / 2, prevY * k / 2, x * k / 2, y * k / 2);

      stroke(0);
      point(x * k / 2, y * k / 2);
      stroke(0, 0, 0, 20);

      prevX = x;
      prevY = y;
    }

    if (frameCount % 1 == 0) {
      history.push({
        x: x,
        y: y
      });
      if (history.length > 2) {
        history.shift();
      }
    }
    trace();

    for (let j in wipers) {
      for (let val = j; val < wipers.length; val++) {
        if (val < j) val = j;
        wipers[val].angle += wipers[j].speed * -0.45;
      }
    }
  }
}

let history = [];

function trace() {
  if (history.length > 1) {
    traceCanvas.stroke(70, 255, 50);
    traceCanvas.strokeWeight(4);
    traceCanvas.line(history[history.length - 1].x * k / 2, history[history.length - 1].y * k / 2, history[history.length - 2].x * k / 2, history[history.length - 2].y * k / 2);
  }
}

let form = [];

function makeForm(n) {
  for (let a = 0; a < n; a++) {
    let column = `column-${a}`;
    var elementA = document.getElementById(column);

    var label = document.createElement("h1");
    label.style.color = "#FFFFFF";
    label.innerText = "Segment " + (a + 1);
    var newline = document.createElement("br");
    elementA.appendChild(label);

    var label = document.createElement("label");
    label.style.color = "#FFFFFF";
    label.innerText = "Length";
    var newline = document.createElement("br");
    elementA.appendChild(label);
    elementA.appendChild(newline);

    let lengthSlider = createSlider(0, 300, 150);
    lengthSlider.elt.oninput = updateTextInput;
    lengthSlider.parent(column);

    var lengthText = document.createElement("input");
    lengthText.setAttribute("class", "numberInput");
    lengthText.setAttribute("type", "number");
    lengthText.setAttribute("id", `lengthText-${a}`);
    lengthText.setAttribute("value", lengthSlider.value() / 100);
    lengthText.setAttribute("min", 0);
    lengthText.setAttribute("max", 3);
    lengthText.setAttribute("onchange", "updateSlider()");
    elementA.appendChild(lengthText);

    var label = document.createElement("label");
    label.style.color = "#FFFFFF";
    label.innerText = "Speed";
    var newline = document.createElement("br");
    elementA.appendChild(label);
    elementA.appendChild(newline);

    let speedSlider = createSlider(-500, 500, 10);
    speedSlider.elt.oninput = updateTextInput;
    speedSlider.parent(column);

    var speedText = document.createElement("input");
    speedText.setAttribute("class", "numberInput");
    speedText.setAttribute("type", "number");
    speedText.setAttribute("id", `speedText-${a}`);
    speedText.setAttribute("value", speedSlider.value() / 10);
    speedText.setAttribute("min", -50);
    speedText.setAttribute("max", 50);
    speedText.setAttribute("onchange", "updateSlider()");
    elementA.appendChild(speedText);


    var label = document.createElement("label");
    label.style.color = "#FFFFFF";
    label.innerText = "Starting angle";
    var newline = document.createElement("br");
    elementA.appendChild(label);
    elementA.appendChild(newline);

    let angleSlider = createSlider(-180, 180, 0);
    angleSlider.elt.oninput = updateTextInput;
    angleSlider.parent(column);

    var angleText = document.createElement("input");
    angleText.setAttribute("class", "numberInput");
    angleText.setAttribute("type", "number");
    angleText.setAttribute("id", `angleText-${a}`);
    angleText.setAttribute("value", angleSlider.value());
    angleText.setAttribute("min", -180);
    angleText.setAttribute("max", 180);
    angleText.setAttribute("onchange", "updateSlider()");
    elementA.appendChild(angleText);

    form.push({
      "length": lengthSlider,
      "speed": speedSlider,
      "angle": angleSlider,
      "lengthText": lengthText,
      "speedText": speedText,
      "angleText": angleText
    });
  }
}

function updateTextInput() {

  for (x in form) {
    form[x].lengthText.value = form[x].length.value() / 100;
    form[x].speedText.value = form[x].speed.value() / 10;
    form[x].angleText.value = form[x].angle.value();
  }
}

function updateSlider() {

  for (x in form) {
    form[x].length.elt.value = form[x].lengthText.value * 100;
    form[x].speed.elt.value = form[x].speedText.value * 10;
    form[x].angle.elt.value = form[x].angleText.value;
  }
}
