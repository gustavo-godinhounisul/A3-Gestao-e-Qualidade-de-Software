 import { normalizarCpf, validarCpf } from "../domain/cpf.js";
import { validarEmail } from "../domain/email.js";
import { validarNome } from "../domain/nome.js";

export function editarAluno(repositorio, id, dados = {}) {
  const alunos = repositorio.listar();
  const alunoAtual = alunos.find((item) => item.id === id);

  if (!alunoAtual) {
    return { ok: false, erros: ["Aluno não encontrado."] };
  }

  const erros = [];
  const nome = dados.nome !== undefined ? dados.nome : alunoAtual.nome;
  const email = dados.email !== undefined ? dados.email : alunoAtual.email;
  const cpfEntrada = dados.cpf !== undefined ? dados.cpf : alunoAtual.cpf;

  if (!validarNome(nome)) {
    erros.push("Nome inválido.");
  }

  if (!validarEmail(email)) {
    erros.push("E-mail inválido.");
  }

  if (!validarCpf(cpfEntrada)) {
    erros.push("CPF inválido.");
  }

  if (erros.length > 0) {
    return { ok: false, erros };
  }

  const cpfNormalizado = normalizarCpf(cpfEntrada);
  const alunoComMesmoCpf = repositorio.buscarPorCpf(cpfNormalizado);

  if (alunoComMesmoCpf && alunoComMesmoCpf.id !== id) {
    return { ok: false, erros: ["CPF já cadastrado para outro aluno."] };
  }

  const alunoAtualizado = repositorio.atualizar(id, {
    ...alunoAtual,
    ...dados,
    nome: nome.trim(),
    email: email.trim(),
    cpf: cpfNormalizado,
  });

  return { ok: true, aluno: alunoAtualizado };
}