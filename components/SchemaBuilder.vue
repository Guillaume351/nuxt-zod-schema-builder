<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Zod Schema Builder</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <h2 class="text-xl font-semibold mb-2">Add Field</h2>
        <Form @submit="addField">
          <FormField name="name" label="Field Name">
            <Input v-model="newField.name" placeholder="Enter field name" />
          </FormField>
          <FormField name="type" label="Field Type">
            <Select v-model="newField.type">
              <SelectTrigger class="w-[280px]">
                <SelectValue placeholder="Select field type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="type in fieldTypes" :key="type" :value="type">
                  {{ type }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <!-- Add more form fields for other properties based on the selected type -->
          <Button type="submit">Add Field</Button>
        </Form>
      </div>
      <div>
        <h2 class="text-xl font-semibold mb-2">Current Schema</h2>
        <Card>
          <VCodeBlock :code="schemaPreview" highlightjs language="typescript" theme="default" />
        </Card>
      </div>
      <div>
        <h2 class="text-xl font-semibold mb-2">Autoform</h2>
        <Card>
          <AutoForm :schema="builder.rawSchema()" />
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

const builder = reactive(new DynamicSchemaBuilder());

const newField = ref<Partial<SchemaField>>({
  name: "",
  type: "string",
});


const fieldTypes = [
  "string",
  "number",
  "boolean",
  "date",
  "array",
  "object",
  "enum",
];

const schemaFields = ref<SchemaField[]>([]);

const addField = () => {
  if (newField.value.name && newField.value.type) {
    const field = { ...newField.value } as SchemaField;
    builder.addField(field);
    schemaFields.value.push(field);
    newField.value = { name: "", type: "string" };
  }
};

const schemaPreview = computed(() => {
  const { formSchema } = builder.build();
  const generatedCode = schemaToCodeString(formSchema);

  return (generatedCode);
});

</script>
