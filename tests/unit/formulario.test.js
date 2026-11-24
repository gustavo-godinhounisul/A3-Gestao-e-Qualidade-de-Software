// @vitest-environment jsdom
/* global Event */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { inicializarTela, exibirMensagens } from '../../src/js/ui/formulario.js';

describe('UI: Formulário de Cadastro e Busca', () => {
    let formulario;
    let campoBusca;
    let containerMensagens;
    let containerLista;

    beforeEach(() => {
        document.body.innerHTML = `
            <form id="form-cadastro">
                <input id="nome" name="nome" type="text" />
                <input id="cpf" name="cpf" type="text" />
                <input id="email" name="email" type="email" />
                <button type="submit">Cadastrar</button>
            </form>
            <div id="mensagens"></div>
            <input id="busca" type="search" />
            <div id="container-alunos"></div>
        `;

        formulario = document.getElementById('form-cadastro');
        campoBusca = document.getElementById('busca');
        containerMensagens = document.getElementById('mensagens');
        containerLista = document.getElementById('container-alunos');
    });

    it('deve cadastrar aluno com sucesso, exibir mensagem, limpar formulário e atualizar lista', () => {
        const alunosSalvos = [];
        const repositorio = {
            listar: vi.fn(() => alunosSalvos)
        };
        const cadastrarAluno = vi.fn((repo, dados) => {
            const novoAluno = { id: 1, ...dados };
            alunosSalvos.push(novoAluno);
            return { ok: true, aluno: novoAluno };
        });
        const filtrarAlunos = vi.fn((lista) => lista);

        inicializarTela({
            formulario,
            campoBusca,
            containerMensagens,
            containerLista,
            repositorio,
            cadastrarAluno,
            filtrarAlunos
        });

        formulario.elements.nome.value = 'Ana Silva';
        formulario.elements.cpf.value = '12345678909';
        formulario.elements.email.value = 'ana@email.com';

        formulario.dispatchEvent(new Event('submit', { cancelable: true }));

        expect(cadastrarAluno).toHaveBeenCalledWith(repositorio, {
            nome: 'Ana Silva',
            cpf: '12345678909',
            email: 'ana@email.com'
        });
        expect(containerMensagens.className).toContain('mensagem-sucesso');
        expect(containerMensagens.textContent).toContain('Aluno cadastrado com sucesso!');
        expect(formulario.elements.nome.value).toBe('');
        expect(containerLista.querySelectorAll('.aluno-linha').length).toBe(1);
    });

    it('deve exibir mensagens de erro na tela e manter os dados preenchidos quando o cadastro falhar', () => {
        const repositorio = { listar: vi.fn(() => []) };
        const cadastrarAluno = vi.fn(() => ({
            ok: false,
            erros: ['CPF inválido', 'E-mail inválido']
        }));
        const filtrarAlunos = vi.fn((lista) => lista);

        inicializarTela({
            formulario,
            campoBusca,
            containerMensagens,
            containerLista,
            repositorio,
            cadastrarAluno,
            filtrarAlunos
        });

        formulario.elements.nome.value = 'Carlos';
        formulario.elements.cpf.value = '000';
        formulario.elements.email.value = 'invalido';

        formulario.dispatchEvent(new Event('submit', { cancelable: true }));

        expect(containerMensagens.className).toContain('mensagem-erro');
        expect(containerMensagens.textContent).toContain('CPF inválido');
        expect(containerMensagens.textContent).toContain('E-mail inválido');
        expect(formulario.elements.nome.value).toBe('Carlos');
    });

    it('deve filtrar a lista ao digitar no campo de busca', () => {
        const alunos = [
            { id: 1, nome: 'Ana Silva', cpf: '11111111111', email: 'ana@email.com' },
            { id: 2, nome: 'Bruno Costa', cpf: '22222222222', email: 'bruno@email.com' }
        ];
        const repositorio = { listar: vi.fn(() => alunos) };
        const cadastrarAluno = vi.fn();
        const filtrarAlunos = vi.fn((lista, termo) =>
            lista.filter((a) => a.nome.toLowerCase().includes(termo.toLowerCase()))
        );

        inicializarTela({
            formulario,
            campoBusca,
            containerMensagens,
            containerLista,
            repositorio,
            cadastrarAluno,
            filtrarAlunos
        });

        campoBusca.value = 'Bruno';
        campoBusca.dispatchEvent(new Event('input'));

        expect(filtrarAlunos).toHaveBeenLastCalledWith(alunos, 'Bruno');
        expect(containerLista.querySelectorAll('.aluno-linha').length).toBe(1);
        expect(containerLista.textContent).toContain('Bruno Costa');
    });

    it('deve renderizar mensagens contendo tags HTML como texto puro (sem XSS)', () => {
        exibirMensagens(containerMensagens, 'erro', ['<script>alert("xss")</script>']);

        expect(containerMensagens.innerHTML).not.toContain('<script>');
        expect(containerMensagens.textContent).toContain('<script>alert("xss")</script>');
    });
});