<template>
  <div class="p-4">
    <NewOwner @save="handleCreateOwner" />
    <div class="text-center my-4">
      <h2>Owners</h2>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center my-4">
      Loading Owners...
    </div>

    <!--Error State-->
    <div v-if="error" class="text-center my-4 text-red-500">{{ error }}</div>

    <!--Debugging: Show owners data for validation-->
      <!--<pre v-if="!isLoading && ownerStore.owners.length === 0">No owners found. Check the data: {{ ownerStore.owners }}</pre>-->

    <!-- Owners Table -->
    <table class="min-w-full bg-white" v-if="!isLoading && ownerStore.owners.length > 0">
      <thead>
        <tr>
          <th class="py-2 px-4 border-b">Name</th>
          <th class="py-2 px-4 border-b">Entity Type</th>
          <th class="py-2 px-4 border-b">Owner Type</th>
          <th class="py-2 px-4 border-b">Address</th>
          <th class="py-2 px-4 border-b">Files</th>
          <th class="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="owner in ownerStore.owners" :key="owner._id" >
          <!-- Editing Mode -->
          <template v-if="editingId === owner._id">
            <td class="py-2 px-4 border-b">
              <input type="text" v-model="editingData.name" class="shadow-md w-full" />
            </td>
            <td class="py-2 px-4 border-b">
              <input type="text" v-model="editingData.entityType" class="shadow-md w-full" />
            </td>
            <td class="py-2 px-4 border-b">
              <input type="text" v-model="editingData.ownerType" class="shadow-md w-full" />
            </td>
            <td class="py-2 px-4 border-b">
              <input type="text" v-model="editingData.address" class="shadow-md w-full" />
            </td>
            <td class="py-2 px-4 border-b">
              <input type="file" @change="handleFileChange" />
              <div v-if="editingData.files">
                <div v-for="(file, index) in editingData.files" :key="index">
                  <a :href="`/uploads/${file}`" target="_blank">{{ file }}</a>
                </div>
              </div>
            </td>
            <td class="py-2 px-4 border-b">
              <button @click="handleSaveEdit(owner._id)"
                class="bg-gray-700 hover:bg-gray-600 text-white px-4 rounded">Save</button>
            </td>
          </template>
          <!-- Display Mode -->
          <template v-else>
            <td class="py-2 px-4 border-b text-center">{{ owner.name }}</td>
            <td class="py-2 px-4 border-b text-center">{{ owner.entityType }}</td>
            <td class="py-2 px-4 border-b text-center">{{ owner.ownerType }}</td>
            <td class="py-2 px-4 border-b text-center">{{ owner.address }}</td>
            <td class="py-2 px-4 border-b text-center">
              <div>
                <a v-for="(file, index) in owner.files" :key="index" :href="`/uploads/${file}`" target="_blank">{{ file
                  }}</a>
              </div>
            </td>
            <td class="py-2 px-4 border-b text-center">
              <button @click="handleEditOwner(owner)"
                class="bg-gray-700 hover:bg-gray-600 text-white px-4 h-8 rounded">Edit</button>
              <button @click="handleDeleteOwner(owner._id)"
                class="bg-red-700 hover:bg-red-600 text-white px-4 h-8 my-1 rounded">Delete</button>
            </td>

          </template>

        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import NewOwner from '../components/NewOwner.vue';
import { useOwnerStore } from '../stores/ownerStore';

export default {
  components: { NewOwner, },
  setup() {
    const ownerStore = useOwnerStore();
    const editingId = ref(null);
    const editingData = ref({});
    const file = ref(null);
    const isLoading = ref(true);
    const error = ref(null);

    // Load owners when the component is mounted
    onMounted(async () => {
      try {
        await ownerStore.loadOwners();
      } catch (err) {
        console.error('Error loading owners', err);
        error.value = 'Failed to load owners';
      } finally {
        isLoading.value = false;
      }
    });

    const handleCreateOwner = async (newOwner) => {
      await ownerStore.addOwner(newOwner);
    };

    const handleDeleteOwner = async (id) => {
      await ownerStore.removeOwner(id);
    };

    const handleEditOwner = async (owner) => {
      ownerStore.selectOwner(owner);
      editingId.value = owner._id;
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
      isLoading,
      error,
      handleCreateOwner,
      handleDeleteOwner,
      handleEditOwner,
      handleSaveEdit,
      handleFileChange,
    }
  }
}
</script>