import "./App.css";
import React from "react";
import Swal from "sweetalert2";
import raining from "./weather/raining.jpg";
import clear from "./weather/clear.webp";
import cloudy from "./weather/cloudy.jpg";
import snowing from "./weather/snowing.jpg";
import haze from "./weather/haze.jpg";
import github from "./GitHub-Mark-32px.png";

// API key: 01f1be233bc3a378ba0559fcc1d47dde
// http://api.openweathermap.org/data/2.5/weather?q=Austin&appid=01f1be233bc3a378ba0559fcc1d47dde

const formReducer = (state, event) => {
  return {
    ...state,
    name: event.value,
  };
};

function App() {
  const [city, setCity] = React.useState("Austin");
  const [formData, setFormData] = React.useReducer(formReducer, {});

  const handleChange = (event) => {
    setFormData({
      name: event.target.value,
      value: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name) {
      Swal.fire({
        title: "Error!",
        text: "You cannot search an empty string",
        icon: "error",
      });
      return;
    }

    setCity(formData.name);
  };

  const githubLink = () => {
    return <a href="https://www.github.com/quinnlab-orc">hi</a>;
  };

  return (
    <body className="body">
      <div className="App">
        <header>Weather App</header>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter city"
            onChange={handleChange}
          ></input>
          <button className="submit" type="submit">
            Submit
          </button>
        </form>
        <GetWeather onCity={city} />
        <a href="https://www.github.com/quinnlab-orc" className="github">
          <img
            className="myNewClass"
            src={github}
            alt="https://github.com/quinnlab-orc"
            onClick={githubLink()}
          ></img>
        </a>
      </div>
    </body>
  );
}

const GetWeather = (props) => {
  const initialWeather = {
    name: "",
    coord: {
      lon: 0,
      lat: 0,
    },
    main: {
      feels_like: 0,
      humidity: 0,
      temp: 0,
      temp_max: 0,
      temp_min: 0,
    },
    weather: [
      {
        main: "clear",
        description: "clear skies",
      },
    ],
  };

  const [weatherData, setWeatherData] = React.useState(initialWeather);

  React.useEffect(() => {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${props.onCity}&appid=01f1be233bc3a378ba0559fcc1d47dde`,
      { mode: "cors" }
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.cod !== 200) {
          Swal.fire({
            title: "Error",
            text: data.message,
            icon: "error",
          });
          return;
        }
        setWeatherData(data);
      })
      .catch(function () {
        console.error("error");
      });
  }, [props.onCity]);

  let x = document.getElementsByTagName("body")[0];
  x.style.backgroundRepeat = "no-repeat";
  x.style.backgroundSize = "cover";

  if (weatherData.weather[0].main === "Clouds") {
    x.style.backgroundImage = `url(${cloudy})`;
  } else if (weatherData.weather[0].main === "Rain") {
    x.style.backgroundImage = `url(${raining})`;
  } else if (weatherData.weather[0].main === "Haze") {
    x.style.backgroundImage = `url(${haze})`;
  } else if (weatherData.weather[0].main === "Snow") {
    x.style.backgroundImage = `url(${snowing})`;
  } else {
    x.style.backgroundImage = `url(${clear})`;
  }

  const [tempUnit, setTempUnit] = React.useState("F");
  const changeTemp = (unit) => {
    setTempUnit(unit);
  };

  let temp = "";
  let minTemp = "";
  let maxTemp = "";
  const selectedTemp = "rgba(255, 127, 80, .8)";
  const unselectTemp = "rgba(125, 120, 119, .5)";

  if (tempUnit === "F") {
    let z = document.getElementsByClassName("faren")[0];
    let x = document.getElementsByClassName("celc")[0];
    if (z) {
      z.style.backgroundColor = selectedTemp;
      x.style.backgroundColor = unselectTemp;
    }
    temp = ((weatherData.main.temp - 273.15) * (9 / 5) + 32).toFixed(1) + " F";
    minTemp =
      ((weatherData.main.temp_min - 273.15) * (9 / 5) + 32).toFixed(1) + " F";
    maxTemp =
      ((weatherData.main.temp_max - 273.15) * (9 / 5) + 32).toFixed(1) + " F";
  } else if (tempUnit === "C") {
    let z = document.getElementsByClassName("celc")[0];
    let x = document.getElementsByClassName("faren")[0];
    if (z) {
      z.style.backgroundColor = selectedTemp;
      x.style.backgroundColor = unselectTemp;
    }
    temp = (weatherData.main.temp - 273.15).toFixed(1) + " C";
    minTemp = (weatherData.main.temp_min - 273.15).toFixed(1) + " C";
    maxTemp = (weatherData.main.temp_max - 273.15).toFixed(1) + " C";
  }

  return (
    <div className="weatherDisplay">
      <p style={{ fontSize: "30px", fontWeight: "bold", marginTop: "-5px" }}>
        {weatherData.name}
      </p>
      <p style={{ fontSize: "20px", marginTop: "-5px" }}>
        {weatherData.weather[0].main}
      </p>
      <p style={{ marginTop: "-5px" }}>
        Current temp: {temp} <br />
        Temp range: {minTemp} - {maxTemp}
      </p>
      {"Lon: " + weatherData.coord.lon + ", Lat: " + weatherData.coord.lat}
      <div className="temps">
        <button className="faren" onClick={() => changeTemp("F")}>
          F
        </button>
        <button className="celc" onClick={() => changeTemp("C")}>
          C
        </button>
        <p>
          All data acquired through the OpenWeatherMap API
        </p>
      </div>
    </div>
  );
};

export default App;
