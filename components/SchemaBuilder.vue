<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Zod Schema Builder</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <h2 class="text-xl font-semibold mb-2">Add Field</h2>
        <AutoForm style="space-y-6" :schema="newFieldSchema" @submit="addField">
          <Button type="submit">Add Field</Button>
        </AutoForm>
      </div>
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
      </div>
      <div>
        <h2 class="text-xl font-semibold mb-2">Autoform</h2>
        <Card>
          <AutoForm style="space-y-6" :schema="builder.rawSchema()" />
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import {
  DynamicSchemaBuilder,
  type SchemaField,
} from "~/lib/utils/DynamicSchemaBuilder";
import AutoForm from "./ui/auto-form/AutoForm.vue";
import { schemaToCodeString } from "~/lib/utils/ZodSchemaToCode";
import { z } from "zod";

const builder = reactive(new DynamicSchemaBuilder());

const newFieldSchema = z.object({
  name: z.string().min(1),
  type: z.enum([
    "string",
    "number",
    "boolean",
    "date",
    "array",
    "object",
    "enum",
  ]),
  required: z.boolean().optional(),
  description: z.string().optional(),
});

const schemaFields = ref<SchemaField[]>([]);

const addField = (data: any) => {
  if (data.name && data.type) {
    const field = { ...data } as SchemaField;

    builder.addField(field);
  }
};

const schemaPreview = computed(() => {
  const { formSchema } = builder.build();
  const generatedCode = schemaToCodeString(formSchema);

  return generatedCode;
});
</script>
