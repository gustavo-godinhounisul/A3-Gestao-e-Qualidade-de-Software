# Sistema de Gestão de Alunos 🎓

[![CI](https://github.com/gustavo-godinhounisul/A3-Gestao-e-Qualidade-de-Software/actions/workflows/ci.yml/badge.svg)](https://github.com/gustavo-godinhounisul/A3-Gestao-e-Qualidade-de-Software/actions/workflows/ci.yml)

**Status do projeto:** 🚧 Em desenvolvimento (etapa atual: cadastro e consulta de alunos)

Repositório do trabalho da disciplina de **Gestão e Qualidade de Software**, desenvolvido pelo **Grupo 9**.

## 📝 Sobre o Projeto

Este projeto consiste no desenvolvimento de um Sistema de Gestão de Alunos, com foco não apenas na construção do software em si, mas na aplicação de práticas, normas e métricas de qualidade exigidas pela disciplina. O sistema visa facilitar o controle acadêmico (alunos, cursos, matrículas e notas) e serve como objeto de estudo para a implementação de processos de garantia de qualidade de software (SQA): testes automatizados, integração contínua, análise estática e controle de versão.

### Problema atendido

Quando o cadastro de alunos é feito em papel ou em planilhas soltas, é comum haver erros de digitação, cadastros duplicados, CPFs inválidos e dificuldade para localizar um aluno rapidamente. O sistema centraliza o cadastro e aplica regras de validação já no momento em que o dado é digitado.

### Atores

| Ator | Papel no sistema |
|---|---|
| **Secretaria** | Ator principal desta etapa: cadastra, consulta e edita alunos |
| **Professor** | Planejado para etapas futuras: lançamento de notas |
| **Aluno** | Planejado para etapas futuras: consulta das próprias notas e da situação (aprovado ou reprovado) |

## 🎯 Escopo da etapa atual

**Dentro do escopo:** cadastro, consulta e edição de alunos, com validação de CPF.

**Fora do escopo por enquanto:** cursos, matrículas, notas, histórico acadêmico e identificação por perfil. Eles serão incluídos depois que a base de alunos estiver funcionando e testada.

**Decisão de arquitetura:** o sistema é **somente front-end** (HTML, CSS e JavaScript), sem back-end e sem banco de dados. Os dados ficam no navegador, acessados por uma camada de repositório que pode ser trocada no futuro sem afetar o resto do código.

## ✅ Requisitos

### Requisitos funcionais

| ID | Requisito | Descrição |
|---|---|---|
| RF01 | Cadastrar aluno | A secretaria informa nome, CPF e e-mail e salva o aluno |
| RF02 | Consultar alunos | Listar todos os alunos e buscar por nome ou CPF |
| RF03 | Editar aluno | Alterar nome, CPF ou e-mail de um aluno já cadastrado |

### Requisitos planejados (etapas futuras)

| ID | Requisito | Descrição |
|---|---|---|
| RF04 | Identificação por perfil | Login que distingue Secretaria, Professor e Aluno |
| RF05 | Lançar notas | O professor registra as notas dos alunos matriculados |
| RF06 | Consultar as próprias notas | O aluno, depois de se identificar, vê suas notas e sua situação |

### Regras de negócio

| ID | Regra | Situação |
|---|---|---|
| **RN01** | **CPF válido e único** | **Foco desta etapa** |
| RN02 | A nota deve estar entre 0,0 e 10,0 | Implementada (`src/js/domain/nota.js`) |
| RN03 | O aluno é aprovado se a média for **maior ou igual a 7,0** | Planejada (fase de notas) |
| RN04 | A matrícula não pode exceder as vagas do curso | Planejada |
| RN05 | O aluno não pode ter matrícula duplicada no mesmo curso | Planejada |
| RN06 | Aluno ou curso com vínculos só pode ser inativado, nunca excluído | Planejada |
| RN07 | O aluno só pode visualizar os seus próprios dados | Planejada (depende de RF04) |

**Detalhe da RN01:**

- O CPF pode ser digitado com máscara (`123.456.789-09`) ou só com números.
- Deve ter exatamente 11 dígitos e os dígitos verificadores corretos.
- Sequências de números iguais (como `111.111.111-11`) são rejeitadas.
- Não pode existir outro aluno com o mesmo CPF.

### Requisitos de qualidade

| ID | Requisito | Critério de aceite |
|---|---|---|
| RNF01 | Cobertura de testes | Mínimo de **75%** do código-fonte; o CI falha abaixo disso |
| RNF02 | Análise estática | **ESLint** sem erros, executado no CI |
| RNF03 | Quality gate | O `main` só recebe Pull Requests com ESLint sem erros, testes passando e cobertura de pelo menos 75% (ver seção Quality gate) |
| RNF04 | Segurança | Dados digitados pelo usuário nunca são inseridos na página com `innerHTML`; todas as entradas são validadas |
| RNF05 | Usabilidade | Mensagens de erro claras, que dizem o que precisa ser corrigido |
| RNF06 | Compatibilidade | Funciona nas versões atuais de Chrome, Firefox e Edge |
| RNF07 | Privacidade (LGPD) | Coleta apenas os dados necessários: nome, CPF e e-mail |

### Limitações conhecidas

Por ser um sistema somente front-end:

- Os dados ficam no navegador de quem usa. Eles não são compartilhados entre computadores, e limpar os dados do navegador apaga os alunos cadastrados.
- A identificação por perfil (RF04) seria **simulada** e não ofereceria segurança real, porque qualquer pessoa com conhecimento básico consegue ler os dados pelas ferramentas do navegador. Por isso a regra RN07 só terá efeito real se o sistema ganhar um back-end.
- Essas limitações serão tratadas também no relatório final.

## 🔄 Fluxo principal

1. A secretaria abre a tela de cadastro e preenche nome, CPF e e-mail.
2. O sistema valida os dados (RN01 e formato do e-mail).
3. Se estiver tudo certo, o aluno é salvo e aparece na lista, com mensagem de sucesso.
4. Se houver erro, o sistema mostra o motivo e **não salva**.
5. Na lista, a secretaria busca um aluno por nome ou CPF.

### Critérios de aceitação

| ID | Critério |
|---|---|
| CA01 | **Dado** um CPF válido e ainda não cadastrado, **quando** a secretaria confirma o cadastro, **então** o aluno aparece na lista e o sistema exibe mensagem de sucesso |
| CA02 | **Dado** um CPF inválido, **quando** a secretaria tenta cadastrar, **então** o sistema exibe o erro e não salva o aluno |
| CA03 | **Dado** um CPF já cadastrado, **quando** a secretaria tenta cadastrar outro aluno com ele, **então** o sistema rejeita o cadastro duplicado |
| CA04 | **Dado** um nome ou CPF digitado na busca, **quando** a secretaria busca, **então** só os alunos correspondentes aparecem |
| CA05 | **Dado** uma busca sem resultados, **quando** a secretaria busca, **então** o sistema exibe "Nenhum aluno encontrado" |
| CA06 | **Dado** um aluno cadastrado, **quando** a secretaria altera os dados e confirma, **então** a lista mostra os dados atualizados; se o novo CPF já pertencer a outro aluno, a alteração é rejeitada |

Critérios planejados para a fase de notas:

- **Dado** um aluno identificado, **quando** ele consulta suas notas, **então** vê apenas as suas notas e a situação em cada curso.
- **Dado** um aluno identificado, **quando** tenta acessar as notas de outro aluno, **então** o sistema nega o acesso.

## 🛠️ Tecnologias

| Situação | Tecnologia | Uso |
|---|---|---|
| Em uso | HTML5, CSS3 e JavaScript (ES Modules) | Sistema web, sem back-end; dados guardados no navegador |
| Em uso | Node.js (versão LTS atual) | Apenas para rodar as ferramentas de desenvolvimento |
| Em uso | Vitest e `@vitest/coverage-v8` | Testes automatizados e medição de cobertura |
| Em uso | Git e GitHub | Controle de versão |
| Em uso | GitHub Actions | Integração contínua (testes e cobertura a cada envio) |
| Planejado | ESLint | Análise estática |
| Planejado | jsdom | Simular o navegador nos testes da tela |
| Planejado | Playwright | Teste de sistema (fluxo completo no navegador) |
| Planejado | Figma | Protótipo das telas |
| Se o professor exigir | SonarCloud | *Quality gate* no formato do SonarCloud |

## 🚦 Quality gate

O *quality gate* do grupo é o próprio pipeline de CI, exigido para juntar qualquer Pull Request ao `main`:

1. **ESLint** sem erros (análise estática).
2. **Testes** unitários e de integração passando.
3. **Cobertura** de pelo menos 75% (o comando falha abaixo disso).

A proteção do `main`, que bloqueia a junção quando o pipeline falha, está em configuração pelo dono do repositório. Quando estiver ativa, o print de um Pull Request bloqueado por falha será guardado aqui como evidência.

| Evidência | Link |
|---|---|
| Pull Request bloqueado pelo quality gate | PREENCHER |
| Pull Request aprovado pelo quality gate | PREENCHER |

## ⚙️ Como configurar e executar

### Pré-requisitos

- [Node.js](https://nodejs.org) versão LTS atual (o projeto usa a v24)
- [Git](https://git-scm.com)

### Configuração

```bash
git clone https://github.com/gustavo-godinhounisul/A3-Gestao-e-Qualidade-de-Software.git
cd A3-Gestao-e-Qualidade-de-Software
npm install
```

### Rodar os testes

```bash
npm test
```

### Rodar os testes com medição de cobertura

```bash
npm run coverage
```

O comando mostra uma tabela no terminal e gera um relatório navegável em `coverage/index.html`. Ele falha se a cobertura ficar abaixo de 75%.

### Executar o sistema

🚧 A primeira versão executável (telas de cadastro e consulta) está em desenvolvimento. Esta seção será atualizada com o comando para abrir o sistema assim que ela estiver pronta.

## 📊 Cobertura de testes

| Data | Cobertura de linhas | Execução no CI |
|---|---|---|
| PREENCHER | PREENCHER | PREENCHER (link da execução na aba Actions) |

Mínimo exigido: **75%**.

## 📁 Estrutura do repositório

```
A3-Gestao-e-Qualidade-de-Software/
├── .github/workflows/ci.yml   # pipeline: testes e cobertura a cada envio
├── src/
│   ├── index.html             # (planejado) página principal
│   └── js/
│       ├── domain/            # regras de negócio puras (ex.: nota.js)
│       ├── services/          # (planejado) casos de uso: cadastrar, editar
│       ├── repositories/      # (planejado) guardar e buscar dados
│       └── ui/                # (planejado) telas e eventos
├── tests/
│   ├── unit/                  # testes unitários (ex.: nota.test.js)
│   └── integration/           # (planejado) testes de integração
├── vitest.config.js           # configuração dos testes e limite de 75%
├── package.json
├── LICENSE                    # (planejado)
└── README.md
```

## 👥 Equipe: Grupo 9

| Nome | RA / Matrícula | GitHub | Perfil |
|---|---|---|---|
| Guilherme Bauer | PREENCHER | PREENCHER | PREENCHER |
| Gustavo Godinho | 10724268995 | [@gustavo-godinhounisul](https://github.com/gustavo-godinhounisul) | PREENCHER |
| Juan Natan dos Passos | 10724268997 | [@JuanNatan](https://github.com/JuanNatan) | PREENCHER |
| Vitor Fabiano da Silva | 10724262853 | [@silvavitooor](https://github.com/silvavitooor) | PREENCHER |
| Vitor Steinbach | 10724268585 | [@steinbachvitor](https://github.com/steinbachvitor) | PREENCHER |

## 🧩 Responsáveis por funcionalidade

Cada linha liga um integrante à sua funcionalidade, ao Pull Request (ou commits) com o código e aos testes correspondentes. Os links são preenchidos por cada pessoa quando o seu PR for juntado ao `main`.

| Integrante | Funcionalidade | Código (PR / commits) | Testes | Situação |
|---|---|---|---|---|
| Vitor Fabiano da Silva | Estrutura do projeto, RN02 (nota) e pipeline de CI | PREENCHER | [nota.test.js](tests/unit/nota.test.js) | ✅ Feito |
| Vitor Fabiano da Silva | Repositório de alunos (persistência) | PREENCHER | `tests/integration/alunoRepository.test.js` | ⬜ Onda 1 |
| Vitor Fabiano da Silva | Testes do fluxo completo e cobertura inicial | PREENCHER | `tests/integration/fluxo.test.js` | ⬜ Onda 2 |
| Gustavo Godinho | Busca de alunos (RF02) | PREENCHER | `tests/unit/busca.test.js` | ⬜ Onda 1 |
| Gustavo Godinho | ESLint e proteção do `main` (quality gate) | PREENCHER | Execução no CI | ⬜ Onda 1 |
| Gustavo Godinho | Teste de sistema (fluxo cadastrar e buscar) | PREENCHER | PREENCHER | ⬜ Onda 2 |
| Guilherme Bauer | Licença (`LICENSE`) | PREENCHER | Não se aplica | ⬜ Onda 1 |
| Guilherme Bauer | Validação de CPF (RN01) | PREENCHER | `tests/unit/cpf.test.js` | ⬜ Onda 1 |
| Guilherme Bauer | Edição de aluno (RF03) | PREENCHER | PREENCHER | ⬜ Onda 2 |
| Juan Natan dos Passos | Validação de nome e e-mail | PREENCHER | PREENCHER | ⬜ Onda 1 |
| Juan Natan dos Passos | Cadastro de aluno (RF01) | PREENCHER | PREENCHER | ⬜ Onda 2 |
| Vitor Steinbach | Tela de listagem de alunos | PREENCHER | PREENCHER | ⬜ Onda 1 |
| Vitor Steinbach | Formulário de cadastro e comando `npm start` | PREENCHER | PREENCHER | ⬜ Onda 2 |

## 🗓️ Próximas entregas

| Entrega | Prazo | Situação |
|---|---|---|
| README atualizado, licença e requisitos com critérios de aceitação | PREENCHER | 🚧 Em andamento |
| Onda 1: regras (CPF, nome, e-mail, busca), repositório, tela de listagem e ESLint, com testes | PREENCHER | ⬜ |
| Onda 2: cadastro, edição, formulário, `npm start` e testes do fluxo completo | PREENCHER | ⬜ |
| Cobertura inicial publicada e tabela de responsáveis com links dos PRs e testes | PREENCHER | ⬜ |

## 🤝 Como contribuir

1. Antes de começar: `git pull`.
2. Crie um branch para a tarefa, por exemplo `feat/RN01-validacao-cpf`.
3. Escreva o **teste primeiro** e depois o código.
4. Faça commits pequenos, com mensagens no formato `feat:`, `fix:`, `test:`, `docs:`, `ci:` ou `chore:`.
5. Envie o branch e abra um **Pull Request**, referenciando a issue do professor (`Refs #número`).
6. Outro integrante revisa e aprova, na ordem abaixo.
7. O CI precisa estar verde (testes passando e cobertura de pelo menos 75%) antes de juntar ao `main`.
8. Issues abertas pelos professores têm prioridade e são resolvidas até a entrega.

**Revisão em roda:**

| Autor do PR | Revisor |
|---|---|
| Guilherme Bauer | Gustavo Godinho |
| Gustavo Godinho | Juan Natan dos Passos |
| Juan Natan dos Passos | Vitor Fabiano da Silva |
| Vitor Fabiano da Silva | Vitor Steinbach |
| Vitor Steinbach | Guilherme Bauer |

## 📄 Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](LICENSE).