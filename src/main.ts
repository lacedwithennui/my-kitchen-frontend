import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import "./assets/styles/index.css";
import About from "./pages/About.vue";
import Recipe from "./pages/Recipe.vue";

const routes = [
    { path: "/about", component: About },
    { path: "/recipe", component: Recipe }
];

export const router = createRouter({
    history: createWebHistory(),
    routes
});

createApp(App).use(router).mount("#app");
