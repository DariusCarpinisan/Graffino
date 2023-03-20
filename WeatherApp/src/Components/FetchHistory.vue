<script>
import moment from "moment";
import axios from "axios";
import "../css/historyday.css";

export default {
  name: "FetchHistory",
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
  methods: {
    getHistory() {
      const historyPromises = [];
      for (let i = 0; i < 7; i++) {
        let date = new Date();
        date.setDate(date.getDate() - i - 1);
        const dateString = moment(date).format("YYYY-MM-DD");
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
            a.forecast.forecastday[0].date.localeCompare(
              b.forecast.forecastday[0].date
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
    this.getHistory();
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
