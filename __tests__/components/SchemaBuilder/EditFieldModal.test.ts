import { mount } from "@vue/test-utils";
import EditFieldModal from "~/components/SchemaBuilder/EditFieldModal.vue";
import { useSchemaStore } from "~/composables/stores/schemaStore";
import { ref } from "vue";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("EditFieldModal.vue", () => {
  it("should set the editing field on startEdit", async () => {
    const store = {
      editingField: ref(null),
      fieldDetails: {
        testField: {
          name: "testField",
          type: "string",
          min: 1,
        },
      },
    };
    vi.stubGlobal("useSchemaStore", () => store);

    const wrapper = mount(EditFieldModal, {
      props: { fieldName: "testField" },
      global: {
        stubs: {
          Dialog: {
            template: "<div><slot></slot></div>",
          },
          DialogTrigger: {
            template: `<button @click="$emit('click')"></button>`,
          },
          DialogContent: true,
          AutoForm: {
            template: `<form @submit.prevent="$emit('submit', { name: 'testField', type: 'string', min: 1 })"></form>`,
          },
          Button: true,
          DialogFooter: true,
          DialogClose: true,
        },
      },
    });

    await wrapper.find("button").trigger("click");
    expect(store.editingField.value).toBe("testField");
  });
});
