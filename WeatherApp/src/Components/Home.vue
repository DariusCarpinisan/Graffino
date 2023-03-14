<script>
import axios from "axios";

export default {
  name: "HomeApp",
  data() {
    return {
      apiKey: "b3241bb7b3f846a4b05132912230903",
      city: "",
      cityName: null,
      country: "",
      weather: null,
      feelslike_c: null,
      icon: null,
      description: null,
      temp: null,
      humidity: null,
      wind: null,
      sunrise: null,
      sunset: null,
      maxtemp_c: null,
      mintemp_c: null,
      avghumidity: null,
      maxwind_kph: null,
      forecastDay: [],
      history: [],
      error: null,
    };
  },
  methods: {
    getWeather() {
      if (!this.city) {
        this.error = "Please enter a city.";
        return;
      }

      axios
        .get(
          `https://api.weatherapi.com/v1/current.json?key=${this.apiKey}&q=${this.city},${this.country}&days=5&aqi=no&alerts=no`
        )
        .then((response) => {
          console.log(response);
          this.cityName = this.city;
          this.weather = response.data;
          this.feelslike_c = this.weather.current.feelslike_c;
          this.icon = this.weather.current.condition.icon;
          this.description = this.weather.current.condition.text;
          this.temp = this.weather.current.temp_c;
          this.humidity = this.weather.current.humidity;
          this.wind = this.weather.current.wind_kph;
          this.sunrise = this.weather.current.sunrise;
          this.sunset = this.weather.current.sunset;
          this.country = this.weather.location.country;
          this.error = null;

          axios
            .get(
              `https://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${this.city},${this.country}&days=5&aqi=no&alerts=no`
            )
            .then((response) => {
              console.log(response);
              this.forecastDay = response.data.forecast.forecastday;
              this.error = null;
            });

          axios
            .get(
              `https://api.weatherapi.com/v1/astronomy.json?key=${this.apiKey}&q=${this.city},${this.country}&days=5&aqi=no&alerts=no`
            )
            .then((response) => {
              console.log(response);
              this.sunrise = response.data.astronomy.astro.sunrise;
              this.sunset = response.data.astronomy.astro.sunset;
              this.error = null;
            })

            .catch((error) => {
              console.log(error);
              this.error = "City not found";
            });
        });

      const historyPromises = [];
      for (let i = 0; i < 7; i++) {
        let date = new Date();
        date.setDate(date.getDate() - i - 1);
        let dateString = date.toISOString().substring(0, 10);

        historyPromises.push(
          axios.get(
            `https://api.weatherapi.com/v1/history.json?key=${this.apiKey}&q=${this.city},${this.country}&dt=${dateString}`
          )
        );
      }

      Promise.all(historyPromises)
        .then((responses) => {
          console.log(responses);
          this.history = responses.map((response) => response.data);
          this.history.sort((a, b) =>
            b.forecast.forecastday[0].date.localeCompare(
              a.forecast.forecastday[0].date
            )
          );
          this.error = null;
        })
        .catch((error) => {
          console.log(error);
          this.error = "City not found";
        });
    },
  },
  mounted() {
    this.getWeather();
  },
};
</script>

