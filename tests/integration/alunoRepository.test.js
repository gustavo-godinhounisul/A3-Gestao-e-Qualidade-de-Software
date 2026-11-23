import { describe, it, expect } from "vitest";
import { criarAlunoRepository } from "../../src/js/repositories/alunoRepository.js";

// Gaveta de mentira: imita o localStorage (guarda texto e devolve null se a chave não existe)
function criarArmazenamentoFalso() {
  const dados = {};
  return {
    getItem(chave) {
      return chave in dados ? dados[chave] : null;
    },
    setItem(chave, valor) {
      dados[chave] = String(valor);
    },
  };
}

const ana = { nome: "Ana Souza", cpf: "12345678909", email: "ana@exemplo.com" };
const bruno = { nome: "Bruno Lima", cpf: "98765432100", email: "bruno@exemplo.com" };

describe("alunoRepository", () => {
  it("começa com a lista vazia", () => {
    const repositorio = criarAlunoRepository(criarArmazenamentoFalso());
    expect(repositorio.listar()).toEqual([]);
  });

  it("salva um aluno e devolve com id", () => {
    const repositorio = criarAlunoRepository(criarArmazenamentoFalso());
    const salvo = repositorio.salvar(ana);
    expect(salvo.id).toBeDefined();
    expect(repositorio.listar()).toEqual([salvo]);
  });

  it("dá ids diferentes para alunos diferentes", () => {
    const repositorio = criarAlunoRepository(criarArmazenamentoFalso());
    const primeiro = repositorio.salvar(ana);
    const segundo = repositorio.salvar(bruno);
    expect(primeiro.id).not.toBe(segundo.id);
    expect(repositorio.listar()).toHaveLength(2);
  });

  it("busca por CPF e devolve o aluno quando ele existe", () => {
    const repositorio = criarAlunoRepository(criarArmazenamentoFalso());
    const salvo = repositorio.salvar(ana);
    expect(repositorio.buscarPorCpf("12345678909")).toEqual(salvo);
  });

  it("busca por CPF e devolve null quando ele não existe", () => {
    const repositorio = criarAlunoRepository(criarArmazenamentoFalso());
    repositorio.salvar(ana);
    expect(repositorio.buscarPorCpf("00000000000")).toBeNull();
  });

  it("atualiza só o aluno certo e deixa os outros intactos", () => {
    const repositorio = criarAlunoRepository(criarArmazenamentoFalso());
    const primeiro = repositorio.salvar(ana);
    const segundo = repositorio.salvar(bruno);

    repositorio.atualizar({ ...primeiro, nome: "Ana Maria Souza" });

    const lista = repositorio.listar();
    expect(lista[0].nome).toBe("Ana Maria Souza");
    expect(lista[1]).toEqual(segundo);
  });

  it("devolve null ao atualizar um id que não existe", () => {
    const repositorio = criarAlunoRepository(criarArmazenamentoFalso());
    expect(repositorio.atualizar({ id: 99, nome: "Ninguém" })).toBeNull();
  });

  it("mantém os dados quando outro repositório usa a mesma gaveta", () => {
    const gaveta = criarArmazenamentoFalso();
    const salvo = criarAlunoRepository(gaveta).salvar(ana);

    const outroRepositorio = criarAlunoRepository(gaveta);
    expect(outroRepositorio.listar()).toEqual([salvo]);
  });
});