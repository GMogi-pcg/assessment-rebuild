// need to add logic to handle the form submission

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-10">
    <h1 class="text-3xl sm:text-4xl lg-text-5xl font-bold mb-8 text-center text-gray-800">Login</h1>
    <form class="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
      <div class="mb-4">
        <label htmlFor="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input v-model="email" type="email" id="email" class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
      </div>
    </form>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        email: '',
        password: ''
      }
    }
  }
</script>