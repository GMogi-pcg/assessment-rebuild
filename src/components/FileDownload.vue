<template>
  <div class="file-download">
    <h2>Download a File</h2>
    <input type="text" v-model="fileName" placeholder="Enter file name" />
    <button @click="downloadFile">Download</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fileName = ref('');

// download file function from worker
const downloadFile = async () => {
  if (!fileName.value) {
    alert('Please enter a file name');
    return;
  }

  try {
    const response = await fetch(`https://quiet-fire-9731.gmogi-work.workers.dev/${encodeURIComponent(fileName.value)}`);

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute('download', fileName.value);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      alert('File not found.');
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    alert('File download failed');
  }
}


</script>