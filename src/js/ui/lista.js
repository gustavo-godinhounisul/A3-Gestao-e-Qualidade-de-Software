export function renderizarLista(container, alunos) {
    container.textContent = ''; // Limpa a tela antes de renderizar

    if (!alunos || alunos.length === 0) {
        container.textContent = 'Nenhum aluno encontrado';
        return;
    }

    alunos.forEach(aluno => {
        const linha = document.createElement('div');
        linha.className = 'aluno-linha'; // Classe procurada no teste

        // Criação individual usando textContent por segurança
        const nomeEl = document.createElement('p');
        nomeEl.textContent = `Nome: ${aluno.nome}`;

        const cpfEl = document.createElement('p');
        cpfEl.textContent = `CPF: ${aluno.cpf}`;

        const emailEl = document.createElement('p');
        emailEl.textContent = `E-mail: ${aluno.email}`;

        linha.appendChild(nomeEl);
        linha.appendChild(cpfEl);
        linha.appendChild(emailEl);

        container.appendChild(linha);
    });
}