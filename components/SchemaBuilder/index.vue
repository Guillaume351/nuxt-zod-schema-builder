<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Zod Schema Builder</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <AddFieldForm />
      <SchemaPreview />
      <TestForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import AddFieldForm from "./AddFieldForm.vue";
import SchemaPreview from "./SchemaPreview.vue";
import TestForm from "./TestForm.vue";
</script>
