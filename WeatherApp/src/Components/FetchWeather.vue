<script>
import axios from "axios";
import moment from "moment";
import FetchForecast from "./FetchForecast.vue";
import FetchHistory from "./FetchHistory.vue";
import "../css/main.css";
import "../css/body.css";
import "../css/photo.css";
import "../css/panel.css";
import "../css/responsive.css";

export default {
  name: "FetchWeather",
  components: {
    FetchForecast,
    FetchHistory,
  },
  data() {
    return {
      apiKey: "b3241bb7b3f846a4b05132912230903",
      unsplashApiKey: "v6PLxvQp-fZ2aeW1zla-kVox3OzVijcPxDS6IiKw9jY",
      photoUrl: null,
      city: "",
      cityName: null,
      country: "",
      date: null,
      time: null,
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
          this.date = moment(
            response.data.location.localtime.split(" ")[0]
          ).format("dddd, MMMM Do YYYY");
          this.time = response.data.location.localtime.split(" ")[1];
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

          let query = "";
          switch (this.description) {
            case "Sunny":
            case "Clear":
              query = "Clear Weather";
              break;
            case "Partly cloudy":
            case "Cloudy":
            case "Overcast":
              query = "Cloudy Sky";
              break;
            case "Mist":
            case "Fog":
            case "Haze":
              query = "Mist";
              break;
            case "Rain":
            case "Moderate or heavy rain shower":
            case "Light rain":
            case "Moderate or heavy rain":
            case "Moderate or heavy freezing rain":
            case "Freezing rain":
            case "Patchy light rain":
            case "Patchy light drizzle":
            case "Light drizzle":
            case "Light rain shower":
            case "Light showers of ice pellets":
            case "Light sleet":
            case "Light sleet showers":
              query = "Rainy Sky";
              break;
            case "Thunderstorm":
            case "Moderate or heavy rain with thunder":
            case "Patchy light rain with thunder":
            case "Moderate or heavy snow with thunder":
            case "Patchy light snow with thunder":
              query = "Thunderstorm Sky";
              break;
            case "Snow":
            case "Light snow":
            case "Moderate snow":
            case "Blizzard":
            case "Patchy light snow":
            case "Patchy moderate snow":
            case "Patchy heavy snow":
            case "Moderate or heavy snow showers":
            case "Moderate or heavy snow in area with thunder":
            case "Patchy light snow in area with thunder":
            case "Moderate or heavy rain in area with thunder":
            case "Patchy light rain in area with thunder":
              query = "Snow Sky";
              break;
            default:
              query = this.cityName;
              break;
          }

          axios
            .get(
              `https://api.unsplash.com/search/photos?query=${query}&client_id=${this.unsplashApiKey}`
            )
            .then((response) => {
              console.log(response);
              this.photoUrl = response.data.results[0].urls.regular;
              const img = new Image();
              img.src = this.photoUrl;
              img.addEventListener("load", () => {
                document.querySelector(".fade-in").classList.add("loaded");
              });
            });
        });
    },
  },
  // watch: {
  //   city: function (newValue, oldValue) {
  //     this.getWeather();
  //   },
  // },
  mounted() {
    this.getWeather();
  },
};
</script>

<template>
  <main>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
    />
    <div class="container">
      <div class="panel">
        <form id="locationInput">
          <input
            type="text"
            class="search"
            placeholder="Enter City"
            v-model="city"
            @keyup.enter="getWeather"
          />
          <button @click.prevent="getWeather" class="submit">
            <i class="fa fa-search"></i>
          </button>
        </form>

        <div class="cities">
          <ul>
            <li
              @click="
                city = 'New York';
                country = 'USA';
                getWeather();
              "
            >
              New York
            </li>
            <li
              @click="
                city = 'London';
                country = 'UK';
                getWeather();
              "
            >
              London
            </li>

            <li
              @click="
                city = 'Paris';
                country = 'France';
                getWeather();
              "
            >
              Paris
            </li>
            <li
              @click="
                city = 'Tokyo';
                country = 'Japan';
                getWeather();
              "
            >
              Tokyo
            </li>
          </ul>
        </div>
      </div>
      <div v-if="cityName" class="city">{{ cityName }}, {{ country }}</div>
    </div>
    <div class="time_and_date">{{ date }} {{ time }}</div>

    <div v-if="weather" class="weather">
      <div class="weather__temp">{{ temp }}°C</div>
      <div class="weather__icon">
        <img :src="icon" alt="weather icon" />
      </div>
      <div class="weather__description">
        {{ description }}
      </div>
      <div class="weather__feelslike">Feels like: {{ feelslike_c }}°C</div>
      <div class="weather__humidity">Humidity: {{ humidity }}%</div>

      <div class="weather__wind">Wind: {{ wind }}km/h</div>
    </div>
    <div v-if="weather" class="forecast_title">5-day forecast</div>
    <div v-if="weather" class="forecast">
      <FetchForecast :city="city" :country="country" />
    </div>
    <div></div>
    <div v-if="weather" class="history_title">last 7 days</div>
    <div v-if="weather" class="history">
      <FetchHistory :city="city" :country="country" />
    </div>

    <div class="description_photo">
      <img
        v-if="photoUrl"
        :src="photoUrl"
        class="img-fluid rounded-start fade-in"
        alt="Weather photo"
      />
    </div>
  </main>
</template>
