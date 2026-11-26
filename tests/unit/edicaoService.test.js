import { describe, it, expect, beforeEach } from "vitest";
import { editarAluno } from "../../src/js/services/edicaoService.js";

function criarRepositorioFake(alunosIniciais = []) {
  const alunos = alunosIniciais.map((aluno) => ({ ...aluno }));

  return {
    listar() {
      return alunos.map((aluno) => ({ ...aluno }));
    },
    buscarPorCpf(cpf) {
      return alunos.find((aluno) => aluno.cpf === cpf) || null;
    },
    atualizar(id, dadosAtualizados) {
      const indice = alunos.findIndex((aluno) => aluno.id === id);
      if (indice === -1) return null;
      alunos[indice] = { ...alunos[indice], ...dadosAtualizados };
      return { ...alunos[indice] };
    },
  };
}

describe("editarAluno (RF03)", () => {
  let repositorio;

  beforeEach(() => {
    repositorio = criarRepositorioFake([
      {
        id: "1",
        nome: "Ana Silva",
        email: "ana@email.com",
        cpf: "12345678909",
      },
      {
        id: "2",
        nome: "Bruno Costa",
        email: "bruno@email.com",
        cpf: "98765432100",
      },
    ]);
  });

  it("edita aluno com dados validos", () => {
    const resultado = editarAluno(repositorio, "1", {
      nome: "Ana Paula Silva",
      email: "anapaula@email.com",
      cpf: "111.444.777-35",
    });

    expect(resultado.ok).toBe(true);
    expect(resultado.aluno).toEqual({
      id: "1",
      nome: "Ana Paula Silva",
      email: "anapaula@email.com",
      cpf: "11144477735",
    });
  });

  it("permite manter o proprio CPF do aluno editado", () => {
    const resultado = editarAluno(repositorio, "1", {
      nome: "Ana Atualizada",
      email: "ana@email.com",
      cpf: "123.456.789-09",
    });

    expect(resultado.ok).toBe(true);
    expect(resultado.aluno.cpf).toBe("12345678909");
    expect(resultado.aluno.nome).toBe("Ana Atualizada");
  });

  it("rejeita CPF invalido", () => {
    const resultado = editarAluno(repositorio, "1", {
      nome: "Ana Silva",
      email: "ana@email.com",
      cpf: "111.111.111-11",
    });

    expect(resultado.ok).toBe(false);
    expect(resultado.erros).toContain("CPF inválido.");
  });

  it("rejeita CPF que ja pertence a outro aluno", () => {
    const resultado = editarAluno(repositorio, "1", {
      nome: "Ana Silva",
      email: "ana@email.com",
      cpf: "987.654.321-00",
    });

    expect(resultado.ok).toBe(false);
    expect(resultado.erros).toContain("CPF já cadastrado para outro aluno.");
  });

  it("devolve erro quando o id nao existe", () => {
    const resultado = editarAluno(repositorio, "999", {
      nome: "Qualquer Nome",
      email: "qualquer@email.com",
      cpf: "12345678909",
    });

    expect(resultado.ok).toBe(false);
    expect(resultado.erros).toContain("Aluno não encontrado.");
  });

  it("rejeita nome e e-mail invalidos", () => {
    const resultado = editarAluno(repositorio, "1", {
      nome: "Ab",
      email: "email-invalido",
      cpf: "123.456.789-09",
    });

    expect(resultado.ok).toBe(false);
    expect(resultado.erros).toContain("Nome inválido.");
    expect(resultado.erros).toContain("E-mail inválido.");
  });
});