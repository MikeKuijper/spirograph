// let wipers = [{r: 1.5, speed: 5, angle: 0},
//   {r: 1 / 3, speed: 1, angle: 0},
//   {r: 1 / 4, speed: 5, angle: 0}];
let wipers = [];
let k;
let canvas;
let started = false;
let n = 3;

function start() {
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

  started = true;
}

function setup() {
  canvas = createCanvas(900, 800);
  canvas.position((windowWidth - width) / 2);
  canvas.parent('sketch-holder');
  k = height / 5;

  makeForm(n);
}

function draw() {
  canvas.position((windowWidth - width) / 2);
  updateTextInput();

  if (started) {
    background(255);
    translate(width / 2, height / 2);
    angleMode(DEGREES);

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
    }
    trace();

    for (let j in wipers) {
      wipers[j].angle += wipers[j].speed * 0.45;
    }
  }
}

let history = [];

function trace() {
  for (let l in history) {
    if (history[l - 1]) {
      stroke(70, 255, 50);
      line(history[l].x * k / 2, history[l].y * k / 2, history[l - 1].x * k / 2, history[l - 1].y * k / 2);
    }
  }

  if (history.length > 2000) {
    history.shift();
  }
}

// function createForm(n) {
//   for (let a = 0; a < n; a++) {
//     var element1 = document.createElement("input");
//     element1.setAttribute("class", "numberInput");
//     element1.setAttribute("type", "number");
//     element1.setAttribute("id", `formEntry-Length-${a}`);
//     element1.setAttribute("value", "4000");
//     var elementA = document.getElementById("settings");
//     elementA.appendChild(element1);
//
//     var element2 = document.createElement("input");
//     element2.setAttribute("class", "numberInput");
//     element2.setAttribute("type", "number");
//     element2.setAttribute("id", `formEntry-Speed-${a}`);
//     element2.setAttribute("value", "4000");
//     var elementB = document.getElementById("settings");
//     elementB.appendChild(element2);
//
//     var element3 = document.createElement("input");
//     element3.setAttribute("class", "numberInput");
//     element3.setAttribute("type", "number");
//     element3.setAttribute("id", `formEntry-Angle-${a}`);
//     element3.setAttribute("value", "4000");
//     var elementC = document.getElementById("settings");
//     elementC.appendChild(element3);
//     let endline = document.createElement("br");
//     elementC.appendChild(endline);
//   }
// }

let form = [];

function makeForm(n) {
  for (let a = 0; a < n; a++) {
    createP("Segment " + (a + 1)).parent("settings");
    let lengthSlider = createSlider(0, 300, 150);
    lengthSlider.parent("settings");

    var lengthText = document.createElement("input");
    lengthText.setAttribute("class", "numberInput");
    lengthText.setAttribute("type", "number");
    lengthText.setAttribute("id", `lengthText-${a}`);
    lengthText.setAttribute("value", lengthSlider.value()/100);
    var elementA = document.getElementById("settings");
    elementA.appendChild(lengthText);

    let speedSlider = createSlider(-500, 500, 10);
    speedSlider.parent("settings");

    var speedText = document.createElement("input");
    speedText.setAttribute("class", "numberInput");
    speedText.setAttribute("type", "number");
    speedText.setAttribute("id", `speedText-${a}`);
    speedText.setAttribute("value", speedSlider.value()/10);
    elementA.appendChild(speedText);

    let angleSlider = createSlider(-180, 180, 0);
    angleSlider.parent("settings");

    var angleText = document.createElement("input");
    angleText.setAttribute("class", "numberInput");
    angleText.setAttribute("type", "number");
    angleText.setAttribute("id", `angleText-${a}`);
    angleText.setAttribute("value", angleSlider.value());
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
    form[x].lengthText.setAttribute("value", form[x].length.value()/100);
    form[x].speedText.setAttribute("value", form[x].speed.value()/10);
    form[x].angleText.setAttribute("value", form[x].angle.value());
  }
}
