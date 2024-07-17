<template>
  <div>
    <h2 class="text-xl font-semibold mb-2">Autoform</h2>
    <Card>
      <AutoForm
        style="space-y-6"
        :schema="schemaStore.rawSchema()"
        @submit="testValidation"
      >
        <Button type="submit">Test validation</Button>
      </AutoForm>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useSchemaStore } from "~/composables/stores/schemaStore";
import AutoForm from "../ui/auto-form/AutoForm.vue";

const schemaStore = useSchemaStore();

const testValidation = (data: any) => {
  console.log(data);
  console.log("for info, raw schema is", schemaStore.rawSchema());
};
</script>
