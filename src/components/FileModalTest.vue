<template>
  <!-- Headless UI Dialog Component -->
  <TransitionRoot :show="isVisible" as="template" @keydown.escape="closeModal">
    <!-- Background Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 z-10"></div>

    <div class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen">
        <Dialog as="div" class="relative z-10" @close="closeModal">
          <!-- Modal Content -->
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            as="div"
          >
            <Dialog.Panel class="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
              <Dialog.Title class="text-xl font-bold mb-4">Files for {{ ownerName }}</Dialog.Title>

              <div v-if="fileUrls && fileUrls.length > 0">
                <ul>
                  <li v-for="(fileUrlArray, index) in fileUrls" :key="index" class="mb-2">
                    <a :href="fileUrlArray" target="_blank" rel="noopener noreferrer"
                      class="text-blue-500 hover:underline">{{ getFileName(fileUrlArray) }}</a>
                  </li>
                </ul>
              </div>
              <div v-else>
                <p>No files available for this owner</p>
              </div>

              <!-- Close Button -->
              <button @click="closeModal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800">x</button>
            </Dialog.Panel>
          </TransitionChild>
        </Dialog>
      </div>
    </div>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, TransitionRoot, TransitionChild } from '@headlessui/vue';

const props = defineProps({
  isVisible: Boolean,
  ownerName: String,
  fileUrls: Array,
});

const emit = defineEmits(['close']);

const getFileName = (url) => {
  if (typeof url === 'string') {
    return url.split('/').pop();
  } else {
    return 'Unknown File';
  }
};

const closeModal = () => {
  emit('close');
};
</script>
