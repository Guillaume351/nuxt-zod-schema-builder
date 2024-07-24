<template>
  <div>
    <h2 class="text-xl font-semibold mb-2">Add Field</h2>
    <AutoForm
      style="space-y-6"
      :schema="newFieldSchema"
      @submit="addField"
      :dependencies="newFieldDependencies"
    >
      <Button type="submit">Add Field</Button>
    </AutoForm>
  </div>
</template>

<script setup lang="ts">
import AutoForm from "../ui/auto-form/AutoForm.vue";
import {
  newFieldSchema,
  newFieldDependencies,
} from "~/composables/fieldSchema";
import { useSchemaStore } from "~/composables/stores/schemaStore";
import type { SchemaField } from "~/composables/useDynamicSchemaBuilder";

const schemaStore = useSchemaStore();

const addField = (data: any) => {
  if (data.name && data.type) {
    const field = { ...data } as SchemaField;
    schemaStore.addField(field);
  }
};
</script>
