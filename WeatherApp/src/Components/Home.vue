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
      <h1 class="header">Weather</h1>
    </header>
    <div class="search">
      <input
        type="text"
        placeholder="City"
        v-model="city"
        @keyup.enter="getWeather"
      />
      <button @click="getWeather">Search</button>
    </div>
    <div v-if="cityName" class="city">
      <p>{{ cityName }} / {{ country }}</p>
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
  background-image: url("https://images.unsplash.com/photo-1558486012-817176f84c6d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1804&q=80");
  background-size: cover;
  background-repeat: no-repeat;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.header {
  font-size: 3rem;
  font-weight: bold;
  font-family: copperplate gothic light;
  margin-bottom: 2rem;
}

.search {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}

input[type="text"] {
  padding: 0.5rem;
  border: 2px solid #ccc;
  border-radius: 4px;
  margin-right: 1rem;
  width: 50%;
}

button {
  padding: 0.5rem;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.city {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.weather {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}

.weather__description {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.weather__icon {
  margin-bottom: 1rem;
}

.weather__temp {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.weather__humidity,
.weather__wind,
.weather__sunrise,
.weather__sunset {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.error {
  font-size: 2rem;
  font-weight: bold;
  font-family: copperplate gothic light;
  color: rgb(255, 255, 255);
  margin-bottom: 2rem;
}

.forecast {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2rem;
}

.forecast__day {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  width: 10rem;
}

.forecast__date {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.forecast__icon {
  margin-bottom: 1rem;
}

.forecast__temp {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.forecast__humidity,
.forecast__wind {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.history {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2rem;
}

.history__day {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  width: 10rem;
}
</style>
