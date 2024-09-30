import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import SignUp from "../views/SignUp.vue";
import Owners from "../views/Owners.vue";
import LandHoldings from "../views/LandHoldings.vue";
import app from "../services/mongoClient";

// authentication check
const isAuthenticated = () => {
  return app.currentUser != null;
};

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
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/owners",
    name: "Owners",
    component: Owners,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/land-holdings",
    name: "LandHoldings",
    component: LandHoldings,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// global navigation guard
router.beforeEach((to, from, next) => {
  // check if route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // check if user is authenticated
    if (!isAuthenticated()) {
      // redirect to login page
      next({ name: "Login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
