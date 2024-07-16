import { z } from "zod";

/**
 * Converts a Zod schema to a Zod schema code string.
 * @param schema - The Zod schema to convert.
 * @returns The Zod schema code string.
 */
export function schemaToCodeString(schema: z.ZodTypeAny): string {
  return generateCode(schema, true);
}

/**
 * Recursively traverses the schema and generates the Zod schema code string.
 * @param schema - The current Zod schema.
 * @param isRoot - Flag to indicate if the schema is at the root level.
 * @returns The generated Zod schema code string.
 */
function generateCode(schema: z.ZodTypeAny, isRoot: boolean): string {
  let code: string;

  if (schema instanceof z.ZodObject) {
    code = "{\n";
    for (const key in schema.shape) {
      const propertySchema = schema.shape[key];
      code += `  ${key}: ${generateCode(propertySchema, false)},\n`;
    }
    code += "}";
    code = `z.object(${code})`;
  } else if (schema instanceof z.ZodArray) {
    const itemsSchema = schema._def.type;
    code = `z.array(${generateCode(itemsSchema, false)})`;
  } else if (schema instanceof z.ZodUnion) {
    const options = schema._def.options.map((option: any) =>
      generateCode(option, false)
    );
    code = `z.union([${options.join(", ")}])`;
  } else if (schema instanceof z.ZodLiteral) {
    code = `z.literal(${JSON.stringify(schema._def.value)})`;
  } else if (schema instanceof z.ZodEnum) {
    const values = schema._def.values.map((val: any) => JSON.stringify(val));
    code = `z.enum([${values.join(", ")}])`;
  } else if (schema instanceof z.ZodOptional) {
    const innerSchema = schema._def.innerType;
    code = `${generateCode(innerSchema, false)}.optional()`;
  } else if (schema instanceof z.ZodNullable) {
    const innerSchema = schema._def.innerType;
    code = `${generateCode(innerSchema, false)}.nullable()`;
  } else if (schema instanceof z.ZodDefault) {
    const innerSchema = schema._def.innerType;
    const defaultValue = JSON.stringify(schema._def.defaultValue());
    code = `${generateCode(innerSchema, false)}.default(${defaultValue})`;
  } else if (schema instanceof z.ZodEffects) {
    const innerSchema = schema._def.schema;
    code = `z.effect(${generateCode(innerSchema, false)})`;
  } else if (schema instanceof z.ZodTransformer) {
    const innerSchema = schema._def.schema;
    code = `z.transform(${generateCode(innerSchema, false)})`;
  } else if (schema instanceof z.ZodNativeEnum) {
    code = `z.nativeEnum(${JSON.stringify(schema._def.values)})`;
  } else if (schema instanceof z.ZodDiscriminatedUnion) {
    const { discriminator, options } = schema._def;
    const optionsCode = options.map((option: any) =>
      generateCode(option, false)
    );
    code = `z.discriminatedUnion("${discriminator}", [${optionsCode.join(
      ", "
    )}])`;
  } else if (schema instanceof z.ZodRecord) {
    const valueSchema = schema._def.valueType;
    code = `z.record(${generateCode(valueSchema, false)})`;
  } else if (schema instanceof z.ZodTuple) {
    const items = schema._def.items.map((item: any) =>
      generateCode(item, false)
    );
    code = `z.tuple([${items.join(", ")}])`;
  } else if (schema instanceof z.ZodLazy) {
    const innerSchema = schema._def.getter();
    code = `z.lazy(() => ${generateCode(innerSchema, false)})`;
  } else if (schema instanceof z.ZodString) {
    code = "z.string()";
    if (schema._def.checks) {
      for (const check of schema._def.checks) {
        if (check.kind === "min") {
          code += `.min(${check.value})`;
        } else if (check.kind === "max") {
          code += `.max(${check.value})`;
        }
      }
    }
  } else if (schema instanceof z.ZodNumber) {
    code = "z.number()";
    if (schema._def.checks) {
      for (const check of schema._def.checks) {
        if (check.kind === "min") {
          code += `.min(${check.value})`;
        } else if (check.kind === "max") {
          code += `.max(${check.value})`;
        }
      }
    }
  } else if (schema instanceof z.ZodBoolean) {
    code = "z.boolean()";
  } else if (schema instanceof z.ZodDate) {
    code = "z.date()";
  } else if (schema instanceof z.ZodUnknown) {
    code = "z.unknown()";
  } else if (schema instanceof z.ZodAny) {
    code = "z.any()";
  } else if (schema instanceof z.ZodVoid) {
    code = "z.void()";
  } else if (schema instanceof z.ZodNever) {
    code = "z.never()";
  } else if (schema instanceof z.ZodBigInt) {
    code = "z.bigint()";
  } else if (schema instanceof z.ZodSymbol) {
    code = "z.symbol()";
  } else {
    code = "z.unknown()"; // Fallback for unsupported types
  }

  // Add description if present and not already added
  if (isRoot && schema.description) {
    code += `.describe(${JSON.stringify(schema.description)})`;
  } else if (
    !isRoot &&
    schema.description &&
    !code.includes(`.describe(${JSON.stringify(schema.description)})`)
  ) {
    code += `.describe(${JSON.stringify(schema.description)})`;
  }

  return code;
}
