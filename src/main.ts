import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import "./assets/styles/index.css";
import About from "./pages/About.vue";

const routes = [{ path: "/about", component: About }];

export const router = createRouter({
    history: createWebHistory(),
    routes
});

createApp(App).use(router).mount("#app");
