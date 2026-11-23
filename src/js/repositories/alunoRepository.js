const CHAVE = "alunos";

export function criarAlunoRepository(armazenamento) {
  function lerTodos() {
    const texto = armazenamento.getItem(CHAVE);
    return texto === null ? [] : JSON.parse(texto);
  }

  function gravarTodos(alunos) {
    armazenamento.setItem(CHAVE, JSON.stringify(alunos));
  }

  function proximoId(alunos) {
    return alunos.length === 0 ? 1 : Math.max(...alunos.map((a) => a.id)) + 1;
  }

  return {
    listar() {
      return lerTodos();
    },

    salvar(dados) {
      const alunos = lerTodos();
      const aluno = {
        id: proximoId(alunos),
        nome: dados.nome,
        cpf: dados.cpf,
        email: dados.email,
      };
      alunos.push(aluno);
      gravarTodos(alunos);
      return aluno;
    },

    buscarPorCpf(cpf) {
      return lerTodos().find((aluno) => aluno.cpf === cpf) ?? null;
    },

    atualizar(aluno) {
      const alunos = lerTodos();
      const posicao = alunos.findIndex((a) => a.id === aluno.id);
      if (posicao === -1) {
        return null;
      }
      alunos[posicao] = { ...alunos[posicao], ...aluno };
      gravarTodos(alunos);
      return alunos[posicao];
    },
  };
}