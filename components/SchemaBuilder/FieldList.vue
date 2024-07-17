<template>
  <div v-for="field in Object.keys(schemaStore.fieldDetails)" :key="field">
    <p>{{ field }}</p>
    <EditFieldModal :field-name="field" />
  </div>
</template>

<script setup lang="ts">
import { useSchemaStore } from "~/composables/stores/schemaStore";
import EditFieldModal from "~/components/SchemaBuilder/EditFieldModal.vue";

const schemaStore = useSchemaStore();
</script>
