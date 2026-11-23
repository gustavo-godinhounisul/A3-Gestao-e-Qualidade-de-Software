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
  
  it("rejeita CPF inválido e não salva", () => {
    const repositorio = criarAlunoRepository(criarArmazenamentoFalso());

    const resultado = cadastrarAluno(repositorio, {
      nome: "Maria da Silva",
      cpf: "123.456.789-00",
      email: "maria@exemplo.com",
    });

    expect(resultado.ok).toBe(false);
    expect(resultado.erros).toEqual(["CPF inválido."]);
    expect(repositorio.listar()).toHaveLength(0);
  });

  it("rejeita nome inválido e não salva", () => {
    const repositorio = criarAlunoRepository(criarArmazenamentoFalso());

    const resultado = cadastrarAluno(repositorio, {
      nome: "Jo",
      cpf: "123.456.789-09",
      email: "maria@exemplo.com",
    });

    expect(resultado.ok).toBe(false);
    expect(resultado.erros).toEqual(["Nome inválido: use de 3 a 100 caracteres."]);
    expect(repositorio.listar()).toHaveLength(0);
  });

  it("rejeita e-mail inválido e não salva", () => {
    const repositorio = criarAlunoRepository(criarArmazenamentoFalso());

    const resultado = cadastrarAluno(repositorio, {
      nome: "Maria da Silva",
      cpf: "123.456.789-09",
      email: "mariaexemplo.com",
    });

    expect(resultado.ok).toBe(false);
    expect(resultado.erros).toEqual(["E-mail inválido."]);
    expect(repositorio.listar()).toHaveLength(0);
  });

  it("devolve todos os erros de uma vez e não salva nada", () => {
    const repositorio = criarAlunoRepository(criarArmazenamentoFalso());

    const resultado = cadastrarAluno(repositorio, {
      nome: "",
      cpf: "111.111.111-11",
      email: "",
    });

    expect(resultado.ok).toBe(false);
    expect(resultado.erros).toHaveLength(3);
    expect(repositorio.listar()).toHaveLength(0);
  });
  
  it("rejeita CPF duplicado, mesmo com máscara diferente", () => {
    const repositorio = criarAlunoRepository(criarArmazenamentoFalso());

    cadastrarAluno(repositorio, {
      nome: "Maria da Silva",
      cpf: "123.456.789-09",
      email: "maria@exemplo.com",
    });

    const resultado = cadastrarAluno(repositorio, {
      nome: "João Souza",
      cpf: "12345678909",
      email: "joao@exemplo.com",
    });

    expect(resultado.ok).toBe(false);
    expect(resultado.erros).toEqual(["CPF já cadastrado."]);
    expect(repositorio.listar()).toHaveLength(1);
  });
});