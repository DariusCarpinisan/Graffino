<script>
import axios from "axios";
export default {
  name: "App",
  data() {
    return {
      apiKey: "b3241bb7b3f846a4b05132912230903",
      url: "http://api.weatherapi.com/v1/current.json?key=b3241bb7b3f846a4b05132912230903&q=",
      city: "",
      country: "",
      weather: null,
      icon: null,
      description: null,
      temp: null,
      humidity: null,
      wind: null,
      sunrise: null,
      sunset: null,
      forecastDay: [],
      maxtemp_c: null,
      mintemp_c: null,
      avghumidity: null,
      maxwind_kph: null,
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
          this.url +
            this.city +
            "," +
            this.country +
            "&aqi=no&units=metric&lang=en" +
            "&appid=" +
            this.apiKey
        )
        .then((response) => {
          console.log(response);
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
      <h1>Weather</h1>
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
    <div v-if="weather" class="city">
      <p>{{ city }} / {{ country }}</p>
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

    <table v-if="forecastDay">
      <thead v-if="weather">
        <tr>
          <th>Temp High |</th>
          <th>Temp Low |</th>
          <th>Humidity |</th>
          <th>Wind |</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="day in forecastDay" :key="day.date">
          <td>{{ day.day.maxtemp_c }}°C</td>
          <td>{{ day.day.mintemp_c }}°C</td>
          <td>{{ day.day.avghumidity }}%</td>
          <td>{{ day.day.maxwind_kph }}km/h</td>
          <td>
            <img :src="day.day.condition.icon" alt="weather icon" />
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f5f5f5;
}
header {
  font-size: 3rem;
  font-weight: 700;
  color: #333;
}

.search {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
}

.city {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}
</style>
