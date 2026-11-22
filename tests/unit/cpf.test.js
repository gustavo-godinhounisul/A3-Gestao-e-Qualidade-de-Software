import { describe, it, expect } from "vitest";
import { normalizarCpf, validarCpf } from "../../src/js/domain/cpf.js";

describe("normalizarCpf (regra RN01)", () => {
  it("devolve apenas os 11 digitos de um CPF com mascara", () => {
    expect(normalizarCpf("123.456.789-09")).toBe("12345678909");
  });

  it("devolve os 11 digitos quando ja vem sem mascara", () => {
    expect(normalizarCpf("12345678909")).toBe("12345678909");
  });
});

describe("validarCpf (regra RN01)", () => {
  it("aceita CPF valido com e sem mascara", () => {
    expect(validarCpf("123.456.789-09")).toBe(true);
    expect(validarCpf("12345678909")).toBe(true);
  });

  it("rejeita digito verificador errado", () => {
    expect(validarCpf("123.456.789-00")).toBe(false);
    expect(validarCpf("123.456.789-19")).toBe(false);
  });

  it("rejeita letras, vazio e null", () => {
    expect(validarCpf("abc.def.ghi-jk")).toBe(false);
    expect(validarCpf("")).toBe(false);
    expect(validarCpf(null)).toBe(false);
  });

  it("rejeita limites com 10 e 12 digitos", () => {
    expect(validarCpf("1234567890")).toBe(false);
    expect(validarCpf("123456789012")).toBe(false);
  });

  it("rejeita sequencias de digitos iguais", () => {
    expect(validarCpf("111.111.111-11")).toBe(false);
    expect(validarCpf("000.000.000-00")).toBe(false);
  });
});