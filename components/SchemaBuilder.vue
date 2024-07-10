<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Zod Schema Builder</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <AutoForm
            style="space-y-6"
            :schema="builder.rawSchema()"
            @submit="testValidation"
          >
            <Button type="submit">Test validation</Button>
          </AutoForm>
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
import { DependencyType, type Dependency } from "./ui/auto-form/interface";

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
  min: z.coerce.number().optional(),
  max: z.coerce.number().optional(),
  required: z.boolean().optional(),
  description: z.string().optional(),
  // values for enum
  values: z.string().array().optional(),
});

const newFieldDependencies = [
  {
    sourceField: "type",
    type: DependencyType.HIDES,
    targetField: "values",
    when: (sourceFieldValue: any) => sourceFieldValue !== "enum",
  },
  {
    sourceField: "type",
    type: DependencyType.HIDES,
    targetField: "min",
    when: (sourceFieldValue: any) =>
      sourceFieldValue !== "number" && sourceFieldValue !== "string",
  },
  {
    sourceField: "type",
    type: DependencyType.HIDES,
    targetField: "max",
    when: (sourceFieldValue: any) =>
      sourceFieldValue !== "number" && sourceFieldValue !== "string",
  },
] as Dependency<z.infer<typeof newFieldSchema>>[];

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

const testValidation = (data: any) => {
  // Show a popup with the validation result
  console.log(data);
  console.log("for info, raw schema is", builder.rawSchema());
};
</script>
