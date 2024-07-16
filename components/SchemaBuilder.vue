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

        <div
          v-for="field in Object.keys(schemaStore.fieldDetails)"
          :key="field"
        >
          <p>{{ field }}</p>
          <!-- Edit Field Form Modal -->
          <Dialog>
            <DialogTrigger
              as="button"
              class="btn btn-primary"
              @click="startEdit(field)"
            >
              <Button type="outline"> Edit Field </Button>
            </DialogTrigger>
            <DialogContent>
              <AutoForm
                style="space-y-6"
                :schema="editFieldSchema"
                @submit="updateField"
                :dependencies="newFieldDependencies"
              >
              </AutoForm>
              <DialogFooter>
                <DialogClose as-child>
                  <Button type="submit">Update Field</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { z } from "zod";
import AutoForm from "./ui/auto-form/AutoForm.vue";
import { schemaToCodeString } from "~/composables/useZodSchemaToCode";
import { DependencyType, type Dependency } from "./ui/auto-form/interface";
import { useSchemaStore } from "~/composables/stores/schemaStore";
import type { SchemaField } from "~/composables/useDynamicSchemaBuilder";

const schemaStore = useSchemaStore();
const newFieldSchema = z.object({
  name: z.string().min(1),
  type: z
    .enum(["string", "number", "boolean", "date", "array", "object", "enum"])
    .default("string"),
  min: z.coerce.number().optional(),
  max: z.coerce.number().optional(),
  required: z.boolean().optional(),
  description: z.string().optional(),
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
    schemaStore.addField(field);
  }
};

const isEditing = ref(false);
const editingFieldName = computed(() => schemaStore.editingField);
const editFieldSchema = ref();
const startEdit = (fieldName: string) => {
  schemaStore.editingField = fieldName;
  isEditing.value = true;

  // fill the zod schema with the initial values
  const field = schemaStore.fieldDetails[fieldName];
  if (field) {
    editFieldSchema.value = z.object({
      name: z.string().min(1).default(field.name),
      type: z
        .enum([
          "string",
          "number",
          "boolean",
          "date",
          "array",
          "object",
          "enum",
        ])
        .default(field.type),
      min: z.coerce.number().optional().default(field?.min),
      max: z.coerce.number().optional().default(field?.max),
      required: z.boolean().optional().default(field?.required),
      description: z.string().optional().default(field?.description),
      values: z.string().array().optional().default(field?.values),
    });
  }
};

const updateField = (data: any) => {
  if (editingFieldName.value) {
    schemaStore.editField(editingFieldName.value, data);
  }
  isEditing.value = false;
};

const cancelEdit = () => {
  isEditing.value = false;
};

const schemaPreview = computed(() => {
  const { formSchema } = schemaStore.build();
  return schemaToCodeString(formSchema);
});

const testValidation = (data: any) => {
  // Show a popup with the validation result
  console.log(data);
  console.log("for info, raw schema is", schemaStore.rawSchema());
};
</script>
