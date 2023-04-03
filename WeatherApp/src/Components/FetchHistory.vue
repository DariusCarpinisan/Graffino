<script>
import FetchHistoryObj from "./FetchHistory.js";
import moment from "moment";
import "../css/historyday.css";

export default {
  name: "FetchHistory",
  ...FetchHistoryObj,
  props: {
    city: String,
    country: String,
  },
  data() {
    return {
      apiKey: import.meta.env.VITE_API_KEY,
      history: [],
      error: null,
      moment: moment,
    };
  },
};
</script>

<template>
  <div v-if="history" class="history">
    <div class="history__day" v-for="day in history" :key="day.date">
      <div class="history_date">
        {{ moment(day.forecast.forecastday[0].date).format("dddd") }}
      </div>
      <div class="history__icon">
        <img
          :src="day.forecast.forecastday[0].day.condition.icon"
          alt="weather icon"
        />
      </div>
      <div class="history__temp">
        H: {{ day.forecast.forecastday[0].day.maxtemp_c }}°C
        <div></div>
        L: {{ day.forecast.forecastday[0].day.mintemp_c }}°C
      </div>
      <div class="history_weather_description" v-if="day">
        <p>{{ day.forecast.forecastday[0].day.condition.text }}</p>
      </div>
    </div>
  </div>
</template>
