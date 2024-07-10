
import { z } from "zod";

/**
 * Converts a Zod schema to a Zod schema code string.
 * @param schema - The Zod schema to convert.
 * @returns The Zod schema code string.
 */
export function schemaToCodeString(schema: z.ZodTypeAny): string {
  return generateCode("", schema);
}

/**
 * Recursively traverses the schema and generates the Zod schema code string.
 * @param path - The current path in the schema.
 * @param schema - The current Zod schema.
 * @returns The generated Zod schema code string.
 */
function generateCode(path: string, schema: z.ZodTypeAny): string {
  if (schema instanceof z.ZodObject) {
    let code = "{\n";
    for (const key in schema.shape) {
      const propertySchema = schema.shape[key];
      code += `  ${key}: ${generateCode("", propertySchema)},\n`;
    }
    code += "}";
    return `z.object(${code})`;
  }

  if (schema instanceof z.ZodArray) {
    const itemsSchema = schema._def.type;
    return `z.array(${generateCode("", itemsSchema)})`;
  }

  if (schema instanceof z.ZodUnion) {
    const options = schema._def.options.map((option: any) => generateCode("", option));
    return `z.union([${options.join(", ")}])`;
  }

  if (schema instanceof z.ZodLiteral) {
    return `z.literal(${JSON.stringify(schema._def.value)})`;
  }

  if (schema instanceof z.ZodEnum) {
    const values = schema._def.values.map((val: any) => JSON.stringify(val));
    return `z.enum([${values.join(", ")}])`;
  }

  if (schema instanceof z.ZodOptional) {
    const innerSchema = schema._def.innerType;
    return `${generateCode("", innerSchema)}.optional()`;
  }

  if (schema instanceof z.ZodNullable) {
    const innerSchema = schema._def.innerType;
    return `${generateCode("", innerSchema)}.nullable()`;
  }

  if (schema instanceof z.ZodDefault) {
    const innerSchema = schema._def.innerType;
    const defaultValue = JSON.stringify(schema._def.defaultValue());
    return `${generateCode("", innerSchema)}.default(${defaultValue})`;
  }

  if (schema instanceof z.ZodEffects) {
    const innerSchema = schema._def.schema;
    return `z.effect(${generateCode("", innerSchema)})`;
  }

  if (schema instanceof z.ZodTransformer) {
    const innerSchema = schema._def.schema;
    return `z.transform(${generateCode("", innerSchema)})`;
  }

  if (schema instanceof z.ZodNativeEnum) {
    const values = Object.values(schema._def.values).map((val) => JSON.stringify(val));
    return `z.nativeEnum(${JSON.stringify(schema._def.values)})`;
  }

  if (schema instanceof z.ZodDiscriminatedUnion) {
    const options = schema._def.options.map((option: any) => generateCode("", option));
    return `z.discriminatedUnion([${options.join(", ")}])`;
  }

  if (schema instanceof z.ZodRecord) {
    const valueSchema = schema._def.valueType;
    return `z.record(${generateCode("", valueSchema)})`;
  }

  if (schema instanceof z.ZodTuple) {
    const items = schema._def.items.map((item: any) => generateCode("", item));
    return `z.tuple([${items.join(", ")}])`;
  }

  if (schema instanceof z.ZodLazy) {
    const innerSchema = schema._def.getter();
    return `z.lazy(() => ${generateCode("", innerSchema)})`;
  }

  // For simple types like ZodString, ZodNumber, etc., return their Zod schema equivalents
  if (schema instanceof z.ZodString) return "z.string()";
  if (schema instanceof z.ZodNumber) return "z.number()";
  if (schema instanceof z.ZodBoolean) return "z.boolean()";
  if (schema instanceof z.ZodDate) return "z.date()";
  if (schema instanceof z.ZodUnknown) return "z.unknown()";
  if (schema instanceof z.ZodAny) return "z.any()";
  if (schema instanceof z.ZodVoid) return "z.void()";
  if (schema instanceof z.ZodNever) return "z.never()";
  if (schema instanceof z.ZodBigInt) return "z.bigint()";
  if (schema instanceof z.ZodSymbol) return "z.symbol()";

  return "z.unknown()"; // Fallback for unsupported types
}
