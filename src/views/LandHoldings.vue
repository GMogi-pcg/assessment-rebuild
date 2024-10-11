<template>
  <div>
    <NavBar />
    <div class="p-4">
      <NewLandHolding />
      <div class="text-center my-4">
        <h2 class="text-xl font-bold mb-4">Land Holdings</h2>
      </div>

      <!-- Loading State -->
      <div v-if="landHoldingStore.isLoading" class="text-center my-4">
        Loading Land Holdings...
      </div>

      <!-- Error State -->
      <div v-if="landHoldingStore.error" class="text-center my-4 text-red-500">{{ landHoldingStore.error }}</div>

      <!-- Land Holdings Table -->
      <table class="min-w-full bg-white" v-if="!landHoldingStore.isLoading && landHoldingStore.landHoldings.length > 0">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">Name</th>
            <th class="py-2 px-4 border-b">Owner</th>
            <th class="py-2 px-4 border-b">Legal Entity</th>
            <th class="py-2 px-4 border-b">Net Mineral Acres</th>
            <th class="py-2 px-4 border-b">Mineral Owner Royalty</th>
            <th class="py-2 px-4 border-b">Section Name</th>
            <th class="py-2 px-4 border-b">Section</th>
            <th class="py-2 px-4 border-b">Township</th>
            <th class="py-2 px-4 border-b">Range</th>
            <th class="py-2 px-4 border-b">Title Source</th>
            <th class="py-2 px-4 border-b">Files</th>
            <th class="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="landHolding in landHoldingStore.landHoldings" :key="landHolding._id">
            <!-- Editing Mode -->
            <template v-if="landHoldingStore.editingId === landHolding._id">
              <td class="py-2 px-4 border-b w-full text-center">
                {{landHoldingStore.editingData.section }}-{{ landHoldingStore.editingData.township }}-{{ landHoldingStore.editingData.range }}-{{ landHoldingStore.editingData.legalEntity }}
              </td>
              <td class="py-2 px-4 border-b text-center">
                {{ landHolding.owner ? landHolding.owner.name : 'No Owner' }}
              </td>
              <td class="py-2 px-4 border-b">
                <input type="text" v-model="landHoldingStore.editingData.legalEntity" class="shadow-md text-center " />
              </td>
              <td class="py-2 px-4 border-b">
                <input type="number" v-model="landHoldingStore.editingData.netMineralAcres" class="shadow-md text-center w-16" />
              </td>
              <td class="py-2 px-4 border-b">
                <input type="number" v-model="landHoldingStore.editingData.mineralOwnerRoyalty" class="shadow-md text-center w-16 " />
              </td>
              <td class="py-2 px-4 border-b text-center w-4/5">
                {{ landHolding.sectionName }}
              </td>
              <td class="py-2 px-4 border-b">
                <input type="text" v-model="landHoldingStore.editingData.section" class="shadow-md w-full" />
              </td>
              <td class="py-2 px-4 border-b">
                <input type="text" v-model="landHoldingStore.editingData.township" class="shadow-md w-full" />
              </td>
              <td class="py-2 px-4 border-b">
                <input type="text" v-model="landHoldingStore.editingData.range" class="shadow-md w-full" />
              </td>
              <td class="py-2 px-4 border-b">
                <select v-model="landHoldingStore.editingData.titleSource" class="shadow-md w-13 text-center">
                  <option disabled value="">Select Title Source</option>
                  <option v-for="source in titleSourceOptions" :key="source" :value="source">{{ source }}</option>
                </select>
              </td>
              <!--Files Input (Editable)-->
              <td class="py-2 px-4 border-b w-4/5">
                <input type="file" @change="landHoldingStore.handleFileChange" />
                <div v-if="landHoldingStore.editingData.files">
                  <div v-for="(file, index) in landHoldingStore.editingData.files" :key="index">
                    <a :href="`/uploads/${file}`" target="_blank">{{ file }}</a>
                  </div>
                </div>
              </td>
              <td class="py-2 px-4 border-b">
                <button @click="handleSaveEdit(landHolding._id)"
                  class="bg-gray-700 hover:bg-gray-600 text-white px-4 rounded">Save</button>
              </td>
            </template>

            <!-- Display Mode -->
            <template v-else>
              <td class="py-2 px-4 border-b text-center">{{ `${landHolding.section}-${landHolding.township}-${landHolding.range}` }}</td>
              <td class="py-2 px-4 border-b text-center">{{ landHolding.owner ? landHolding.owner.name : 'No Owner' }}
              </td>
              <td class="py-2 px-4 border-b text-center">{{ landHolding.legalEntity }}</td>
              <td class="py-2 px-4 border-b text-center">{{ landHolding.netMineralAcres }}</td>
              <td class="py-2 px-4 border-b text-center">{{ landHolding.mineralOwnerRoyalty }}</td>
              <td class="py-2 px-4 border-b text-center">{{ landHolding.sectionName }}</td>
              <td class="py-2 px-4 border-b text-center">{{ landHolding.section }}</td>
              <td class="py-2 px-4 border-b text-center">{{ landHolding.township }}</td>
              <td class="py-2 px-4 border-b text-center">{{ landHolding.range }}</td>
              <td class="py-2 px-4 border-b text-center">{{ landHolding.titleSource }}</td>
              <td class="py-2 px-4 border-b text-center">
                <button @click="openFileModal(landHolding)" class="text-blue-500 hover:no-underline">
                  View Files
                </button>
              </td>
              <td class="py-2 px-4 border-b text-center">
                <button @click="handleEditLandHolding(landHolding)"
                  class="bg-gray-700 hover:bg-gray-600 text-white px-4 h-8 rounded">Edit</button>
                <button @click="handleDeleteLandHolding(landHolding._id)"
                  class="bg-red-700 hover:bg-red-600 text-white px-4 h-8 my-1 rounded">Delete</button>
              </td>
            </template>

          </tr>
        </tbody>
      </table>
      <FileModal :isVisible="isModalVisible" :fileUrls="selectedFileUrls" :ownerName="selectedLandholding"
        @close="closeModal" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import NewLandHolding from '../components/NewLandHolding.vue';
