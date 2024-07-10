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
    return addDescription(schema, `z.object(${code})`);
  }

  if (schema instanceof z.ZodArray) {
    const itemsSchema = schema._def.type;
    return addDescription(schema, `z.array(${generateCode("", itemsSchema)})`);
  }

  if (schema instanceof z.ZodUnion) {
    const options = schema._def.options.map((option: any) =>
      generateCode("", option)
    );
    return addDescription(schema, `z.union([${options.join(", ")}])`);
  }

  if (schema instanceof z.ZodLiteral) {
    return addDescription(
      schema,
      `z.literal(${JSON.stringify(schema._def.value)})`
    );
  }

  if (schema instanceof z.ZodEnum) {
    const values = schema._def.values.map((val: any) => JSON.stringify(val));
    return addDescription(schema, `z.enum([${values.join(", ")}])`);
  }

  if (schema instanceof z.ZodOptional) {
    const innerSchema = schema._def.innerType;
    return addDescription(
      schema,
      `${generateCode("", innerSchema)}.optional()`
    );
  }

  if (schema instanceof z.ZodNullable) {
    const innerSchema = schema._def.innerType;
    return addDescription(
      schema,
      `${generateCode("", innerSchema)}.nullable()`
    );
  }

  if (schema instanceof z.ZodDefault) {
    const innerSchema = schema._def.innerType;
    const defaultValue = JSON.stringify(schema._def.defaultValue());
    return addDescription(
      schema,
      `${generateCode("", innerSchema)}.default(${defaultValue})`
    );
  }

  if (schema instanceof z.ZodEffects) {
    const innerSchema = schema._def.schema;
    return addDescription(schema, `z.effect(${generateCode("", innerSchema)})`);
  }

  if (schema instanceof z.ZodTransformer) {
    const innerSchema = schema._def.schema;
    return addDescription(
      schema,
      `z.transform(${generateCode("", innerSchema)})`
    );
  }

  if (schema instanceof z.ZodNativeEnum) {
    const values = Object.values(schema._def.values).map((val) =>
      JSON.stringify(val)
    );
    return addDescription(
      schema,
      `z.nativeEnum(${JSON.stringify(schema._def.values)})`
    );
  }

  if (schema instanceof z.ZodDiscriminatedUnion) {
    const options = schema._def.options.map((option: any) =>
      generateCode("", option)
    );
    return addDescription(
      schema,
      `z.discriminatedUnion([${options.join(", ")}])`
    );
  }

  if (schema instanceof z.ZodRecord) {
    const valueSchema = schema._def.valueType;
    return addDescription(schema, `z.record(${generateCode("", valueSchema)})`);
  }

  if (schema instanceof z.ZodTuple) {
    const items = schema._def.items.map((item: any) => generateCode("", item));
    return addDescription(schema, `z.tuple([${items.join(", ")}])`);
  }

  if (schema instanceof z.ZodLazy) {
    const innerSchema = schema._def.getter();
    return addDescription(
      schema,
      `z.lazy(() => ${generateCode("", innerSchema)})`
    );
  }

  // For simple types like ZodString, ZodNumber, etc., return their Zod schema equivalents
  if (schema instanceof z.ZodString)
    return addDescription(schema, "z.string()");
  if (schema instanceof z.ZodNumber)
    return addDescription(schema, "z.number()");
  if (schema instanceof z.ZodBoolean)
    return addDescription(schema, "z.boolean()");
  if (schema instanceof z.ZodDate) return addDescription(schema, "z.date()");
  if (schema instanceof z.ZodUnknown)
    return addDescription(schema, "z.unknown()");
  if (schema instanceof z.ZodAny) return addDescription(schema, "z.any()");
  if (schema instanceof z.ZodVoid) return addDescription(schema, "z.void()");
  if (schema instanceof z.ZodNever) return addDescription(schema, "z.never()");
  if (schema instanceof z.ZodBigInt)
    return addDescription(schema, "z.bigint()");
  if (schema instanceof z.ZodSymbol)
    return addDescription(schema, "z.symbol()");

  return "z.unknown()"; // Fallback for unsupported types
}

function addDescription(schema: z.ZodTypeAny, codeString: string): string {
  if (schema.description) {
    return `${codeString}.describe(${JSON.stringify(schema.description)})`;
  }
  return codeString;
}
