import { validarNome } from "../domain/nome.js";
import { validarEmail } from "../domain/email.js";
import { validarCpf, normalizarCpf } from "../domain/cpf.js";

export function cadastrarAluno(repositorio, dados) {
  const erros = [];
  const cpf = normalizarCpf(dados.cpf);

  if (!validarNome(dados.nome)) {
    erros.push("Nome inválido: use de 3 a 100 caracteres.");
  }
  if (!validarEmail(dados.email)) {
    erros.push("E-mail inválido.");
  }
  if (!validarCpf(dados.cpf)) {
    erros.push("CPF inválido.");
  } else if (repositorio.buscarPorCpf(cpf) !== null) {
    erros.push("CPF já cadastrado.");
  }

  if (erros.length > 0) {
    return { ok: false, erros };
  }

  const aluno = repositorio.salvar({
    nome: dados.nome.trim(),
    cpf,
    email: dados.email,
  });
  return { ok: true, aluno };
}