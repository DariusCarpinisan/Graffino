<script setup>
import Home from "./Components/Home.vue";
import Radar from "./components/Radar.vue";
</script>

<script>
const routes = {
  "/": Home,
  "/radar": Radar,
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
        <button class="radar" @click="goToRoute('/radar')">
          <span>Radar</span>
        </button>
      </div>
    </div>
    <component :is="currentView" />
  </main>
</template>

<style>
.nav {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  width: 100%;
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  border: none;
  background-color: rgba(22, 72, 116, 0.5);
}

.info {
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.25);
  background-color: rgb(20, 20, 82);
  border-radius: 10px;
  border: none;
  padding: 10px 30px;
  text-align: center;
  transform: none;
  font-size: 16px;
  display: inline-block;
  cursor: pointer;
  transition: all 0.5s;
  top: 0;

  font-size: 20px;
  font-family: "Brush Script MT", "Brush Script Std", cursive;
}
.info span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
}
.info span:after {
  content: "\00bb";
  position: absolute;
  opacity: 0;
  top: 0;
  right: -20px;
  transition: 0.5s;
}
.info:hover span {
  padding-right: 25px;
}

.info:hover span:after {
  opacity: 1;
  right: 0;
}

.radar {
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.25);
  background-color: rgb(20, 20, 82);
  border-radius: 10px;
  border: none;
  padding: 10px 30px;
  text-align: center;
  transform: none;
  font-size: 16px;
  display: inline-block;
  cursor: pointer;
  transition: all 0.5s;
  top: 0;
  font-size: 20px;
  font-family: "Brush Script MT", "Brush Script Std", cursive;
}

.radar span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
}

.radar span:after {
  content: "\00ab";
  position: absolute;
  opacity: 0;
  top: 0;
  left: -20px;
  transition: 0.5s;
}

.radar:hover span {
  padding-left: 25px;
}

.radar:hover span:after {
  opacity: 1;
  left: 0;
}
</style>
