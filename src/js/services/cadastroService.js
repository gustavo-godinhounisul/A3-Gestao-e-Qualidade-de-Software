import { normalizarCpf } from "../domain/cpf.js";

export function cadastrarAluno(repositorio, dados) {
  const aluno = repositorio.salvar({
    nome: dados.nome.trim(),
    cpf: normalizarCpf(dados.cpf),
    email: dados.email,
  });
  return { ok: true, aluno };
}