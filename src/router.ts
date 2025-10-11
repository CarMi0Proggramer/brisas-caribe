import { createMemoryHistory, createRouter } from "vue-router";

import Home from "./pages/Home.vue";
import Services from "./pages/Services.vue";
import Sales from "./pages/Sales.vue";

export const router = createRouter({
  routes: [
    { path: "/", component: Home },
    { path: "/services", component: Services },
    { path: "/sales", component: Sales },
  ],
  history: createMemoryHistory(),
});
