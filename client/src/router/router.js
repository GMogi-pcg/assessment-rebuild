import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import SignUp from "../views/SignUp.vue";
import Owners from "../views/Owners.vue";
import LandHoldings from "../views/LandHoldings.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/owners",
    name: "Owners",
    component: Owners,
  },
  {
    path: "/land-holdings",
    name: "LandHoldings",
    component: LandHoldings,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
