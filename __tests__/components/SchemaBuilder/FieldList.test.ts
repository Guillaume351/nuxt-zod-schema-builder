import { mount } from "@vue/test-utils";
import FieldList from "~/components/SchemaBuilder/FieldList.vue";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("FieldList.vue", () => {
  it("should render EditFieldModal for each field", () => {
    const store = {
      fieldDetails: {
        field1: {},
        field2: {},
      },
    };
    vi.stubGlobal("useSchemaStore", () => store);

    const wrapper = mount(FieldList, {
      global: {
        stubs: {
          EditFieldModal: {
            template: "<div/>",
          },
        },
      },
    });

    const modals = wrapper.findAllComponents({ name: "EditFieldModal" });
    expect(modals).toHaveLength(2);
  });
});
