import { mount } from "@vue/test-utils";
import EditFieldModal from "~/components/SchemaBuilder/EditFieldModal.vue";
import { useSchemaStore } from "~/composables/stores/schemaStore";
import { ref } from "vue";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

vi.mock("~/composables/stores/schemaStore", () => ({
  useSchemaStore: vi.fn(),
}));

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("EditFieldModal.vue", () => {
  it("should set the editing field on startEdit", async () => {
    const editingField = ref(null);
    const mockStore = {
      editingField,
      fieldDetails: {
        testField: {
          name: "testField",
          type: "string",
          min: 1,
        },
      },
    };
    vi.mocked(useSchemaStore).mockReturnValue(mockStore as any);

    const wrapper = mount(EditFieldModal, {
      props: { fieldName: "testField" },
      global: {
        stubs: {
          Dialog: true,
          DialogTrigger: {
            template: "<div><slot /></div>",
          },
          DialogContent: true,
          AutoForm: true,
          DialogFooter: true,
          DialogClose: true,
          Button: true,
        },
      },
    });

    const button = wrapper.find('[data-testid="edit-field-button"]');

    expect(button.exists()).toBe(true);

    await button.trigger("click");
    expect(editingField.value).toBe("testField");
  });
});
