import { defineStore } from "pinia";
import app from "../services/mongoClient";
import { loginUser, logoutUser } from "../services/authService"; 

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    isAuthenticated: !!app.currentUser,
    currentUser: app.currentUser || null,
  }),
  actions: {
    async login(email, password) {
      try {
        const user = await loginUser(email, password);
        this.currentUser = user;
        this.isAuthenticated = !!user;
        console.log("User logged in", this.currentUser, 'Authenticated', this.isAuthenticated);
      } catch (error) {
        console.error("Login failed", error);
      }
    },
    async logout() {
      try {
        await logoutUser();
        this.isAuthenticated = false;
        this.currentUser = null;
        console.log("User logged out");
      } catch (error) {
        console.error("Logout failed", error);
      }
    },
    checkAuth() {
      this.currentUser = app.currentUser || null;
      this.isAuthenticated = !!this.currentUser;
      console.log("Checking auth status", this.isAuthenticated);
    },
  }
});
