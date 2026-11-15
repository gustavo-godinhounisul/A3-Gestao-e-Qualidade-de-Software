import { describe, it, expect } from "vitest";
import { validarNome } from "../../src/js/domain/nome.js";

describe("validarNome (RF01)", () => {
  it("aceita um nome válido", () => {
    expect(validarNome("Juan Natan dos Passos")).toBe(true);
  });

  it("rejeita nome vazio", () => {
    expect(validarNome("")).toBe(false);
  });

  it("rejeita nome só com espaços", () => {
    expect(validarNome("     ")).toBe(false);
  });

  it("rejeita nome curto demais", () => {
    expect(validarNome("Jo")).toBe(false);
  });

  it("rejeita nome longo demais", () => {
    expect(validarNome("a".repeat(101))).toBe(false);
  });
});