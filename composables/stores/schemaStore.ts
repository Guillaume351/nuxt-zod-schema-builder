import { defineStore } from "pinia";
import { useSchemaBuilder } from "../useDynamicSchemaBuilder";

export const useSchemaStore = defineStore("schemaStore", () => {
  const schemaBuilder = useSchemaBuilder();

  return schemaBuilder;
});
