import type { JSX } from "vue/jsx-runtime";
import * as z from "zod";

type SchemaType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "array"
  | "object"
  | "enum";

interface BaseSchemaField {
  name: string;
  type: SchemaType;
  required?: boolean;
  description?: string;
}

interface StringSchemaField extends BaseSchemaField {
  type: "string";
  min?: number;
  max?: number;
  regex?: string;
}

interface NumberSchemaField extends BaseSchemaField {
  type: "number";
  min?: number;
  max?: number;
}

interface BooleanSchemaField extends BaseSchemaField {
  type: "boolean";
}

interface DateSchemaField extends BaseSchemaField {
  type: "date";
}

interface ArraySchemaField extends BaseSchemaField {
  type: "array";
  items: SchemaField;
}

interface ObjectSchemaField extends BaseSchemaField {
  type: "object";
  properties: Record<string, SchemaField>;
}

interface EnumSchemaField extends BaseSchemaField {
  type: "enum";
  values: string[];
}

type SchemaField =
  | StringSchemaField
  | NumberSchemaField
  | BooleanSchemaField
  | DateSchemaField
  | ArraySchemaField
  | ObjectSchemaField
  | EnumSchemaField;

interface FieldConfig {
  inputProps?: Record<string, any>;
  description?: string | JSX.Element | JSX.Element[];
  fieldType?: string;
}

export type DependencyType = "HIDES" | "SHOWS" | "ENABLES" | "DISABLES";

export interface Dependency {
  sourceField: string;
  type: DependencyType;
  targetField: string;
  when: (value: any) => boolean;
}

export function useSchemaBuilder() {
  const schema = reactive<Record<string, z.ZodTypeAny>>({});
  const fieldConfig = reactive<Record<string, FieldConfig>>({});
  const dependencies = ref<Dependency[]>([]);
  const fieldDetails = reactive<Record<string, SchemaField>>({});
  const editingField: Ref<string | null> = ref<string | null>(null);

  function addField(field: SchemaField, config?: FieldConfig) {
    let zodType: z.ZodTypeAny;

    switch (field.type) {
      case "string":
        zodType = z.string({
          required_error: `${field.name} is required.`,
        });
        if (field.min)
          zodType = zodType.min(field.min, {
            message: `${field.name} must be at least ${field.min} characters.`,
          });
        if (field.max)
          zodType = zodType.max(field.max, {
            message: `${field.name} must be at most ${field.max} characters.`,
          });
        if (field.regex) zodType = zodType.regex(new RegExp(field.regex));
        break;
      case "number":
        zodType = z.coerce.number({
          required_error: `${field.name} is required.`,
          invalid_type_error: `${field.name} must be a number.`,
        });
        if (field.min)
          zodType = zodType.min(field.min, {
            message: `${field.name} must be at least ${field.min}.`,
          });
        if (field.max)
          zodType = zodType.max(field.max, {
            message: `${field.name} must be at most ${field.max}.`,
          });
        break;
      case "boolean":
        zodType = z.boolean({
          required_error: `${field.name} is required.`,
        });
        break;
      case "date":
        zodType = z.coerce.date({
          required_error: `${field.name} is required.`,
          invalid_type_error: `${field.name} must be a valid date.`,
        });
        break;
      case "array":
        zodType = z.array(this.createZodType(field.items));
        break;
      case "object":
        const objectSchema: Record<string, z.ZodTypeAny> = {};
        Object.entries(field.properties).forEach(([key, value]) => {
          objectSchema[key] = this.createZodType(value);
        });
        zodType = z.object(objectSchema);
        break;
      case "enum":
        zodType = z.enum(field.values as [string, ...string[]]);
        break;
      default:
        throw new Error(`Unsupported field type: ${(field as any).type}`);
    }

    if (field.description) {
      zodType = zodType.describe(field.description);
    }

    if (!field.required) {
      zodType = zodType.optional();
    }

    schema[field.name] = zodType;
    fieldDetails[field.name] = field;

    if (config) {
      fieldConfig[field.name] = config;
    }
  }

  function editField(name: string, updatedField: SchemaField) {
    // Remove the old field
    delete schema[name];

    // Add the updated field
    addField(updatedField);

    // Update fieldDetails
    fieldDetails[name] = updatedField;

    editingField.value = null;
  }

  function addDependency(dependency: Dependency) {
    dependencies.value.push(dependency);
  }

  function createZodType(field: SchemaField): z.ZodTypeAny {
    addField(field);
    return schema[field.name];
  }

  function rawSchema() {
    return z.object(schema);
  }

  function build() {
    return {
      formSchema: z.object(schema),
      fieldConfig: fieldConfig,
      dependencies: dependencies.value,
    };
  }

  return {
    addField,
    editField,
    addDependency,
    rawSchema,
    build,
    fieldDetails,
    editingField,
  };
}

export {
  DynamicSchemaBuilder,
  type SchemaField,
  type FieldConfig,
  type Dependency,
  type DependencyType,
};
