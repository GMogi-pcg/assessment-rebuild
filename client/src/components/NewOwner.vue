<template>
  <div>
    <h2 class>Add New Owner</h2>
    <div>
      <!-- Owner Name Input -->
      <input v-model="owner.name" placeholder="Name" />

      <!-- Entity Type Dropdown -->
      <select v-model="owner.entityType" required>
        <option disabled value="">Select Entity Type</option>
        <option v-for="type in entityTypes" :key="type" :value="type">{{ type }}</option>
      </select>

      <!-- Owner Type Dropdown -->
      <select v-model="owner.ownerType" required> 
        <option disabled value="">Select Owner Type</option>
        <option v-for="type in ownerTypes" :key="type" :value="type">{{ type }}</option>
      </select>

      <input v-model="owner.address" placeholder="Address" />
    </div>
    <button @click="handleSave">Save</button>
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
  emit('save', owner);
}

</script>