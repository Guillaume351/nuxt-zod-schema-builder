<template>
  <div>
    <button data-testid="edit-field-button" @click="startEdit">
      Edit Field (Test Button)
    </button>
    <Dialog>
      <DialogTrigger as="button" class="btn btn-primary" @click="startEdit">
        <Button type="outline">Edit Field</Button>
      </DialogTrigger>
      <DialogContent>
        <AutoForm
          style="space-y-6"
          :schema="editFieldSchema"
          @submit="updateField"
          :dependencies="newFieldDependencies"
        >
          <DialogClose as-child>
            <Button type="submit">Update Field</Button>
          </DialogClose>
        </AutoForm>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import { useSchemaStore } from "~/composables/stores/schemaStore";
import AutoForm from "~/components/ui/auto-form/AutoForm.vue";
import { newFieldDependencies } from "~/composables/fieldSchema";

const props = defineProps<{ fieldName: string }>();
const schemaStore = useSchemaStore();

const editFieldSchema = ref();

const startEdit = () => {
  if (schemaStore.editingField)
    // TODO: fix typing, it should be a Ref and not string
    (schemaStore.editingField as any).value = props.fieldName;
  const field = schemaStore.fieldDetails[props.fieldName];
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
  schemaStore.editField(props.fieldName, data);
};
</script>
