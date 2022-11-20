import Chart from "chart.js/auto";

/* Colores para los Charts */
const backgroundColor = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(255, 159, 64, 0.2)",
  "rgba(255, 205, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(201, 203, 207, 0.2)",
];
const borderColor = [
  "rgb(255, 99, 132)",
  "rgb(255, 159, 64)",
  "rgb(255, 205, 86)",
  "rgb(75, 192, 192)",
  "rgb(54, 162, 235)",
  "rgb(153, 102, 255)",
  "rgb(201, 203, 207)",
];

/* API */
const slugs = ["brazil", "united-states", "spain", "germany", "mexico"];

const lineChart = (results) => {
  const ctx = document.getElementById("line").getContext("2d");

  const days = [];
  let datasets = [];
  for (let index = 0; index < 7; index++) {
    days.push(`dia-${index + 1}`);
    if (index < results.length) {
      datasets.push({
        label: slugs[index],
        data: results[index],
        borderColor: borderColor[index],
        backgroundColor: backgroundColor[index],
      });
    }
  }
  const data = {
    labels: days,
    datasets: datasets,
  };

  const config = {
    type: "line",
    data: data,
    options: {
      plugins: {
        legend: {
          position: "right",
        },
        title: {
          display: true,
          text: "Chart.js Line Chart",
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Dias",
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Casos",
          },
        },
      },
      animations: {
        tension: {
          duration: 1000,
          easing: "linear",
          from: 1,
          to: 0,
          loop: true,
        },
      },
    },
  };

  return new Chart(ctx, config);
};

const radarChart = (results) => {
  const ctx = document.getElementById("radar").getContext("2d");

  const days = [];
  let datasets = [];
  for (let index = 0; index < 7; index++) {
    days.push(`dia-${index + 1}`);
    if (index < results.length) {
      datasets.push({
        label: slugs[index],
        data: results[index],
        borderColor: borderColor[index],
        backgroundColor: backgroundColor[index],
      });
    }
  }

  const data = {
    labels: days,
    datasets: datasets,
  };

  const config = {
    type: "radar",
    data: data,
    options: {
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Chart.js Radar Chart",
        },
      },
    },
  };

  return new Chart(ctx, config);
};

const pieChart = (results) => {
  const ctx = document.getElementById("pie").getContext("2d");

  const recovered = [];
  results.forEach((values) => {
    recovered.push(values.reduce((a, b) => a + b, 0));
  });

  const data = {
    labels: slugs,
    datasets: [
      {
        label: "Recuperados",
        data: recovered,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  const config = {
    type: "pie",
    data: data,
    options: {
      plugins: {
        legend: {
          position: "right",
        },
        title: {
          display: true,
          text: "Chart.js Pie Chart",
        },
      },
    },
  };

  return new Chart(ctx, config);
};

const doughnutChart = (results) => {
  const ctx = document.getElementById("doughnut").getContext("2d");

  const deaths = [];
  results.forEach((values) => {
    deaths.push(values.reduce((a, b) => a + b, 0));
  });
  const data = {
    labels: slugs,
    datasets: [
      {
        label: "Fallecimientos",
        data: deaths,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  const config = {
    type: "doughnut",
    data: data,
    options: {
      plugins: {
        legend: {
          position: "right",
        },
        title: {
          display: true,
          text: "Chart.js Doughnut Chart",
        },
      },
    },
  };

  return new Chart(ctx, config);
};

/* Funcion asincrona simple para consultar la API para metodos GET. */
const getData = async (url) => {
  try {
    const res = await fetch(url),
      json = await res.json();
    return json;
  } catch (error) {
    throw error;
  }
};

// obtenemos todos los datos necesarios
let confirmed = [];
let deaths = [];
let recovered = [];
try {
  for (const slug of slugs) {
    let json = await getData(
      `https://api.covid19api.com/country/${slug}?from=2020-04-01T00:00:00Z&to=2020-04-07T00:00:00Z`
    );
    // console.log(json);
    confirmed.push(json.map((value) => value.Confirmed));
    deaths.push(json.map((value) => value.Deaths));
    recovered.push(json.map((value) => value.Recovered));
  }

  // renderizamos nuestros charts
  lineChart(confirmed);
  radarChart(confirmed);
  pieChart(recovered);
  doughnutChart(deaths);
} catch (error) {
  console.error("API Error Found: ", error);
  window.alert("API Error Found, ", error);
}
