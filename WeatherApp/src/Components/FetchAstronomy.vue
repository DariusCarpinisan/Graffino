<script>
import FetchAstronomyObj from "./FetchAstronomy.js";

export default {
  name: "FetchAstronomy",
  ...FetchAstronomyObj,
  props: {
    city: String,
    country: String,
  },
  data() {
    return {
      apiKey: import.meta.env.VITE_API_KEY,
      astronomy: [],
      moon_phase: null,
      error: null,
    };
  },
};
</script>

<template>
  <div class="moon_icon">
    <img
      width="220"
      height="220"
      src="https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/31010/moon-crescent-clipart-md.png"
      alt="full moon"
    />
    <div class="moon_description">{{ moon_phase }}</div>
  </div>
</template>
