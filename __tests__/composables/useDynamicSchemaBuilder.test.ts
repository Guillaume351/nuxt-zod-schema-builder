import {
  useSchemaBuilder,
  type SchemaField,
} from "../../composables/useDynamicSchemaBuilder";
import { z } from "zod";
import { describe, it, expect, beforeEach } from "vitest";
import {
  type DependencyType,
  type Dependency,
} from "~/composables/useDynamicSchemaBuilder";

describe("useDynamicSchemaBuilder", () => {
  let schemaBuilder: ReturnType<typeof useSchemaBuilder>;

  beforeEach(() => {
    schemaBuilder = useSchemaBuilder();
  });

  it("should add a string field to the schema", () => {
    const field = {
      name: "testString",
      type: "string",
      min: 1,
      max: 100,
      required: true,
    };
    schemaBuilder.addField(field);
    const schema = schemaBuilder.rawSchema();
    const parsedData = schema.parse({ testString: "Test" });

    expect(parsedData).toEqual({
      testString: "Test",
    });
  });

  it("should add a number field to the schema", () => {
    const field = {
      name: "testNumber",
      type: "number",
      min: 0,
      max: 100,
      required: true,
    } as SchemaField;
    schemaBuilder.addField(field);
    const schema = schemaBuilder.rawSchema();
    const parsedData = schema.parse({ testNumber: 50 });

    expect(parsedData).toEqual({
      testNumber: 50,
    });
  });

  it("should edit a field in the schema", () => {
    const field = {
      name: "testEditField",
      type: "string",
      min: 1,
    } as SchemaField;
    schemaBuilder.addField(field);

    const updatedField = {
      name: "testEditField",
      type: "string",
      min: 5,
      max: 10,
    } as SchemaField;
    schemaBuilder.editField("testEditField", updatedField);

    console.log(JSON.stringify(schemaBuilder.rawSchema()));

    const schema = schemaBuilder.rawSchema();
    expect(() => schema.parse({ testEditField: "Test" })).toThrow();
    expect(schema.parse({ testEditField: "Testing" })).toEqual({
      testEditField: "Testing",
    });
  });

  it("should add dependencies to the schema", () => {
    const dependency = {
      sourceField: "type",
      type: "HIDES" as DependencyType,
      targetField: "values",
      when: (sourceFieldValue: any) => sourceFieldValue !== "enum",
    };
    schemaBuilder.addDependency(dependency);

    expect(JSON.stringify(schemaBuilder.build().dependencies)).toEqual(
      JSON.stringify([dependency])
    );
  });

  it("should build raw schema correctly", () => {
    const field = {
      name: "testBuildField",
      type: "boolean",
      required: true,
    };
    schemaBuilder.addField(field);

    const rawSchema = schemaBuilder.rawSchema();
    expect(JSON.stringify(rawSchema.shape.testBuildField)).toEqual(
      JSON.stringify(
        z.boolean({
          required_error: "testBuildField is required.",
        })
      )
    );
  });
});
