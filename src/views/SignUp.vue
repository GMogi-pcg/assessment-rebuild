<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-10">
    <h1 class="text-3xl lg:text-5xl font-bold mb-8 text-center text-gray-800">Start Managing Now</h1>
    <h2 class="text-3xl sm:text-4xl  mb-8 text-center text-gray-800">Sign Up</h2>
    <form @submit.prevent="handleSignup" class="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input v-model="email" type="email" id="email"
          class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input v-model="password" type="password" id="password"
          class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
      </div>
      <button type="submit"
        class="bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
        <div>
          <p>Already have an account? <router-link to="/"
              class="text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Log In</router-link>
          </p>
        </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { registerUser } from '../services/authService';
import { loginUser } from '../services/authService';

const email = ref('');
const password = ref('');

const router = useRouter(); 

const handleSignup = async () => {
  try {
    // attempt to sign up using authService
    await registerUser(email.value, password.value);

    const user = await loginUser(email.value, password.value);

    if (user) {

      alert("Sign up successful. Please log in.");
      router.push('/home');
    }

  } catch (error) {
    console.error("Error during sign up", error);
    alert("Sign up failed. Please try again.");
  }
}

</script>