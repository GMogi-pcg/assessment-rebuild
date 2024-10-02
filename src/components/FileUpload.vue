<template>
  <div class="file-upload">
    <h2>Upload a File</h2>
    <input type="file" @change="handleFileChange" />
    <button @click="uploadFile">Upload</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedFile = ref(null);
const emit = defineEmits(['file-uploaded', 'file-selected']);

// file selection
const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
  emit('file-selected', selectedFile.value);
};

// file upload
const uploadFile = async () => {
  if (!selectedFile.value) {
    alert('Please select a file');
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile.value);

  try {
    const reponse = await fetch('https://quiet-fire-9731.gmogi-work.workers.dev/', {
      method: 'POST',
      body: formData,
    });

    if (reponse.ok) {
      emit('file-uploaded', selectedFile.value);
      alert('File uploaded successfully');
    } else {
      alert('File upload failed');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    alert('File upload failed');
  }
}

</script>

<style scoped>
.file-upload {
  margin: 20px;
}
</style>