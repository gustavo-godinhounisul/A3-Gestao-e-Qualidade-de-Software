import { renderizarLista } from './lista.js';

export function exibirMensagens(container, tipo, mensagens) {
    container.textContent = '';
    container.className = `mensagens mensagem-${tipo}`;

    mensagens.forEach((texto) => {
        const paragrafo = document.createElement('p');
        paragrafo.textContent = texto;
        container.appendChild(paragrafo);
    });
}

export function inicializarTela({
    formulario,
    campoBusca,
    containerMensagens,
    containerLista,
    repositorio,
    cadastrarAluno,
    filtrarAlunos
}) {
    function atualizarLista() {
        const todosAlunos = repositorio.listar();
        const alunosExibidos = filtrarAlunos(todosAlunos, campoBusca.value);
        renderizarLista(containerLista, alunosExibidos);
    }

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const dados = {
            nome: formulario.elements.nome.value,
            cpf: formulario.elements.cpf.value,
            email: formulario.elements.email.value
        };

        const resultado = cadastrarAluno(repositorio, dados);

        if (resultado.ok) {
            exibirMensagens(containerMensagens, 'sucesso', ['Aluno cadastrado com sucesso!']);
            formulario.reset();
            atualizarLista();
        } else {
            exibirMensagens(containerMensagens, 'erro', resultado.erros);
        }
    });

    campoBusca.addEventListener('input', atualizarLista);

    atualizarLista();
}