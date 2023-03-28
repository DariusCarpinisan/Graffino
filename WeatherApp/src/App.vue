<script setup>
import Home from "./Components/FetchWeather.vue";
</script>

<script>
const routes = {
  "/": Home,
};

export default {
  components: {
    Home,
  },
  data() {
    return {
      currentView: Home,
    };
  },
  methods: {
    goToRoute(route) {
      this.currentView = routes[route];
    },
  },
};
</script>

<template>
  <main>
    <component :is="currentView" />
  </main>
</template>
