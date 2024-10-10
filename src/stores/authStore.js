import { defineStore } from "pinia";
import app from "../services/mongoClient";
import { loginUser, logoutUser } from "../services/authService"; 


export const useAuthStore = defineStore("authStore", {
  state: () => ({
    isAuthenticated: !!app.currentUser,
    currentUser: app.currentUser || null,
    email: "",
    password: "",
    errorMessages: "",
  }),
  actions: {
    async login(router) {
      try {
        const user = await loginUser(this.email, this.password);
        this.currentUser = user;
        this.isAuthenticated = !!user;
        this.errorMessages = "";
        console.log("User logged in", this.currentUser, 'Authenticated', this.isAuthenticated);

        router.push({ name: "Home"});
      } catch (error) {
        console.error("Login failed", error);
        this.errorMessages = "Incorrect email or password. Please try again."
      }
    },
    async logout() {
      try {
        await logoutUser();
        this.isAuthenticated = false;
        this.currentUser = null;
        this.email = "";
        this.password = "";
      } catch (error) {
        console.error("Logout failed", error);
      }
    },
    checkAuth() {
      this.currentUser = app.currentUser || null;
      this.isAuthenticated = !!this.currentUser;
      console.log("Checking auth status", this.isAuthenticated);
    },
    clearErrorMessage() {
      this.errorMessages = "";
    },
  }
});
