// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderizarLista } from '../../src/js/ui/lista.js';

describe('UI: Lista de Alunos', () => {
    let container;

    beforeEach(() => {
        // Prepara um DOM falso limpo antes de cada teste
        document.body.innerHTML = '<div id="container-alunos"></div>';
        container = document.getElementById('container-alunos');
    });

    it('deve renderizar 2 linhas para 2 alunos', () => {
        const alunos = [
            { id: 1, nome: 'João', cpf: '111.111.111-11', email: 'joao@email.com' },
            { id: 2, nome: 'Maria', cpf: '222.222.222-22', email: 'maria@email.com' }
        ];
        renderizarLista(container, alunos);
        
        // Verifica se foram criados 2 elementos com a classe da linha
        expect(container.querySelectorAll('.aluno-linha').length).toBe(2);
    });

    it('deve mostrar "Nenhum aluno encontrado" quando a lista for vazia', () => {
        renderizarLista(container, []);
        expect(container.textContent).toContain('Nenhum aluno encontrado');
    });

    it('deve exibir um nome com <script> como texto puro (segurança)', () => {
        const alunos = [
            { id: 3, nome: '<script>alert("hacker")</script>', cpf: '333.333.333-33', email: 'hacker@email.com' }
        ];
        renderizarLista(container, alunos);
        
        // Garante que a tag não foi inserida como código e sim como texto
        expect(container.innerHTML).not.toContain('<script>');
        expect(container.textContent).toContain('<script>alert("hacker")</script>');
    });
});