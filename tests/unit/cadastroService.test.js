import { describe, it, expect } from "vitest";
import { cadastrarAluno } from "../../src/js/services/cadastroService.js";
import { criarAlunoRepository } from "../../src/js/repositories/alunoRepository.js";

// Armazenamento falso em memória, com getItem e setItem como o localStorage
function criarArmazenamentoFalso() {
  const dados = new Map();
  return {
    getItem: (chave) => (dados.has(chave) ? dados.get(chave) : null),
    setItem: (chave, valor) => dados.set(chave, valor),
  };
}

describe("cadastrarAluno (RF01)", () => {
  it("cadastra um aluno válido e guarda o CPF só com dígitos", () => {
    const repositorio = criarAlunoRepository(criarArmazenamentoFalso());

    const resultado = cadastrarAluno(repositorio, {
      nome: "Maria da Silva",
      cpf: "123.456.789-09",
      email: "maria@exemplo.com",
    });

    expect(resultado.ok).toBe(true);
    expect(resultado.aluno.id).toBeDefined();
    expect(resultado.aluno.cpf).toBe("12345678909");
    expect(repositorio.listar()).toHaveLength(1);
  });
});