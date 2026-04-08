import { describe, expect, it } from "vitest";
import { parseGasWebAppResponse } from "./parseGasWebAppResponse";

describe("parseGasWebAppResponse", () => {
  it("parses bare JSON ok", () => {
    expect(parseGasWebAppResponse('{"ok":true}')).toEqual({ kind: "ok" });
  });
  it("parses duplicate", () => {
    expect(parseGasWebAppResponse('{"ok":false,"error":"duplicate"}')).toEqual({ kind: "duplicate" });
  });
  it("handles BOM and whitespace", () => {
    expect(parseGasWebAppResponse('\uFEFF  {"ok":true}  \n')).toEqual({ kind: "ok" });
  });
  it("extracts JSON from HTML wrapper", () => {
    const html = '<html><body>{"ok":true}</body></html>';
    expect(parseGasWebAppResponse(html)).toEqual({ kind: "ok" });
  });
  it("matches ok inside HTML without strict JSON parse of whole body", () => {
    expect(parseGasWebAppResponse('<pre>{"ok":true}\n</pre>')).toEqual({ kind: "ok" });
  });
  it("legacy Success text", () => {
    expect(parseGasWebAppResponse("Success")).toEqual({ kind: "ok" });
  });
  it("regex duplicate in noisy body", () => {
    expect(parseGasWebAppResponse('prefix {"error":"duplicate"} suffix')).toEqual({ kind: "duplicate" });
  });
});
