import { describe, expect, it } from "vitest";
import { openFreeMapSpriteAlias } from "./openfreemap-sprites";

describe("openFreeMapSpriteAlias", () => {
  it("maps hyphenated Maki names onto the OpenFreeMap sprite ids", () => {
    expect(openFreeMapSpriteAlias("circle-11")).toBe("circle_11");
  });

  it("leaves names that already match the sprite alone", () => {
    expect(openFreeMapSpriteAlias("circle_11")).toBeNull();
  });
});
