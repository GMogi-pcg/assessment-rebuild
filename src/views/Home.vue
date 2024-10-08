<template>
  <div>
    <NavBar />
    <div class="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 px-4">
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-center">Welcome to PCG Management</h1>
      <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <router-link to="/owners" class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Manage
          Owners</router-link>
        <router-link to="/land-holdings"
          class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Manage Land
          Holdings</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '../components/NavBar.vue';
</script>
