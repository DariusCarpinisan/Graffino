import moment from "moment";
import axios from "axios";

export default {
  name: "FetchHistory",
  props: {
    city: String,
    country: String,
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
