<template>
  <div class="p-4 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
    <h2 class="text-xl font-bold mb-4">Add New Land Holding</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Legal Entity -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Legal Entity</label>
        <input v-model="landHolding.legalEntity"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <!-- Owner Dropdown -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Owner</label>
        <select v-model="landHolding.owner" required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          <option disabled value="">Select Owner</option>
          <option v-for="owner in owners" :key="owner._id" :value="owner._id">{{ owner.name }}</option>
        </select>
      </div>
      <!-- Net Mineral Acres -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Net Mineral Acres</label>
        <input v-model="landHolding.netMineralAcres" type="number"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <!--Mineral Owner Royalty-->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Mineral Owner Royalty %</label>
        <input v-model="landHolding.mineralOwnerRoyalty" type="number"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <!--Section-->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Section</label>
        <input :value="landHolding.section" @input="handleSectionChange" placeholder="(e.g., 123)" maxlength="3"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        <p v-if="!isSectionValid" class="text-red-500 text-xs italic">Section must be 3 digits</p>
      </div>
      <!--Township-->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Township</label>
        <input :value="landHolding.township" @input="handleTownshipChange" placeholder="(e.g., 123N or 123S)"
          maxlength="4"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        <p v-if="!isTownshipValid" class="text-red-500 text-xs italic">Section must be 3 digits and end with N or S</p>
      </div>
      <!--Range-->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Range</label>
        <input :value="landHolding.range" @input="handleRangeChange" placeholder="(e.g., 123W or 123E)" maxlength="4"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        <p v-if="!isRangeValid" class="text-red-500 text-xs italic">Section must be 3 digits and end with E or W</p>
      </div>
      <!--Title Source dropdown-->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Title Source</label>
        <select v-model="landHolding.titleSource" required
          class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          <option disabled value="">Select Title Source</option>
          <option v-for="type in titleSourceOptions" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
    </div>

    <!--FileUpload-->
    <div class="py-2">
      <h3 class="font-bold mb-2">Upload Files</h3>
      <input type="file" @change="handleFileChange" ref="fileInput" class="py-2" multiple />
    </div>

    <div class="py-2">
      <button @click="handleSave"
        class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Save</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useOwnerStore } from '../stores/ownerStore';
import { useLandHoldingStore } from '../stores/landHoldingStore';

const emit = defineEmits(['save']);

const titleSourceOptions = ['Class A', 'Class B', 'Class C', 'Class D'];
const landHoldingStore = useLandHoldingStore();

// Fetch owner to populate dropdown
const ownerStore = useOwnerStore();
const owners = ref([]);

onMounted(async () => {
  try {
    await ownerStore.loadOwners();
    owners.value = ownerStore.owners;
  } catch (error) {
    console.error('Error fetching owners for dropdown', error);
  }
});

const landHolding = reactive({
  legalEntity: '',
  owner: '',
  legalEntity: '',
  netMineralAcres: 0,
  mineralOwnerRoyalty: 0,
  sectionName: '',
  section: '',
  township: '',
  range: '',
  titleSource: '',
  files: [],
});

const isSectionValid = ref(true);
const isTownshipValid = ref(true);
const isRangeValid = ref(true);

const selectedFiles = ref([]);
const fileInput = ref(null);

function handleSectionChange(event) {
  const value = event.target.value;
  if (/^\d{0,3}$/.test(value)) {
    landHolding.section = value;
  } else {
    event.target.value = landHolding.section;
  }

  // check if section is 3 digits
  isSectionValid.value = landHolding.section.length === 3;
};

const handleTownshipChange = (event) => {
  const value = event.target.value.toUpperCase();
  if (/^\d{0,3}[NS]?$/.test(value)) {
    landHolding.township = value;
  } else {
    event.target.value = landHolding.township;
  }

  // check if section is 3 digits
  isTownshipValid.value = landHolding.township.length === 4;
};

const handleRangeChange = (event) => {
  const value = event.target.value.toUpperCase();
  if (/^\d{0,3}[EW]?$/.test(value)) {
    landHolding.range = value;
  } else {
    event.target.value = landHolding.range;
  }

  // check if section is 3 digits
  isRangeValid.value = landHolding.range.length === 4;
};

const handleFileChange = (event) => {
  selectedFiles.value = Array.from(event.target.files);
};

// handl save with additonal checks

const handleSave = async () => {
  if (!landHolding.legalEntity || !landHolding.owner || !landHolding.netMineralAcres || !landHolding.mineralOwnerRoyalty || !landHolding.section || !landHolding.township || !landHolding.range || !landHolding.titleSource) {
    alert('Please fill out all fields');
    return;
  }

  if (!isSectionValid.value) {
    alert('Section must be 3 digits');
    return;
  }
  if (!isTownshipValid.value) {
    alert('Township must be 3 digits and may end with N or S');
    return;
  }
  if (!isRangeValid.value) {
    alert('Range must be 3 digits and may end with E or W');
    return;
  }
  // emit('save', { ...landHolding });
  try {
    await landHoldingStore.addLandHolding({ ...landHolding }, selectedFiles.value || []);

    // reset form
    landHolding.legalEntity = '';
    landHolding.owner = '';
    landHolding.netMineralAcres = 0;
    landHolding.mineralOwnerRoyalty = 0; 
    landHolding.section = '';
    landHolding.township = '';
    landHolding.range = '';
    landHolding.titleSource = '';

    if (fileInput.value) {
      fileInput.value.value = '';
    }
  } catch (error) {
    console.error('Error adding land holding:', error);
    alert('Failed to add land holding');
  }
}

</script>