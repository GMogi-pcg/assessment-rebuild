<template>
  <div>
    <h1>Login</h1>
    <input v-model="email" placeholder="Email">
    <input v-model="password" placeholder="Password" type="password">
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