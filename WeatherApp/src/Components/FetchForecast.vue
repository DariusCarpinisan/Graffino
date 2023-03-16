<script>
import moment from "moment";
import axios from "axios";
import "../css/forecastday.css";

export default {
  name: "FetchForecast",
  props: {
    city: String,
    country: String,
  },
  data() {
    return {
      apiKey: "b3241bb7b3f846a4b05132912230903",
      forecastDay: [],
      error: null,
      moment: moment,
    };
  },
  methods: {
    getForecast() {
      console.log("City:", this.city);
      console.log("Country:", this.country);
      axios
        .get(
          `https://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${this.city},${this.country}&days=5&aqi=no&alerts=no`
        )
        .then((response) => {
          console.log(response);
          this.forecastDay = response.data.forecast.forecastday;
          this.error = null;
        })
        .catch((error) => {
          console.log(error);
          this.error = "Error retrieving forecast data";
          this.forecastDay = null;
        });
    },
  },
  mounted() {
    this.getForecast();
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
