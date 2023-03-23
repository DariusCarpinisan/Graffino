<script>
import FetchWeatherObj from "./FetchWeather.js";
import FetchAstronomy from "./FetchAstronomy.vue";
import FetchForecast from "./FetchForecast.vue";
import FetchHistory from "./FetchHistory.vue";
import "../css/main.css";
import "../css/body.css";
import "../css/panel.css";
import "../css/photo.css";
import "../css/responsive.css";

export default {
  name: "FetchWeather",
  ...FetchWeatherObj,
  components: {
    FetchForecast,
    FetchHistory,
    FetchAstronomy,
  },
  data() {
    return {
      apiKey: import.meta.env.VITE_API_KEY,
      unsplashApiKey: import.meta.env.VITE_UNSPLASH_API_KEY,
      photoUrl: null,
      city: "",
      cities: [
        "Bucharest",
        "London",
        "Paris",
        "New York",
        "Tokyo",
        "Sydney",
        "Moscow",
      ],
      cityName: null,
      country: "",
      date: null,
      time: null,
      weather: null,
      feelslike_c: null,
      feelslike_f: null,
      isCelsius: true,
      icon: null,
      description: null,
      temp: null,
      wind: null,
      air_quality: null,
      uvIndex: null,
      usEpaIndex: null,
      carbonMonoxide: null,
      vis_km: null,
      vis_miles: null,
      precip_in: null,
      precip_mm: null,
      pressure_in: null,
      pressure_mb: null,
      sunrise: null,
      wind_mph: null,
      isKmph: true,
      isIn: true,
      isMb: true,
      isKM: true,
      sunset: null,
      temp_c: null,
      temp_f: null,
      maxtemp_c: null,
      mintemp_c: null,
      error: null,
    };
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
              v-for="city in cities"
              :key="city"
              @click="getWeatherForCity(city, getCountry(city))"
            >
              {{ city }}
            </li>
          </ul>
        </div>
      </div>
      <div v-if="cityName" class="city">{{ cityName }}, {{ country }}</div>
    </div>
    <div class="time_and_date">{{ date }} {{ time }}</div>

    <div v-if="weather" class="weather">
      <div>
        <div class="weather__temp">{{ temperature }}°</div>
        <div>
          <span @click="toggleTemperature('c')" class="weather__temp__toggle"
            >°C</span
          >
          <span @click="toggleTemperature('f')" class="weather__temp__toggle"
            >°F</span
          >
        </div>
        <div class="weather__feelslike">
          Feels like: {{ convertFeelsLikeTemperature }}
        </div>
      </div>
      <FetchAstronomy :city="city" :country="country" />
      <div class="weather__icon">
        <img :src="icon" width="150" height="150" alt="weather icon" />
      </div>

      <div class="weather__air_quality">
        <p class="air_quality_title">Air Quality</p>
        <div>{{ carbonMonoxide }} co</div>
        <div class="weather__usEpaIndexLabel">{{ usEpaIndexLabel }}</div>
      </div>
      <div class="weather__uvIndex">
        <p class="uvIndex_title">UV</p>
        <div>{{ uvIndex }}</div>
        <div class="weather__uvIndexLabel">{{ uvIndexLabel }}</div>
      </div>

      <div class="weather__pressure">
        <p class="pressure_title">Pressure</p>
        <div>{{ pressure }}</div>
        <div>
          <span @click="togglePressure('in')" class="weather__pressure__toggle"
            >in</span
          >
          <span @click="togglePressure('mb')" class="weather__pressure__toggle"
            >mb</span
          >
        </div>
      </div>
      <div class="weather__visibility">
        <p class="visibility_title">Visibility</p>
        <div>{{ visibility }}</div>
        <div>
          <span
            @click="toggleVisibility('km')"
            class="weather__visibility__toggle"
            >km</span
          >
          <span
            @click="toggleVisibility('miles')"
            class="weather__visibility__toggle"
            >mi</span
          >
        </div>
      </div>
      <div class="weather__precipitation">
        <p class="precipitation_title">Precipitation</p>
        <div>{{ precipitation }}</div>
        <div>
          <span
            @click="togglePrecipitation('in')"
            class="weather__precipitation__toggle"
            >in</span
          >
          <span
            @click="togglePrecipitation('mm')"
            class="weather__precipitation__toggle"
            >mm</span
          >
        </div>
      </div>
      <div class="weather__wind">
        <p class="wind_title">Wind</p>
        <div>{{ windSpeed }}</div>
        <div>
          <span @click="toggleUnits('kmph')" class="weather__wind__toggle"
            >kmph</span
          >
          <span @click="toggleUnits('mph')" class="weather__wind__toggle"
            >mph</span
          >
        </div>
      </div>
    </div>
    <div v-if="weather" class="forecast_title">3-day forecast</div>
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
