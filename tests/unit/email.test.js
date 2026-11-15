import { describe, it, expect } from "vitest";
import { validarEmail } from "../../src/js/domain/email.js";

describe("validarEmail (RF01)", () => {
  it("aceita um e-mail válido", () => {
    expect(validarEmail("juan@exemplo.com")).toBe(true);
  });

  it("rejeita e-mail sem @", () => {
    expect(validarEmail("juanexemplo.com")).toBe(false);
  });

  it("rejeita e-mail sem domínio", () => {
    expect(validarEmail("juan@")).toBe(false);
  });

  it("rejeita e-mail com espaços", () => {
    expect(validarEmail("juan @exemplo.com")).toBe(false);
  });
});