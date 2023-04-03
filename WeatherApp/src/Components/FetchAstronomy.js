import axios from "axios";

export default {
  name: "FetchAstronomy",
  props: {
    city: String,
    country: String,
  },
  methods: {
    getAstronomy() {
      axios
        .get(
          `https://api.weatherapi.com/v1/astronomy.json?key=${this.apiKey}&q=${this.city},${this.country}&days=5&aqi=no&alerts=no`
        )
        .then((response) => {
          console.log(response);
          this.astronomy = response.data.astronomy;
          this.moon_phase = response.data.astronomy.astro.moon_phase;
          this.error = null;
        })
        .catch((error) => {
          console.log(error);
          this.error = "Error retrieving astronomy data";
          this.astronomy = null;
        });
    },
  },
  mounted() {
    this.getAstronomy();
  },
};
