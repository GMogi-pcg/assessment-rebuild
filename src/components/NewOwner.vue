<template>
  <div class="p-4 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
    <h2 class="text-xl font-bold mb-4">Add New Owner</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Owner Name Input -->
      <input v-model="owner.name" placeholder="Name"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />

      <!-- Entity Type Dropdown -->
      <select v-model="owner.entityType" required
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        <option disabled value="">Select Entity Type</option>
        <option v-for="type in entityTypes" :key="type" :value="type">{{ type }}</option>
      </select>

      <!-- Owner Type Dropdown -->
      <select v-model="owner.ownerType" required
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        <option disabled value="">Select Owner Type</option>
        <option v-for="type in ownerTypes" :key="type" :value="type">{{ type }}</option>
      </select>

      <input v-model="owner.address" placeholder="Address"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
    </div>
    <div class="py-2">
      <button @click="handleSave"
        class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Save</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const emit = defineEmits(['save']);

const entityTypes = ['Individual', 'Company', 'Investor', 'Trust'];
const ownerTypes = ['Competitor', 'Seller', 'Investor', 'Professional'];

const owner = reactive({
  name: '',
  entityType: '',
  ownerType: '',
  address: '',
});

function handleSave() {
  emit('save', { ...owner });
}

</script>