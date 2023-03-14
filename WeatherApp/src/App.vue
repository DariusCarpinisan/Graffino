<script setup>
import Home from "./Components/Home.vue";
import About from "./components/About.vue";
</script>

<script>
const routes = {
  "/": Home,
  "/about": About,
};

export default {
  data() {
    return {
      currentPath: window.location.pathname,
    };
  },
  computed: {
    currentView() {
      return routes[this.currentPath] || Home;
    },
  },
  methods: {
    goToRoute(path) {
      this.currentPath = path;
      window.history.pushState({}, "", path);
    },
  },
  mounted() {
    window.addEventListener("popstate", () => {
      this.currentPath = window.location.pathname;
    });
  },
};
</script>

<template>
  <main>
    <div>
      <div class="nav">
        <button class="info" @click="goToRoute('/')"><span>Home</span></button>
        <button class="about" @click="goToRoute('/about')">
          <span>About</span>
        </button>
      </div>
    </div>
    <component :is="currentView" />
  </main>
</template>

<style>
button {
  padding: 10px;
  font-family: copperplate gothic light;
  background-color: rgba(70, 46, 150, 0.2);
  color: #ccc;
  border: 1px solid rgba(14, 13, 13, 0.2);
  border-radius: 4px;
}
</style>
