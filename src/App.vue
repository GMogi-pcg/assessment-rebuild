<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './stores/authStore';
import NavBar from './components/NavBar.vue';

const authStore = useAuthStore();

onMounted(() => {
  authStore.checkAuth();
});
</script>

<template>
    <main>
      <div class="h-screen">
        <router-view />
      </div>
    </main>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
