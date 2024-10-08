<template>
  <div>
    <NavBar />
    <div class="p-4">
      <NewOwner />
      <div class="text-center my-4">
        <h2 class="text-xl font-bold mb-4">Owners</h2>
      </div>

      <!-- Loading State -->
      <div v-if="ownerStore.isLoading" class="text-center my-4">
        Loading Owners...
      </div>

      <!--Error State-->
      <div v-if="ownerStore.error" class="text-center my-4 text-red-500">{{ ownerStore.error }}</div>

      <!--Debugging: Show owners data for validation-->
      <!--<pre v-if="!isLoading && ownerStore.owners.length === 0">No owners found. Check the data: {{ ownerStore.owners }}</pre>-->

      <!-- Owners Table -->
      <table class="min-w-full bg-white" v-if="!ownerStore.isLoading && ownerStore.owners.length > 0">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">Name</th>
            <th class="py-2 px-4 border-b">Entity Type</th>
            <th class="py-2 px-4 border-b">Owner Type</th>
            <th class="py-2 px-4 border-b">Address</th>
            <th class="py-2 px-4 border-b">Total Land Holdings</th>
            <th class="py-2 px-4 border-b">Files</th>
            <th class="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="owner in ownerStore.owners" :key="owner._id">
            <!-- Editing Mode -->
            <template v-if="ownerStore.editingId === owner._id">
              <td class="py-2 px-4 border-b">
                <input type="text" v-model="ownerStore.editingData.name" class="shadow-md w-full" />
              </td>

              <!--Entity Dropdown-->
              <td class="py-2 px-4 border-b">
                <select v-model="ownerStore.editingData.entityType" class="shadow-md w-full">
                  <option disabled value="">Select Entity Type</option>
                  <option v-for="type in entityTypes" :key="type" :value="type">{{ type }}</option>
                </select>
              </td>
              <!-- OwnerType Dropdown-->
              <td class="py-2 px-4 border-b">
                <select v-model="ownerStore.editingData.ownerType" class="shadow-md w-full">
                  <option disabled value="">Select Owner Type</option>
                  <option v-for="type in ownerTypes" :key="type" :value="type">{{ type }}</option>
                </select>
              </td>
              <!--Address Input-->
              <td class="py-2 px-4 border-b">
                <input type="text" v-model="ownerStore.editingData.address" class="shadow-md w-full" />
              </td>
              <!-- Total Land Holdings (non-editable during edit mode) -->
              <td class="py-2 px-4 border-b text-center">
                {{ owner.totalLandHoldings }}
              </td>
              <!-- Files Input (Editable) -->
              <td class="py-2 px-4 border-b">
                <input type="file" @change="ownerStore.handleFileChange" />
                <div v-if="ownerStore.editingData.files">
                  <div v-for="(file, index) in ownerStore.editingData.files" :key="index">
                    <a :href="`/uploads/${file}`" target="_blank">{{ file }}</a>
                  </div>
                </div>
              </td>
              <!-- Save Button -->
              <td class="py-2 px-4 border-b">
                <button @click="ownerStore.saveOwner(owner._id)"
                  class="bg-gray-700 hover:bg-gray-600 text-white px-4 rounded">Save</button>
              </td>
            </template>

            <!-- Display Mode -->
            <template v-else>
              <td class="py-2 px-4 border-b text-center">{{ owner.name }}</td>
              <td class="py-2 px-4 border-b text-center">{{ owner.entityType }}</td>
              <td class="py-2 px-4 border-b text-center">{{ owner.ownerType }}</td>
              <td class="py-2 px-4 border-b text-center">{{ owner.address }}</td>
              <td class="py-2 px-4 border-b text-center">{{ owner.totalLandHoldings }}</td>
              <td class="py-2 px-4 border-b text-center">
                <button @click="ownerStore.openFileModal(owner)" class="text-blue-500 hover:underline">
                  View Files
                </button>
              </td>
              <td class="py-2 px-4 border-b text-center">
                <button @click="editOwner(owner)"
                  class="bg-gray-700 hover:bg-gray-600 text-white px-4 h-8 rounded">Edit</button>
                <button @click="deleteOwner(owner._id)"
                  class="bg-red-700 hover:bg-red-600 text-white px-4 h-8 my-1 rounded">Delete</button>
              </td>
            </template>

          </tr>
        </tbody>
      </table>
      <FileModal :isVisible="ownerStore.isModalVisible" :fileUrls="ownerStore.selectedFileUrls" :ownerName="ownerStore.selectedOwnerName" :ownerId="ownerStore.selectedOwnerId"
        @close="ownerStore.closeFileModal" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import NewOwner from '../components/NewOwner.vue';
import FileModal from '../components/FileModal.vue';
import { useOwnerStore } from '../stores/ownerStore';
import NavBar from '../components/NavBar.vue';

// Dropdown options
const entityTypes = ['Individual', 'Company', 'Investor', 'Trust'];
const ownerTypes = ['Competitor', 'Seller', 'Investor', 'Professional'];

const ownerStore = useOwnerStore();

// Load owners when the component is mounted
onMounted(async () => {
  try {
    await ownerStore.loadOwners();
  } catch (err) {
    console.error('Error loading owners', err);
    ownerStore.error = 'Failed to load owners';
  }
});

const deleteOwner = async (id) => {
  await ownerStore.removeOwner(id);
};

const editOwner = async (owner) => {
  ownerStore.selectOwner(owner);
  // ownerStore.editingId.value = owner._id;
  // ownerStore.editingData.value = { ...owner }
};

// Delete file
// const handleFileDelete = async (fileUrl, ownerId) => {
//   if (!fileUrl || !ownerId) {
//     console.error('Invalid fileUrl or ownerId');
//     return;
//   }

//   try {
//     await ownerStore.removeFile(ownerId, fileUrl);
//     selectedFileUrls.value = selectedFileUrls.value.filter((fileArr) => fileArr[0] !== fileUrl);
//   } catch (error) {
//     console.error('Error deleting file', error);
//   }
// };  


</script>