import { z } from "zod";
import {
  DependencyType,
  type Dependency,
} from "~/components/ui/auto-form/interface";

export const newFieldSchema = z.object({
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

export const newFieldDependencies = [
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
