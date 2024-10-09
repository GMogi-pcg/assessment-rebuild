<template>
  <!--Background Overlay-->
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 z-10"></div>

  <div v-if="isVisible" class="fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative" :style="{ minWidth: 'fit-content', maxWidth: '90vm'}" >
        <h3 class="text-xl font-bold mb-4">Files for {{ ownerName }}</h3>
        <div v-if="fileUrls && fileUrls.length > 0">
          <ul>
            <li v-for="(fileUrlArray, index) in fileUrls" :key="index" class="mb-2">
              <a :href="fileUrlArray" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">{{ getFileName(fileUrlArray[0]) }}</a>
              <button @click="deletedFile(fileUrlArray[index])" class="ml-4 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">x</button>
            </li>
          </ul>
        </div>
        <div v-else>
          <p>No files available for this owner</p>
        </div>
        <button @click="closeModal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
          x
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>


const props = defineProps({
  isVisible: Boolean,
  ownerName: String,
  fileUrls: Array,
});

const emit = defineEmits(['close','delete']);

const getFileName = (url) => {
  if (typeof url === 'string') {
    return url.split('/').pop();
  } else {
    return 'Unknown File';
  }
}

const closeModal = () => {
  emit('close');
}

const deletedFile = (url) => {
  emit('delete', url, props.ownerId);
}
</script>