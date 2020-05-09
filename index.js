window.addEventListener("load", init);

let labels, values, valuename, values2, value2name, color, outlineColor, color2, outlineColor2, chartType;
let verbose = false;
let options = {};

function init() {
  qs("#labels").addEventListener("change", setValues);
  qs("#values").addEventListener("change", setValues);
  qs("#valuename").addEventListener("change", setValues);
  qs("#values2").addEventListener("change", setValues);
  qs("#value2name").addEventListener("change", setValues);
  qs("#color").addEventListener("change", setValues);
  qs("#outlineColor").addEventListener("change", setValues);
  qs("#color2").addEventListener("change", setValues);
  qs("#outlineColor2").addEventListener("change", setValues);
  qs("#chartType").addEventListener("change", setValues);
  qs("#randomizer").addEventListener("click", randomize);
  qs("#borderThickness").addEventListener("click", setValues);
  qs("#pointRadius").addEventListener("click", setValues);
  qs("#fillChart").addEventListener("change", setValues);

  qs("#verbose").addEventListener("click", ()=>{ verbose = !verbose; logAll(); });
  setValues();
  randomize();
};

function updateChart() {
  if(verbose) {
    logAll();
  }

  let chart = qs("#chart");
  while(chart.firstChild) { chart.removeChild(chart.firstChild); }
  chart.appendChild(document.createElement("canvas"));
  let ctx = chart.querySelector("canvas").getContext("2d");

  let datasets = [
    {
      label: valuename,
      backgroundColor: color,
      borderColor: outlineColor,
      data: values,
      fill: options.fill,
      borderWidth: options.borderWidth,
      pointRadius: options.pointRadius,
    }
  ]
  if(values2?.length > 0) {
    let two = {};
    two = Object.assign(two, datasets[0]);
    two.label = value2name;
    two.backgroundColor = color2;
    two.borderColor = outlineColor2;
    two.data = values2;
    datasets.push(two);
  }

  new Chart(ctx, {
    type: chartType,
    data: {
      labels: labels,
      datasets: datasets,
    },
  });
}

function randomize() {
  let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  let n = Math.round(Math.random() * 15 + 5)
  labels = [];
  values = [];
  values2 = [];
  for(let i = 0; i < n; i++) {
    labels.push(letters[i]);
    values.push(Math.round(Math.random() * 100));
    if(n > 12) {
      values2.push(Math.round(Math.random() * 100));
    }
  }
  qs("#labels").value = labels.join(",");
  qs("#values").value = values.join(",");
  qs("#valuename").value = valuename ? valuename : "Series 1";
  qs("#value2name").value = value2name ? value2name : "Series 2";
  qs("#values2").value = values2.join(",");
  color = randomColor();
  qs("#color").value = color;
  outlineColor = randomColor();
  qs("#outlineColor").value = outlineColor;
  color2 = randomColor();
  qs("#color2").value = color2;
  outlineColor2 = randomColor();
  qs("#outlineColor2").value = outlineColor2;
  chartType = qs("#chartType").children[Math.round(Math.random() * (qs("#chartType").children.length - 1))].value;
  qs("#chartType").value = chartType;
  valuename = "Series 1";
  value2name = "Series 2";

  updateChart();
}

function setValues() {
  labels = qs("#labels").value.split(",");
  values = qs("#values").value.split(",");
  valuename = qs("#valuename").value;
  values2 = qs("#values2").value.length > 1 ? qs("#values2").value.split(",") : null;
  value2name = qs("#value2name").value;
  color = qs("#color").value;
  outlineColor = qs("#outlineColor").value;
  color2 = qs("#color2").value;
  outlineColor2 = qs("#outlineColor2").value;
  chartType = qs("#chartType").value;
  qs("#borderThicknessValue").textContent = qs("#borderThickness").value;
  options.borderWidth = qs("#borderThickness").value;
  qs("#pointRadiusValue").textContent = qs("#pointRadius").value;
  options.pointRadius = qs("#pointRadius").value;
  options.fill = qs("#fillChart").checked;

  updateChart();
}

function randomColor() {
  let c = "#" + Math.floor(Math.random()*16777215).toString(16);
  while(c.length < 7) {
    c += "0";
  }
  return c;
}

function logAll() {
  console.log("labels: " + labels);
  console.log("values: " + values);
  console.log("valuename: " + valuename);
  console.log("values2: " + values2);
  console.log("value2name: " + value2name);
  console.log("color: " + color);
  console.log("outlineColor: " + outlineColor);
  console.log("color2: " + color2);
  console.log("outlineColor2: " + outlineColor2);
  console.log("chartType: " + chartType);
  console.log(options);
}

function qs(selector) {
  return document.querySelector(selector);
}