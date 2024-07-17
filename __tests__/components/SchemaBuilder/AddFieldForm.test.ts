import { mount } from "@vue/test-utils";
import AddFieldForm from "~/components/SchemaBuilder/AddFieldForm.vue";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("AddFieldForm.vue", () => {
  it("should add a field on form submission", async () => {
    const addFieldMock = vi.fn();
    vi.stubGlobal("useSchemaStore", {
      addField: addFieldMock,
    });

    const wrapper = mount(AddFieldForm, {
      global: {
        stubs: {
          AutoForm: {
            template: `<form @submit.prevent="$emit('submit', { name: 'testField', type: 'string' })"></form>`,
          },
          Button: true,
        },
      },
    });

    wrapper.find("form").trigger("submit", {
      preventDefault: () => {}, // mock preventDefault function
    });

    expect(addFieldMock).toHaveBeenCalledWith({
      name: "testField",
      type: "string",
    });
  });
});
