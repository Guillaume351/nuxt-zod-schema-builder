import { defineStore } from "pinia";
import { useSchemaBuilder } from "../useDynamicSchemaBuilder";
import type { SchemaField } from "../useDynamicSchemaBuilder";

export const useSchemaStore = defineStore("schemaStore", () => {
  const schemaBuilder = useSchemaBuilder();

  function addField(field: SchemaField) {
    schemaBuilder.addField(field);
  }

  return {
    ...schemaBuilder,
    addField,
  };
});
