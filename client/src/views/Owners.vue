<template>
  <div>
    <NewOwner @save="handleSave" />
  </div>
</template>

<script>
import NewOwner from '../components/NewOwner.vue';

export default {
  components: { NewOwner, },
}

</script>