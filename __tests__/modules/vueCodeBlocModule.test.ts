import { describe, it, expect, vi } from "vitest";
import { addComponent } from "@nuxt/kit";
import vueCodeBlockModule from "~/modules/vueCodeBlocModule";

vi.mock("@nuxt/kit", () => ({
  defineNuxtModule: vi.fn((obj) => obj),
  addComponent: vi.fn(),
}));

describe("vueCodeBlockModule", () => {
  it("should add VCodeBlock component", () => {
    vueCodeBlockModule.setup();

    expect(addComponent).toHaveBeenCalledWith({
      name: "VCodeBlock",
      filePath: "@wdns/vue-code-block",
      mode: "client",
    });
  });
});
