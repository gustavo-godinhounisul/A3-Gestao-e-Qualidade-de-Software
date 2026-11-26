import { test, expect } from '@playwright/test';

test.describe('Fluxo de sistema: cadastrar e buscar alunos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('CA01: deve cadastrar aluno válido, exibir na lista e mostrar mensagem de retorno', async ({ page }) => {
    await page.fill('#nome', 'Maria Conceição');
    await page.fill('#cpf', '123.456.789-09');
    await page.fill('#email', 'maria@email.com');
    await page.click('#form-cadastro button[type="submit"]');

    await expect(page.locator('#container-alunos')).toContainText('Maria Conceição');
    await expect(page.locator('#mensagens')).not.toBeEmpty();
  });

  test('CA04: deve filtrar alunos por nome (sem acento/maiúscula) e por CPF', async ({ page }) => {
    await page.fill('#nome', 'Maria Conceição');
    await page.fill('#cpf', '123.456.789-09');
    await page.fill('#email', 'maria@email.com');
    await page.click('#form-cadastro button[type="submit"]');

    await page.fill('#nome', 'João da Silva');
    await page.fill('#cpf', '529.982.247-25');
    await page.fill('#email', 'joao@email.com');
    await page.click('#form-cadastro button[type="submit"]');

    // Busca por nome ignorando acento e maiúsculas
    await page.fill('#busca', 'maria');
    await expect(page.locator('#container-alunos')).toContainText('Maria Conceição');
    await expect(page.locator('#container-alunos')).not.toContainText('João da Silva');

    // Busca por CPF com máscara
    await page.fill('#busca', '529.982.247-25');
    await expect(page.locator('#container-alunos')).toContainText('João da Silva');
    await expect(page.locator('#container-alunos')).not.toContainText('Maria Conceição');

    // Limpar busca volta a listar todos
    await page.fill('#busca', '');
    await expect(page.locator('#container-alunos')).toContainText('Maria Conceição');
    await expect(page.locator('#container-alunos')).toContainText('João da Silva');
  });

  test('CA02: deve exibir erro e não salvar quando o CPF for inválido', async ({ page }) => {
    await page.fill('#nome', 'Aluno Inválido');
    await page.fill('#cpf', '111.111.111-11');
    await page.fill('#email', 'invalido@email.com');
    await page.click('#form-cadastro button[type="submit"]');

    await expect(page.locator('#mensagens')).not.toBeEmpty();
    await expect(page.locator('#container-alunos')).not.toContainText('Aluno Inválido');
  });

  test('CA03: deve rejeitar cadastro com CPF duplicado (mesmo sem máscara)', async ({ page }) => {
    await page.fill('#nome', 'Primeiro Aluno');
    await page.fill('#cpf', '123.456.789-09');
    await page.fill('#email', 'primeiro@email.com');
    await page.click('#form-cadastro button[type="submit"]');

    await page.fill('#nome', 'Segundo Aluno');
    await page.fill('#cpf', '12345678909');
    await page.fill('#email', 'segundo@email.com');
    await page.click('#form-cadastro button[type="submit"]');

    await expect(page.locator('#mensagens')).not.toBeEmpty();
    await expect(page.locator('#container-alunos')).toContainText('Primeiro Aluno');
    await expect(page.locator('#container-alunos')).not.toContainText('Segundo Aluno');
  });

  test('CA05: deve exibir "Nenhum aluno encontrado" quando a busca não tiver resultados', async ({ page }) => {
    await page.fill('#nome', 'Maria Conceição');
    await page.fill('#cpf', '123.456.789-09');
    await page.fill('#email', 'maria@email.com');
    await page.click('#form-cadastro button[type="submit"]');

    await page.fill('#busca', 'Aluno Que Nao Existe');
    await expect(page.locator('#container-alunos')).toContainText('Nenhum aluno encontrado');
  });
});