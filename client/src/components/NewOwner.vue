<template>
  <div>
    <h2 class>New Owner</h2>
    <div>
      <input v-model="owner.name" placeholder="Name" />
      <input v-model="owner.entityType" placeholder="Entity Type" />
      <input v-model="owner.ownerType" placeholder="Owner Type" />
      <input v-model="owner.address" placeholder="Address" />
    </div>
    <button @click="handleSave">Save</button>
  </div>
</template>

<script>
import { reactive } from 'vue';

export default {
  emits: ['save'],
  setup(_, { emit }) {
    const owner = reactive({
      name: '',
      entityType: '',
      ownerType: '',
      address: '',
    });

    function handleSave() {
      emit('save', owner);
    }

    return {
      owner,
      handleSave,
    };
  },
};
</script>