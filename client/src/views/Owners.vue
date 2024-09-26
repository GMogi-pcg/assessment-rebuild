<template>
  <div class="p-4">
    <NewOwner @save="handleCreateOwner" />
    <div class="text-center my-4" >
      <h2>Owners</h2>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import NewOwner from '../components/NewOwner.vue';
import { useOwnerStore } from '../stores/ownerStrore';

export default {
  components: { NewOwner, },
  setup() {
    const ownerStore = useOwnerStore();
    const editingId = ref(null);
    const editingData = ref({});
    const file = ref(null);

    // Load owners when the component is mounted
    onMounted(() => {
      ownerStore.loadOwners();
    });

    const handleCreateOwner = async (newOwner) => {
      await ownerStore.addOwner(newOwner);
    };

    const handleDeleteOwner = async (id) => {
      await ownerStore.removeOwner(id);
    };

    const handleEditOwner = async (id) => {
      const owner = ownerStore.owners.find((owner) => owner.id === id);
      editingId.value = id;
      editingData.value = { ...owner }
    };

    const handleSaveEdit = async (id) => {
      await ownerStore.saveOwner(id, editingData.value);
      editingId.value = null;
      editingData.value = {};
      file.value = null;
    };

    const handleFileChange = (e) => {
      file.value = e.target.files[0];
    }

    return {
      ownerStore,
      editingId,
      editingData,
      file,
      handleCreateOwner,
      handleDeleteOwner,
      handleEditOwner,
      handleSaveEdit,
      handleFileChange,
    }
  }
}
</script>