<template>
  <nav class="sticky top-0 z-50 bg-gray-800 text-white py-4 shadow-lg">
    <div class="container mx-auto flex justify-between items-center px-4">
      <!-- Logo or Title -->
      <div class="text-2xl font-bold">
        <router-link to="/home" class="hover:text-gray-400">LOGO</router-link>
      </div>

      <!-- Navigation Links -->
      <ul class="flex space-x-6">
        <li>
          <router-link to="/home" class="hover:text-gray-400" exact>Home</router-link>
        </li>
        <li>
          <router-link to="/owners" class="hover:text-gray-400">Owners</router-link>
        </li>
        <li>
          <router-link to="/land-holdings" class="hover:text-gray-400">Land Holdings</router-link>
        </li>
      </ul>

      <!-- Logout Button -->
      <button @click="logout" class="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded">
        Logout
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  // Your logout logic here (e.g., clear token, redirect to login)
  console.log('User logged out');
  router.push('/'); // Redirect to login
};
</script>

<style scoped>
/* Add any additional styles you need */
</style>
