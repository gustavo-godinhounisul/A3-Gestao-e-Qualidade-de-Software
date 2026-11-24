import { beforeEach, describe, expect, it } from "vitest";
import { criarAlunoRepository } from "../../src/js/repositories/alunoRepository.js";
import { cadastrarAluno } from "../../src/js/services/cadastroService.js";
import { filtrarAlunos } from "../../src/js/domain/busca.js";

// Gaveta de mentira: imita o localStorage, para o teste rodar sem navegador
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

// Dados como a secretaria digitaria na tela (CPF com máscara)
const ana = { nome: "Ana Souza", cpf: "123.456.789-09", email: "ana@exemplo.com" };
const bruno = { nome: "Bruno Lima", cpf: "529.982.247-25", email: "bruno@exemplo.com" };
const carla = { nome: "Carla Dias", cpf: "111.444.777-35", email: "carla@exemplo.com" };

describe("fluxo de cadastro e consulta de alunos", () => {
  let armazenamento;
  let repositorio;

  // Antes de CADA teste, começa tudo do zero: gaveta vazia e repositório novo
  beforeEach(() => {
    armazenamento = criarArmazenamentoFalso();
    repositorio = criarAlunoRepository(armazenamento);
  });

  describe("cadastro", () => {
    it("CA01: cadastra um aluno válido e ele aparece na lista", () => {
      const resultado = cadastrarAluno(repositorio, ana);

      expect(resultado.ok).toBe(true);
      expect(repositorio.listar()).toEqual([resultado.aluno]);
    });

    it("guarda o CPF só com dígitos, mesmo digitado com máscara", () => {
      const resultado = cadastrarAluno(repositorio, ana);

      expect(resultado.aluno.cpf).toBe("12345678909");
    });

    it.each([
      "123.456.789-00", // dígito verificador errado
      "111.111.111-11", // todos os dígitos iguais
      "12345678", // curto demais
      "abc", // letras
      "", // vazio
    ])("CA02: rejeita o CPF inválido %j e não salva", (cpf) => {
      const resultado = cadastrarAluno(repositorio, { ...ana, cpf });

      expect(resultado.ok).toBe(false);
      expect(resultado.erros.length).toBeGreaterThan(0);
      expect(repositorio.listar()).toEqual([]);
    });

    it("CA03: rejeita CPF duplicado, mesmo escrito com outra máscara", () => {
      cadastrarAluno(repositorio, ana);

      const duplicado = cadastrarAluno(repositorio, { ...bruno, cpf: "12345678909" });

      expect(duplicado.ok).toBe(false);
      expect(repositorio.listar()).toHaveLength(1);
    });

    it("rejeita nome e e-mail inválidos e não salva", () => {
      const resultado = cadastrarAluno(repositorio, {
        nome: "   ",
        cpf: bruno.cpf,
        email: "sem-arroba",
      });

      expect(resultado.ok).toBe(false);
      expect(repositorio.listar()).toEqual([]);
    });

    it("informa vários erros de uma vez", () => {
      const resultado = cadastrarAluno(repositorio, { nome: "", cpf: "000", email: "x" });

      expect(resultado.ok).toBe(false);
      expect(resultado.erros.length).toBeGreaterThan(1);
    });
  });

  describe("consulta", () => {
    // Antes de cada teste desta gaveta, cadastra os três alunos
    beforeEach(() => {
      cadastrarAluno(repositorio, ana);
      cadastrarAluno(repositorio, bruno);
      cadastrarAluno(repositorio, carla);
    });

    it("CA04: busca por nome e devolve só o aluno correspondente", () => {
      const achados = filtrarAlunos(repositorio.listar(), "bruno");

      expect(achados).toHaveLength(1);
      expect(achados[0].nome).toBe("Bruno Lima");
    });

    it("CA04: busca por CPF digitado com máscara", () => {
      const achados = filtrarAlunos(repositorio.listar(), "529.982.247-25");

      expect(achados).toHaveLength(1);
      expect(achados[0].nome).toBe("Bruno Lima");
    });

    it("CA04: termo vazio mostra todos os alunos", () => {
      expect(filtrarAlunos(repositorio.listar(), "")).toHaveLength(3);
    });

    it("CA05: busca sem resultado devolve lista vazia", () => {
      expect(filtrarAlunos(repositorio.listar(), "zzz")).toEqual([]);
    });
  });

  describe("persistência", () => {
    it("os alunos continuam lá quando a página é recarregada", () => {
      cadastrarAluno(repositorio, ana);

      // "Recarregar a página": cria outro repositório sobre a MESMA gaveta
      const depoisDeRecarregar = criarAlunoRepository(armazenamento);

      expect(depoisDeRecarregar.listar()).toHaveLength(1);
      expect(depoisDeRecarregar.buscarPorCpf("12345678909")).not.toBeNull();
    });
  });
});