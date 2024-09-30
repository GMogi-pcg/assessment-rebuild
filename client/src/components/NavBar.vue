<template>
  <nav class="sticky top-0 z-50 bg-gray-800 text-white py-4 shadow-lg">
    <div class="container mx-auto flex justify-between items-center px-4">
      <!-- Logo or Title -->
      <div class="text-2xl font-bold">
        <router-link to="/home" class="hover:text-gray-400">PCG</router-link>
      </div>

      <!-- Navigation Links -->
      <ul class="flex space-x-6">
        <li>
          <router-link to="/home" class="hover:text-gray-400" exact>Home</router-link>
        </li>
        <li >
          <router-link to="/owners" class="hover:text-gray-400">Owners</router-link>
        </li>
        <li >
          <router-link to="/land-holdings" class="hover:text-gray-400">Land Holdings</router-link>
        </li>
      </ul>

      <!-- Login/Logout Button -->
      <div>
        <button v-if="authStore.isAuthenticated" @click="handleLogout"
          class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
        <router-link v-else to="/"
          class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Login</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>

import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { onMounted, watch } from 'vue';

const router = useRouter();
const authStore = useAuthStore();

watch(
  () => authStore.isAuthenticated,
  (newStatus) => {
    console.log('User status changed:', newStatus);
    if (newStatus) {
      console.log("User logged in");
    } else {
      console.log("User logged out");
    }
  }
)

const handleLogout = async () => {
  await authStore.logout()
  console.log('User logged out');
  router.push({ name: 'Login' }); // Redirect to login
};

onMounted(() => {
  authStore.checkAuth();
});

</script>
