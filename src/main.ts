import { createApp } from "vue";
import "./assets/styles/reset.css";
import "./assets/styles/index.css";
import App from "./App.vue";
import { createWebHistory, createRouter } from "vue-router";

import Recipe from "./pages/Recipe.vue";

const routes = [{ path: "/blog", component: Recipe }];

export const router = createRouter({
    history: createWebHistory(),
    routes
});

createApp(App).use(router).mount("#app");
