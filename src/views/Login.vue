<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-10">
    <h1 class="text-3xl sm:text-4xl lg-text-5xl font-bold mb-8 text-center text-gray-800">Login</h1>

    <!--Error Message-->
    <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
      role="alert">
      <strong class="font-bold">Error! </strong>
      <span class="block sm:inline">{{ errorMessage }}</span>
    </div>

    <form @submit.prevent="handleLogin" class="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
      <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input v-model="email" type="email" id="email"
          class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
      </div>
      <div class="mb-4">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input v-model="password" type="password" id="password"
          class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
      </div>
      <div>
        <button type="submit"
          class="bg-gray-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>

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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  // if (!email.value || !password.value) {
  //   errorMessage.value = 'Please enter both email and password.';
  //   return;
  // }
  try {
    await authStore.login(email.value, password.value);

    // If user is successfully logged in, proceed to home
    if (authStore.currentUser) {
      errorMessage.value = ''; // Clear error message if login is successful
      console.log('User logged in:', authStore.currentUser);
      router.push({ name: 'Home' });
    } else {
      // If the login didn't return a user, something went wrong
      errorMessage.value = 'Failed to log in. Please check your email and password and try again.';
    }
    
    // console.log('User logged in', authStore.currentUser);

    // errorMessage.value = "";
    // router.push({ name: 'Home' });
  } catch (error) {
    console.error('Error logging in:', error);
    errorMessage.value = 'Incorrect email or password.  Please try again.';

  }
};
</script>