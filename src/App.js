import "./App.css";
import React from "react";
import Swal from "sweetalert2";
import raining from "./weather/raining.jpg"
import clear from "./weather/clear.webp"
import cloudy from "./weather/cloudy.jpg"
import snowing from "./weather/snowing.jpg"
import haze from "./weather/haze.jpg"

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

  return (
    <body className="body">
      <div className="App">
        <form onSubmit={handleSubmit}>
          <fieldset>
            <input
              type="text"
              placeholder="Enter city"
              onChange={handleChange}
            ></input>
          </fieldset>
          <button type="submit">Submit</button>
        </form>

        <div>
          <ul>
            {Object.entries(formData).map(([name, value]) => (
              <div>
                <li key={name}>
                  You are searching for: <strong>{value.toString()}</strong>
                </li>
              </div>
            ))}
          </ul>
        </div>

        <GetWeather onCity={city} />
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

  if (weatherData.weather[0].main === 'Clouds') {
    x.style.backgroundImage = `url(${cloudy})`
  } else if (weatherData.weather[0].main === 'Rain') {
    x.style.backgroundImage = `url(${raining})`
  } else if(weatherData.weather[0].main === 'Haze') {
    x.style.backgroundImage = `url(${haze})`
  } else if(weatherData.weather[0].main === 'Snow') {
    x.style.backgroundImage = `url(${snowing})`
  } else {
    x.style.backgroundImage = `url(${clear})`
  }

  console.log(weatherData.weather[0].main)

  return (
    <div>
      {weatherData.name}
      <br />
      {"Temp: " + weatherData.main.temp}
      <br />
      {"Lon: " + weatherData.coord.lon}
      <br />
      {"Lat: " + weatherData.coord.lat}
      <br />
      {weatherData.weather[0].main + ", " + weatherData.weather[0].description}
    </div>
  );
};

export default App;
