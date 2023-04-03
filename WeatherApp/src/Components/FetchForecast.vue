<script>
import FetchForecastObj from "./FetchForecast.js";
import moment from "moment";
import "../css/forecastday.css";

export default {
  name: "FetchForecast",
  ...FetchForecastObj,
  props: {
    city: String,
    country: String,
  },
  data() {
    return {
      apiKey: import.meta.env.VITE_API_KEY,
      forecastDay: [],
      error: null,
      moment: moment,
    };
  },
};
</script>

<template>
  <div v-if="forecastDay" class="forecast">
    <div class="forecast__day" v-for="day in forecastDay" :key="day.date">
      <div class="forecast__date">{{ moment(day.date).format("dddd") }}</div>
      <div class="forecast__icon">
        <img :src="day.day.condition.icon" alt="weather icon" />
      </div>
      <div class="forecast__temp">
        H:{{ day.day.maxtemp_c }}°C
        <div></div>
        L:{{ day.day.mintemp_c }}°C
      </div>
      <div class="forecast_weather_description" v-if="day">
        <p>{{ day.day.condition.text }}</p>
      </div>
    </div>
  </div>
</template>
