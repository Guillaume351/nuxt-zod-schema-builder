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

type DependencyType = "HIDES" | "SHOWS" | "ENABLES" | "DISABLES";

interface Dependency {
  sourceField: string;
  type: DependencyType;
  targetField: string;
  when: (value: any) => boolean;
}

class DynamicSchemaBuilder {
  private schema: Record<string, z.ZodTypeAny> = {};
  private fieldConfig: Record<string, FieldConfig> = {};
  private dependencies: Dependency[] = [];

  addField(field: SchemaField, config?: FieldConfig): DynamicSchemaBuilder {
    let zodType: z.ZodTypeAny;

    switch (field.type) {
      case "string":
        zodType = z.string({
          required_error: `${field.name} is required.`,
        });
        // TODO: improve ZodTypeAny to allow for min and max length
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

    this.schema[field.name] = zodType;

    if (config) {
      this.fieldConfig[field.name] = config;
    }

    return this;
  }

  addDependency(dependency: Dependency): DynamicSchemaBuilder {
    this.dependencies.push(dependency);
    return this;
  }

  private createZodType(field: SchemaField): z.ZodTypeAny {
    return this.addField(field).schema[field.name];
  }

  rawSchema(): z.ZodObject<any> {
    return z.object(this.schema);
  }

  build(): {
    formSchema: z.ZodObject<any>;
    fieldConfig: Record<string, FieldConfig>;
    dependencies: Dependency[];
  } {
    return {
      formSchema: z.object(this.schema),
      fieldConfig: this.fieldConfig,
      dependencies: this.dependencies,
    };
  }
}

export {
  DynamicSchemaBuilder,
  type SchemaField,
  type FieldConfig,
  type Dependency,
  type DependencyType,
};
