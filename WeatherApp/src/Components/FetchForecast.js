import axios from "axios";

export default {
  name: "FetchForecast",
  props: {
    city: String,
    country: String,
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

