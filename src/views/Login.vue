<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-10">
    <h1 class="text-3xl lg:text-5xl font-bold mb-8 text-center text-gray-800">Welcome Back</h1>
    <h2 class="text-3xl sm:text-4xl  mb-8 text-center text-gray-800">Login</h2>

    <!--Error Message-->
    <div v-if="authStore.errorMessages" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
      role="alert">
      <strong class="font-bold">Error! </strong>
      <span class="block sm:inline">{{ authStore.errorMessages }}</span>
    </div>

    <form @submit.prevent="handleLogin" class="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
      <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input v-model="authStore.email" type="email" id="email"
          class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
      </div>
      <div class="mb-4">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input v-model="authStore.password" type="password" id="password"
          class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
      </div>
      <div>
        <button type="submit"
          class="bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>

      </div>
      <div>
        <p>Don't have an account? <router-link to="/signup"
            class="text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Sign Up</router-link>
        </p>

      </div>
    </form>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  authStore.login(router);
};
</script>