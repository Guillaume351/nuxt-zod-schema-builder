import { mount } from "@vue/test-utils";
import AddFieldForm from "~/components/SchemaBuilder/AddFieldForm.vue";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

const addFieldMock = vi.fn();

vi.mock("~/composables/stores/schemaStore", () => ({
  useSchemaStore: () => ({
    addField: addFieldMock,
  }),
}));

beforeEach(() => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
});

describe("AddFieldForm.vue", () => {
  it("should add a field on form submission", async () => {
    const wrapper = mount(AddFieldForm, {
      global: {
        stubs: {
          AutoForm: {
            template:
              "<form @submit.prevent=\"$emit('submit', { name: 'testField', type: 'string' })\"><slot></slot></form>",
          },
          Button: true,
        },
      },
    });

    await wrapper.find("form").trigger("submit");

    expect(addFieldMock).toHaveBeenCalledWith({
      name: "testField",
      type: "string",
    });
  });
});
