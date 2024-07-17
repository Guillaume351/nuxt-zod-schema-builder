<template>
  <div>
    <h2 class="text-xl font-semibold mb-2">Current Schema</h2>
    <Card>
      <VCodeBlock
        :code="schemaPreview"
        highlightjs
        language="typescript"
        theme="default"
      />
    </Card>
    <FieldList />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSchemaStore } from "~/composables/stores/schemaStore";
import { schemaToCodeString } from "~/composables/useZodSchemaToCode";
import FieldList from "~/components/SchemaBuilder/FieldList.vue";

const schemaStore = useSchemaStore();

const schemaPreview = computed(() => {
  const { formSchema } = schemaStore.build();
  return schemaToCodeString(formSchema);
});
</script>
