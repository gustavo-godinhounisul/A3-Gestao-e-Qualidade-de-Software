import { describe, it, expect } from "vitest";
import { validarNota } from "../../src/js/domain/nota.js";

describe("validarNota (regra RN02)", () => {
  it("aceita uma nota no meio da faixa", () => {
    expect(validarNota(7.5)).toBe(true);
  });

  it("aceita os limites 0 e 10", () => {
    expect(validarNota(0)).toBe(true);
    expect(validarNota(10)).toBe(true);
  });

  it("rejeita nota negativa", () => {
    expect(validarNota(-1)).toBe(false);
  });

  it("rejeita nota acima de 10", () => {
    expect(validarNota(10.1)).toBe(false);
  });

  it("rejeita o que não é número", () => {
    expect(validarNota("abc")).toBe(false);
  });
});