import { describe, it, expect } from "vitest";
import { calcularSituacao } from "../../src/js/domain/situacao.js";

describe("calcularSituacao (regra RN03)", () => {
  it("aprova com a média exatamente no mínimo (7,0)", () => {
    expect(calcularSituacao(7)).toBe("aprovado");
  });

  it("reprova logo abaixo do mínimo (6,99)", () => {
    expect(calcularSituacao(6.99)).toBe("reprovado");
  });

  it("aprova com média acima do mínimo", () => {
    expect(calcularSituacao(8.5)).toBe("aprovado");
  });

  it("aprova com a nota máxima (10)", () => {
    expect(calcularSituacao(10)).toBe("aprovado");
  });

  it("reprova com a nota mínima (0)", () => {
    expect(calcularSituacao(0)).toBe("reprovado");
  });

  it("rejeita média fora da faixa de 0 a 10", () => {
    expect(() => calcularSituacao(10.1)).toThrow(RangeError);
    expect(() => calcularSituacao(-1)).toThrow(RangeError);
  });

  it("rejeita o que não é número", () => {
    expect(() => calcularSituacao("abc")).toThrow(RangeError);
    expect(() => calcularSituacao(null)).toThrow(RangeError);
    expect(() => calcularSituacao(NaN)).toThrow(RangeError);
  });
});