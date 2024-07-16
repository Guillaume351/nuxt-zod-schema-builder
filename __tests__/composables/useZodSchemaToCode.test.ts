import { describe, it, expect } from "vitest";
import { z } from "zod";
import { schemaToCodeString } from "../../composables/useZodSchemaToCode";

describe("schemaToCodeString", () => {
  it("should generate code for a simple Zod object schema", () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });

    const result = schemaToCodeString(schema);
    expect(result).toBe(
      "z.object({\n  name: z.string(),\n  age: z.number(),\n})"
    );
  });

  it("should generate code for a nested Zod object schema", () => {
    const schema = z.object({
      user: z.object({
        id: z.number(),
        profile: z.object({
          username: z.string(),
          email: z.string().optional(),
        }),
      }),
    });

    const result = schemaToCodeString(schema);
    expect(result).toBe(
      "z.object({\n  user: z.object({\n  id: z.number(),\n  profile: z.object({\n  username: z.string(),\n  email: z.string().optional(),\n}),\n}),\n})"
    );
  });

  it("should generate code for a Zod array schema", () => {
    const schema = z.array(z.string());

    const result = schemaToCodeString(schema);
    expect(result).toBe("z.array(z.string())");
  });

  it("should generate code for a Zod union schema", () => {
    const schema = z.union([z.string(), z.number()]);

    const result = schemaToCodeString(schema);
    expect(result).toBe("z.union([z.string(), z.number()])");
  });

  it("should generate code for a Zod literal schema", () => {
    const schema = z.literal("literalValue");

    const result = schemaToCodeString(schema);
    expect(result).toBe('z.literal("literalValue")');
  });

  it("should generate code for a Zod enum schema", () => {
    const schema = z.enum(["Value1", "Value2"]);

    const result = schemaToCodeString(schema);
    expect(result).toBe('z.enum(["Value1", "Value2"])');
  });

  it("should generate code for a Zod optional schema", () => {
    const schema = z.string().optional();

    const result = schemaToCodeString(schema);
    expect(result).toBe("z.string().optional()");
  });

  it("should generate code for a Zod nullable schema", () => {
    const schema = z.string().nullable();

    const result = schemaToCodeString(schema);
    expect(result).toBe("z.string().nullable()");
  });

  it("should generate code for a Zod default schema", () => {
    const schema = z.string().default("defaultValue");

    const result = schemaToCodeString(schema);
    expect(result).toBe('z.string().default("defaultValue")');
  });

  it("should generate code for a Zod effects schema", () => {
    const schema = z.string().transform((val) => val.toUpperCase());

    const result = schemaToCodeString(schema);
    expect(result).toBe("z.effect(z.string())");
  });

  it("should generate code for a Zod discriminated union schema", () => {
    const schema = z.discriminatedUnion("type", [
      z.object({ type: z.literal("a"), value: z.string() }),
      z.object({ type: z.literal("b"), value: z.number() }),
    ]);

    const result = schemaToCodeString(schema);
    expect(result).toBe(
      'z.discriminatedUnion("type", [z.object({\n  type: z.literal("a"),\n  value: z.string(),\n}), z.object({\n  type: z.literal("b"),\n  value: z.number(),\n})])'
    );
  });

  it("should generate code for a Zod lazy schema", () => {
    const schema = z.lazy(() => z.string());

    const result = schemaToCodeString(schema);
    expect(result).toBe("z.lazy(() => z.string())");
  });

  it("should generate code with descriptions", () => {
    const schema = z.string().describe("A descriptive string");

    const result = schemaToCodeString(schema);
    expect(result).toBe('z.string().describe("A descriptive string")');
  });

  it("should add descriptions to nested schemas", () => {
    const schema = z.object({
      name: z.string().describe("The name of the user"),
      age: z.number().describe("The age of the user").optional(),
    });

    const result = schemaToCodeString(schema);
    expect(result).toBe(
      'z.object({\n  name: z.string().describe("The name of the user"),\n  age: z.number().describe("The age of the user").optional(),\n})'
    );
  });
});
