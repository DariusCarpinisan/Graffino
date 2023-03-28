import axios from "axios";
import moment from "moment";
import FetchForecast from "./FetchForecast.vue";
import FetchHistory from "./FetchHistory.vue";

export default {
  name: "FetchWeather",
  components: {
    FetchForecast,
    FetchHistory,
  },
  methods: {
    getCountry(city) {
      switch (city) {
        case "Bucharest":
          return "Romania";
        case "London":
          return "United Kingdom";
        case "Paris":
          return "France";
        case "New York":
          return "United States of America";
        case "Tokyo":
          return "Japan";
        case "Sydney":
          return "Australia";
        case "Moscow":
          return "Russia";
        default:
          return "";
      }
    },
    getWeatherForCity(city, country) {
      this.refreshWeatherData();
      this.city = city;
      this.country = country;
      this.getWeather();
    },

    refreshWeatherData() {
      this.cityName = null;
      this.country = null;
      this.date = null;
      this.time = null;
      this.weather = null;
      this.temp_c = null;
      this.feelslike_c = null;
      this.icon = null;
      this.description = null;
      this.temp = null;
      this.wind = null;
      this.sunrise = null;
      this.sunset = null;
      this.avghumidity = null;
      this.maxwind_kph = null;
      this.error = null;
    },

    airQualityDescription() {
      let usEpaIndex = this.air_quality["us-epa-index"];
      let carbonMonoxide = this.air_quality["co"];
      switch (usEpaIndex) {
        case 1:
          return { status: "Good", carbonMonoxide };
        case 2:
          return { status: "Moderate", carbonMonoxide };
        default:
          return { status: "Unknown", carbonMonoxide };
      }
    },
    toggleTemperature(temperature) {
      if (temperature === "c") {
        this.isCelsius = true;
      } else {
        this.isCelsius = false;
      }
    },
    convertFeelsLike() {
      if (this.isCelsius) {
        return this.feelslike_c;
      } else {
        return this.feelslike_f;
      }
    },
    toggleUnits(unit) {
      if (unit === "mph") {
        this.isKmph = false;
      } else {
        this.isKmph = true;
      }
    },
    togglePrecipitation(precipitation) {
      if (precipitation === "in") {
        this.isIn = false;
      } else {
        this.isIn = true;
      }
    },
    toggleVisibility(visibility) {
      if (visibility === "km") {
        this.isKM = true;
      } else {
        this.isKM = false;
      }
    },
    togglePressure(pressure) {
      if (pressure === "mb") {
        this.isMb = false;
      } else {
        this.isMb = true;
      }
    },

    getWeather() {
      this.photoUrl = null;
      if (!this.city) {
        this.error = "Please enter a city.";
        return;
      }

      axios
        .get(
          `https://api.weatherapi.com/v1/current.json?key=${this.apiKey}&q=${this.city},${this.country}&days=5&aqi=yes&alerts=no`
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
          this.feelslike_f = this.weather.current.feelslike_f;
          this.air_quality = this.weather.current.air_quality;
          this.icon = this.weather.current.condition.icon;
          this.description = this.weather.current.condition.text;
          this.temp = this.weather.current.temp_c;
          this.temp_f = this.weather.current.temp_f;
          this.wind = this.weather.current.wind_kph;
          this.wind_mph = this.weather.current.wind_mph;
          this.uvIndex = this.weather.current.uv;
          this.usEpaIndex = response.data.current.air_quality["us-epa-index"];
          this.carbonMonoxide = Math.floor(
            response.data.current.air_quality["co"]
          );
          this.precip_in = this.weather.current.precip_in;
          this.precip_mm = this.weather.current.precip_mm;
          this.pressure_in = this.weather.current.pressure_in;
          this.pressure_mb = this.weather.current.pressure_mb;
          this.vis_km = this.weather.current.vis_km;
          this.vis_miles = this.weather.current.vis_miles;
          this.moon_phase = this.weather.current.moon_phase;
          this.country = this.weather.location.country;
          this.error = null;

          let query = "";
          switch (this.description) {
            case "Sunny":
            case "Clear":
              query = "Clear sky";
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
            case "Moderate rain":
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

  mounted() {
    this.refreshWeatherData();
    this.getWeather();
  },

  computed: {
    temperature() {
      return this.isCelsius ? this.temp : this.temp_f;
    },
    convertFeelsLikeTemperature() {
      return this.isCelsius ? this.feelslike_c : this.feelslike_f;
    },
    windSpeed() {
      return this.isKmph ? this.wind : this.wind_mph;
    },
    precipitation() {
      return this.isIn ? this.precip_mm : this.precip_in;
    },
    pressure() {
      return this.isMb ? this.pressure_mb : this.pressure_in;
    },
    visibility() {
      return this.isKM ? this.vis_km : this.vis_miles;
    },
    usEpaIndexLabel() {
      const index = this.usEpaIndex;
      switch (index) {
        case 1:
          return "Good";
        case 2:
          return "Moderate";
        case 3:
          return "Unhealthy for Sensitive Groups";
        case 4:
          return "Unhealthy";
        case 5:
          return "Very Unhealthy";
        case 6:
          return "Hazardous";
        default:
          return "";
      }
    },
    uvIndexLabel() {
      const index = this.uvIndex;
      if (index >= 0 && index <= 2) {
        return "Low";
      } else if (index >= 3 && index <= 5) {
        return "Moderate";
      } else if (index >= 6 && index <= 7) {
        return "High";
      } else if (index >= 8 && index <= 10) {
        return "Very High";
      } else if (index >= 11) {
        return "Extreme";
      } else {
        return "";
      }
    },
  },
};
