import { describe, it, expect } from 'vitest';
import { filtrarAlunos } from '../../src/js/domain/busca.js';

describe('Busca de Alunos', () => {
  const alunos = [
    { id: 1, nome: 'João da Silva', cpf: '12345678909', email: 'joao@email.com' },
    { id: 2, nome: 'Maria Conceição', cpf: '98765432100', email: 'maria@email.com' },
    { id: 3, nome: 'Ana Souza', cpf: '11122233344', email: 'ana@email.com' }
  ];

  it('deve retornar a lista completa se o termo for vazio', () => {
    expect(filtrarAlunos(alunos, '')).toHaveLength(3);
expect(filtrarAlunos(alunos, '   ')).toHaveLength(3);
  });

  it('deve buscar por nome ignorando maiúsculas/minúsculas e acentos', () => {
    const resultado = filtrarAlunos(alunos, 'joao');
    expect(resultado.length).toBe(1);
    expect(resultado[0].nome).toBe('João da Silva');

    const resultado2 = filtrarAlunos(alunos, 'CONCEIÇÃO');
    expect(resultado2.length).toBe(1);
    expect(resultado2[0].nome).toBe('Maria Conceição');
  });

  it('deve buscar por CPF exato ou com máscara', () => {
    // Sem máscara
    expect(filtrarAlunos(alunos, '98765432100').length).toBe(1);
    // Com máscara
    expect(filtrarAlunos(alunos, '111.222.333-44').length).toBe(1);
  });

  it('deve retornar lista vazia se não encontrar ninguém', () => {
    expect(filtrarAlunos(alunos, 'Zezinho')).toEqual([]);
    expect(filtrarAlunos(alunos, '000.000.000-00')).toEqual([]);
  });
});