import { useLandHoldingStore } from '../stores/landHoldingStore';
import FileModal from '../components/FileModal.vue';
import NavBar from '../components/NavBar.vue';

// Dropdown options for title source
const titleSourceOptions = ['Class A', 'Class B', 'Class C', 'Class D'];

const landHoldingStore = useLandHoldingStore();
// const editingId = ref(null);
// const editingData = ref({});
// const isLoading = ref(true);
// const error = ref(null);
// const selectedFiles = ref([]);

// Modal state
const isModalVisible = ref(false);
const selectedFileUrls = ref([]);
const selectedLandholding = ref('');

// Load land holdings when the component is mounted
onMounted(async () => {
  try {
    await landHoldingStore.loadLandHoldings();
  } catch (err) {
    console.error('Error loading land holdings', err);
    landHoldingStore.error.value = 'Failed to load land holdings';
  }
});

const openFileModal = (landHolding) => {
  console.log('Files URLS:', landHolding.fileUrls)
  selectedFileUrls.value = landHolding.fileUrls;
  selectedLandholding.value = landHolding.name;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};


const handleDeleteLandHolding = async (id) => {
  try {
    await landHoldingStore.removeLandHolding(id);
  } catch (error) {
    console.error('Error deleting land holding', error);
    error.value = 'Failed to delete land holding';
  }
}

const handleEditLandHolding = async (landHolding) => {
  landHoldingStore.selectLandHolding(landHolding);
  // editingId.value = landHolding._id;
  // editingData.value = { ...landHolding };
};

const handleSaveEdit = async (id) => {
  // await landHoldingStore.saveLandHolding(id, landHoldingStore.editingData, landHoldingStore.selectedFiles);
  // const updatedLandHolding = { ...editingData.value };

  // if (selectedFiles.value.length > 0) {
  //   await landHoldingStore.saveLandHolding(id, editingData.value, selectedFiles.value);
  // } else {
  //   await landHoldingStore.saveLandHolding(id, updatedLandHolding);
  // }

  // editingId.value = null;
  // editingData.value = {};
  // selectedFiles.value = [];
  const { section, township, range, legalEntity } = landHoldingStore.editingData;
  landHoldingStore.editingData.name = `${section}-${township}-${range}-${legalEntity}`;

  await landHoldingStore.saveLandHolding(id, landHoldingStore.editingData, landHoldingStore.selectedFiles);
  landHoldingStore.clearEditing();

};


// const handleFileChange = (event) => {
//   selectedFiles.value = [...event.target.files];
// };
</script>
