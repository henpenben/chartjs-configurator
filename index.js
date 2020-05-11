window.addEventListener("load", init);

let labels, values, valuename, values2, value2name, color, outlineColor, color2, outlineColor2, chartType, chartTitle, chartObj;
let verbose = false;
let options = {
  title:{
    display: true,
    text: chartTitle,
  },
  scales: {
    yAxes: [
      {
        type: "linear",
        display: true,
        position: "left",
        id: "y-axis-1",
      },

    ],
  }
};

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
  qs("#chartTitle").addEventListener("change", setValues);
  qs("#dumpConfig").addEventListener("change", updateChart);

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
      yAxisID: "y-axis-1",
    }
  ]
  if(values2?.length > 0) {
    let two = {};
    two = Object.assign(two, datasets[0]);
    two.label = value2name;
    two.backgroundColor = color2;
    two.borderColor = outlineColor2;
    two.data = values2;
    two.yAxisID = "y-axis-2";

    datasets.push(two);
  } else {
    while(options.scales.yAxes.length > 1) {
      options.scales.yAxes.pop();
    }
  }

  dumpConfig(labels, datasets);

  chartObj = new Chart(ctx, {
    type: chartType,
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: options,
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
      values2.push(Math.round(Math.random() * 1000));
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

  setValues();
}

function dumpConfig(labels, datasets) {
  if(qs("#dumpConfig").checked) {
    console.log("chart type:");
    console.log(chartType);
    console.log("");
    console.log("data:");
    console.log({data:{labels:labels,datasets:datasets}});
    console.log(JSON.stringify({data:{labels:labels,datasets:datasets}}));
    console.log("");
    console.log("options:");
    console.log({options:options});
    console.log(JSON.stringify({options:options}));
  }
}

function setValues() {
  labels = qs("#labels").value.split(",");
  values = qs("#values").value.split(",");
  valuename = qs("#valuename").value;
  qsa(".series1").forEach( (e) => {
    e.textContent = valuename;
  });
  values2 = qs("#values2").value.length > 1 ? qs("#values2").value.split(",") : null;
  value2name = qs("#value2name").value;
  qsa(".series2").forEach( (e) => {
    e.textContent = value2name;
  });
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
  chartTitle = (qs("#chartTitle").value.length > 1 && qs("#chartTitle").value.split(/ /)[0] !== "ChartJS") ? qs("#chartTitle").value : `ChartJS ${chartType} chart`;
  qs("#chartTitle").value = chartTitle;
  options.title.text = chartTitle;

  if(options.scales.yAxes.length === 1) {
    options.scales.yAxes.push({
      type: "linear",
      display: true,
      position: "right",
      id: "y-axis-2",
      // grid line settings
      gridLines: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
      },
    });
  }

  if(chartType === "bar" || chartType === "line") {
    options.scales.yAxes.forEach( (e) => {
      e.display = true;
    });
  } else {
    options.scales.yAxes.forEach( (e) => {
      e.display = false;
    });
  }
  if(chartType === "line" || chartType === "radar") {
    qs("#pointRadiusOption").classList.remove("hide");
  } else {
    qs("#pointRadiusOption").classList.add("hide");
  }

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
  console.log("chartTitle: " + chartTitle);
  console.log(options);
}

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}