<template>
  <main>
    <header>
      <h1 class="header">Find Weather</h1>
    </header>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
    />
    <form @submit.prevent="getWeather">
      <input type="search" placeholder="Search here ..." v-model="city" />
      <i class="fa fa-search"></i>
    </form>
    <div v-if="cityName" class="city">
      <p>{{ cityName }}, {{ country }}</p>
    </div>

    <div v-if="weather" class="weather">
      <div class="weather__description">
        <p>{{ description }}</p>
      </div>
      <div class="weather__icon">
        <img :src="icon" alt="weather icon" />
      </div>
      <div class="weather__temp">
        <p>{{ temp }}°C</p>
      </div>
      <div class="weather__feelslike">
        <p>Feels like: {{ feelslike_c }}°C</p>
      </div>
      <div class="weather__humidity">
        <p>Humidity: {{ humidity }}%</p>
      </div>

      <div class="weather__wind">
        <p>Wind: {{ wind }}km/h</p>
      </div>
      <div class="weather__sunrise">
        <p>Sunrise: {{ sunrise }}</p>
      </div>
      <div class="weather__sunset">
        <p>Sunset: {{ sunset }}</p>
      </div>
    </div>

    <div class="error" v-if="error">
      <p>{{ error }}</p>
    </div>

    <div v-if="weather" class="forecast">
      <h2>5-Day Forecast</h2>
      <div class="forecast__day" v-for="day in forecastDay" :key="day.date">
        <div class="forecast__date">{{ day.date }}</div>
        <div class="forecast__icon">
          <img :src="day.day.condition.icon" alt="weather icon" />
        </div>
        <div class="forecast__temp">
          {{ day.day.maxtemp_c }}°C / {{ day.day.mintemp_c }}°C
        </div>
        <div class="forecast__humidity">
          Humidity: {{ day.day.avghumidity }}%
        </div>
        <div class="forecast__wind">Wind: {{ day.day.maxwind_kph }}km/h</div>
      </div>
    </div>

    <div v-if="weather" class="history">
      <h2>7-Day History</h2>
      <div class="history__day" v-for="day in history" :key="day.date">
        <div class="history__date">{{ day.forecast.forecastday[0].date }}</div>
        <div class="history__icon">
          <img
            :src="day.forecast.forecastday[0].day.condition.icon"
            alt="weather icon"
          />
        </div>
        <div class="history__temp">
          {{ day.forecast.forecastday[0].day.maxtemp_c }}°C /
          {{ day.forecast.forecastday[0].day.mintemp_c }}°C
        </div>
        <div class="history__humidity">
          Humidity: {{ day.forecast.forecastday[0].day.avghumidity }}%
        </div>
        <div class="history__wind">
          Wind: {{ day.forecast.forecastday[0].day.maxwind_kph }}km/h
        </div>
      </div>
    </div>
  </main>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  background-image: url("https://emerging-europe.com/wp-content/uploads/2020/07/bigstock-planet-earth-at-night-view-of-354648194.jpg");
  background-size: cover;
  background-repeat: no-repeat;
}

h2 {
  color: #0026ff;
  font-family: copperplate gothic light;
  font-size: 20px;
}

.header {
  font-size: 15px;
  color: #ccc;
  font-weight: bold;
  font-family: copperplate gothic light;
}

.search {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}

form {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 1s;
  width: 50px;
  height: 50px;
  background: white;
  box-sizing: border-box;
  border-radius: 25px;
  border: 4px solid white;
  padding: 5px;
}

input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 42.5px;
  line-height: 30px;
  outline: 0;
  border: 0;
  display: none;
  font-size: 1em;
  border-radius: 20px;
  padding: 0 20px;
}

.fa {
  box-sizing: border-box;
  padding: 10px;
  width: 42.5px;
  height: 42.5px;
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 50%;
  color: #07051a;
  text-align: center;
  font-size: 1.2em;
  transition: all 1s;
}

form:hover {
  width: 300px;
  cursor: pointer;
}

form:hover input {
  display: block;
}

form:hover .fa {
  background: #07051a;
  color: white;
}

.city {
  font-size: 25px;
  font-weight: bold;
  color: #ccc;
  font-family: copperplate gothic light;
  text-align: center;
}

.weather {
  color: #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}

.weather__description {
  font-size: 2rem;
  font-weight: bold;
  color: #ccc;
}

.weather__icon {
}

.weather__temp {
  font-size: 40px;
  font-weight: bold;
  color: #ccc;
}

.weather__feelslike,
.weather__humidity,
.weather__wind,
.weather__sunrise,
.weather__sunset {
  font-family: copperplate gothic light;
  color: #ccc;
}

.forecast {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.forecast__day {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5%;
  border: 5px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  width: 150px;
  color: #ccc;
}

.forecast__date {
  font-weight: bold;
}

.forecast__icon {
}

.forecast__temp {
}

.forecast__humidity,
.forecast__wind {
}

.history {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.history__day {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5%;
  border: 5px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  width: 150px;
  color: #ccc;
}

.error {
  font-size: 20px;
  text-align: center;
  font-weight: bold;
  font-family: cursive;
  color: rgb(255, 255, 255);
}
</style>
