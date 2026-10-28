# EDU — Educastore

## Plano de Gerenciamento de Configuração

Enfoque DevOps — Integração e Entrega Contínuas (CI/CD)

Versão 1.0

O arquivo original está em [Plano_GCS_Educastore.docx](Plano_GCS_Educastore.docx). Este Markdown é o mesmo plano, versionado como item de configuração.

| Campo | Descrição |
|---|---|
| Projeto | EDU — Educastore |
| Gerente de Projeto | José Eduardo Gonçalves Silveira |
| Gerente/Responsável de GCS-DevOps | José Eduardo Gonçalves Silveira |
| Fábrica de Software / Squad | Projeto individual - educastore |
| Repositório principal | https://github.com/josesilveiraa07/educastore |

### Histórico de revisões

| Data | Versão | Descrição | Autor |
|---|---|---|---|
| 10/08/2026 | 1.0 | Elaboração do documento com enfoque em práticas DevOps (CI/CD). | José Silveira |

## 1. Introdução

Este Plano de Gerenciamento de Configuração (PGC) descreve as atividades de Gestão de Configuração de Software (GCS) que serão executadas ao longo do ciclo de vida do produto, com ênfase em práticas DevOps — em particular Integração Contínua (CI), Entrega/Implantação Contínua (CD), Infraestrutura como Código (IaC) e automação de pipelines. As atividades envolvem identificar os itens de configuração, manter sua integridade e controlar sistematicamente as mudanças, com o mínimo de burocracia possível e o máximo de automação.

### 1.1 Finalidade

Estabelecer um padrão a ser seguido pela equipe, garantindo rastreabilidade, versionamento e controle de mudanças da plataforma Educastore, e-commerce de material escolar, apoiado por pipelines automatizados de build, teste, integração e implantação. Dada a forte sazonalidade do negócio, com picos de acesso no período de volta às aulas, o plano também visa garantir implantações seguras e reversíveis justamente nos momentos de maior tráfego.

### 1.2 Escopo

Este PGC é destinado a todos os integrantes da squad Educastore, responsável pelo desenvolvimento e operação da plataforma de e-commerce de material escolar. O escopo abrange a loja virtual (catálogo, busca e páginas de produto), o carrinho e o checkout, a área do cliente, o painel administrativo de catálogo e estoque, as integrações com meios de pagamento, transportadoras e ERP, bem como a infraestrutura que sustenta esses serviços.

### 1.3 Definições, acrônimos e abreviações

| Termo | Significado |
|---|---|
| GCS | Gestão de Configuração de Software |
| CI | Integração Contínua (Continuous Integration) |
| CD | Entrega/Implantação Contínua (Continuous Delivery / Deployment) |
| IaC | Infraestrutura como Código (Infrastructure as Code) |
| CCM | Comitê de Controle de Mudanças |
| Baseline | Conjunto de itens de configuração que atingiram um estado comprovado de estabilidade |
| Pipeline | Sequência automatizada de etapas de build, teste, análise e implantação |
| Trunk-based Development | Estratégia de branching em que os desenvolvedores integram na branch principal com alta frequência |
| SemVer | Versionamento Semântico (MAJOR.MINOR.PATCH) — 1.0.0 |
| DORA Metrics | Métricas de desempenho DevOps (Lead Time, Deployment Frequency, MTTR, Change Failure Rate) |

### 1.4 Referências

- Documento base: Processos de Desenvolvimento de Software e a Integração com GCS.
- Template do Plano de Gerenciamento de Configuração (RUP 7.0, IBM) — adaptado.

### 1.5 Visão geral

Diferente de processos tradicionais em que a GCS é predominantemente manual e concentrada em marcos formais, neste plano a GCS é tratada como parte constante do pipeline de entrega: cada commit integrado, testado e implantado automaticamente gera evidências de rastreabilidade (logs de pipeline, tags de versão, artefatos publicados), reduzindo o esforço manual e o tempo entre a mudança e sua entrega em produção.

## 2. Cultura DevOps e papéis na gerência de configuração

A GCS em um contexto DevOps é responsabilidade compartilhada entre desenvolvimento e operações ("Você constrói, você executa" — you build it, you run it), apoiada por automação. Os papéis abaixo descrevem responsabilidades típicas, que podem ser exercidas por uma mesma pessoa em squads pequenas.

| Papel | Responsabilidades |
|---|---|
| Gerente de Projeto / Product Owner | Prioriza o backlog, autoriza mudanças de maior impacto e acompanha indicadores de entrega (DORA Metrics). |
| Engenheiro DevOps / Release Engineer | Projeta e mantém os pipelines de CI/CD, define a estratégia de branching e versionamento, administra o registro de artefatos/imagens e a IaC. |
| Desenvolvedor(a) | Integra código com frequência na branch principal, escreve testes automatizados, revisa Pull Requests e é corresponsável pela qualidade do que é implantado. |
| SRE / Operações | Monitora ambientes de produção, define SLIs/SLOs, participa de postmortems e realiza rollback quando necessário. |
| QA / Automação de Testes | Mantém a suíte de testes automatizados (unitários, integração, aceitação) executada nos pipelines de CI e CD. |
| Segurança (DevSecOps) | Define políticas de análise estática (SAST), análise de dependências (SCA) e gestão de segredos integradas ao pipeline. |
| Comitê de Controle de Mudanças (CCM) | Atua apenas em mudanças de alto risco/impacto (ex.: mudanças em produção fora do fluxo padrão); mudanças de rotina seguem o fluxo automatizado de PR + pipeline. |

## 3. Ferramentas, ambientes e infraestrutura

### 3.1 Ferramentas do pipeline

| Categoria | Ferramenta(s) | Finalidade |
|---|---|---|
| Controle de versão | Git + GitHub | Versionamento de código-fonte, documentação e pipelines como código |
| Orquestração de CI/CD | GitHub Actions | Automação de build, testes, análise e implantação |
| Empacotamento | Artefato estático do site | Publicação da versão da loja sem recompilação de backend |
| Gestão de segredos | GitHub Secrets | Credenciais usadas nos pipelines, fora do código |
| Gestão de dependências / SCA | Dependabot | Identificação de vulnerabilidades em bibliotecas de terceiros |
| Rastreamento de tarefas | GitHub Issues | Vinculação de commits e Pull Requests a itens de trabalho |

### 3.2 Ambientes e infraestrutura

| Ambiente | Finalidade | Gatilho de promoção |
|---|---|---|
| Desenvolvimento | Integração contínua do código; recriado a cada pipeline. | Merge/push na branch principal (`main`) |
| Homologação / `staging` | Testes de aceitação e validação funcional antes da produção. | Pipeline após merge na `main`. Branches de deploy: somente protegidas. |
| Produção / `production` | Ambiente utilizado pelos usuários finais. | Aprovação do revisor obrigatório do Environment `production` (José Eduardo Gonçalves Silveira), depois da validação em staging. |

### 3.3 Estratégia de branching e versionamento

Trunk-based development (GitHub Flow), com branches de vida curta:

- `main` — sempre implantável; protegida por pull request obrigatório, uma aprovação de outra pessoa, histórico linear e sem bypass.
- `feature/<descrição-curta>` — branches de curta duração para cada mudança.
- `hotfix/<descrição>` — correções emergenciais, também por pull request.

O merge na `main` é somente squash. O título e a descrição do pull request viram a mensagem do commit. Versionamento semântico (MAJOR.MINOR.PATCH) e Conventional Commits (`feat`, `fix`, `chore`, `docs`, `refactor`).

## 4. Identificação da configuração

### 4.1 Itens de configuração

- Código-fonte da aplicação (`index.html`, `components/`, `pages/`, `styles/`, `images/`)
- Plano de GCS (`docs/plano-gcs.md` e `docs/Plano_GCS_Educastore.docx`)
- `README.md`, `.gitignore`, `.gitattributes` e `.env.example`
- Modelos de colaboração (`.github/pull_request_template.md`, `.github/CODEOWNERS`, `.github/ISSUE_TEMPLATE/`)
- Definições de pipeline, quando existirem (`.github/workflows`)
- Arquivos de configuração por ambiente, exceto chaves secretas

### 4.2 Convenção de nomenclatura

| Item | Convenção | Exemplo |
|---|---|---|
| Branch de feature | `feature/<ticket>-<descrição-curta>` | `feature/EDU-123-filtro-por-serie` |
| Commit | Conventional Commits: `<tipo>(<escopo>): <descrição>` | `feat(carrinho): calcula frete por CEP` |
| Tag de release | Versionamento semântico `vX.Y.Z` | `v2.3.0` |

### 4.3 Estrutura do repositório

```text
educastore/
├── index.html
├── components/     # separação de responsabilidades
├── pages/          # páginas construídas com os componentes
├── styles/
├── images/
├── docs/           # plano de GCS
├── .github/        # PR, issues e CODEOWNERS
└── README.md
```

## 5. Integração contínua (CI)

Todo pull request para a `main` deve disparar o pipeline de CI. Nenhuma mudança é integrada sem que o pipeline termine com sucesso. Os checks de status entram na aula seguinte; a proteção da `main` já exige pull request e uma aprovação.

### 5.1 Etapas do pipeline de CI

- Checkout do código
- Verificação de que o site abre a partir da raiz
- Análise estática, quando a suíte existir
- Testes automatizados, quando a suíte existir

### 5.2 Política de pull request e revisão de código

- Todo PR exige, no mínimo, 1 aprovação de outra pessoa antes do merge.
- PRs pequenos e de vida curta.
- Merge somente por squash, com histórico linear.
- Aprovações antigas são descartadas quando há commit novo.

### 5.3 Critérios de qualidade

Enquanto não houver suíte automatizada, a verificação é a navegação descrita no README. O alvo do plano é cobertura de testes unitários de 80% nos módulos de carrinho, checkout e pagamentos, zero vulnerabilidades críticas ou altas, e zero erros de lint bloqueantes.

## 6. Entrega e implantação contínua (CD)

### 6.1 Etapas

- Deploy automático em `staging` depois do merge na `main`.
- Gate de aprovação em `production`: revisor obrigatório, sem impedir a autoaprovação do líder em equipe pequena (`prevent_self_review` desmarcado).
- Smoke test depois do deploy e tag de baseline.

### 6.2 Estratégias de implantação

| Estratégia | Descrição |
|---|---|
| Rolling update | Substituição gradual das instâncias antigas. |
| Blue-green | Duas versões coexistem; o tráfego muda de uma vez. |
| Canary | A nova versão recebe uma fração do tráfego e cresce aos poucos. |
| Feature flags | Funcionalidade entra desligada e é ativada sem um deploy novo. |

### 6.3 Rollback

Toda implantação deve ser reversível, voltando à tag e ao artefato da versão anterior.

## 7. Infraestrutura como código

Alterações de infraestrutura seguem o mesmo fluxo de pull request. Ambientes efêmeros de revisão, quando existirem, nascem com o PR e são removidos no merge ou no fechamento.

## 8. Controle de configuração e mudança

Mudanças de rotina seguem: issue, branch de feature, pull request, revisão, merge, deploy. O CCM entra só em mudança de alto impacto: esquema de dados, infraestrutura ou hotfix fora do fluxo padrão.

## 9. Baselines e releases

Cada implantação bem-sucedida em produção gera uma tag SemVer no commit correspondente. As notas de versão saem dos Conventional Commits desde a tag anterior.

## 10. Estimativa do status de configuração

O histórico de pipelines e de Git é o insumo de auditoria. Métricas DORA acompanhadas: frequência de deploy, lead time, taxa de falha de mudança e tempo médio de restauração.

## 11. Marcos

1. Pipeline de CI com quality gate.
2. Pipeline de CD com deploy automático em staging.
3. Ambientes reproduzíveis para o pico de volta às aulas.
4. Primeira implantação em produção com possibilidade de rollback.
5. Ensaio antes da campanha de volta às aulas.

## 12. Treinamento e recursos

Conventional Commits, trunk-based development e o fluxo de pull request para quem altera a loja. Rollback e feature flags antes de cada pico sazonal.

## 13. Dependências de terceiros

Bibliotecas de terceiros entram com versão travada. Análise de vulnerabilidades e atualizações (Dependabot) passam pelo mesmo fluxo de pull request. Não há lockfile hoje porque o site não instala pacotes; o Font Awesome é referenciado pela CDN no HTML.

## 14. Quadro-resumo do pipeline CI/CD

| Etapa | Descrição | Gatilho |
|---|---|---|
| CI | Verificação do site e, quando existirem, testes e análise de segurança. | Abertura ou atualização de pull request |
| Merge | Integração na `main` por squash. | Uma aprovação e, depois, CI verde |
| CD — staging | Deploy em homologação. | Merge na `main` |
| Gate de release | Aprovação do Environment `production`. | Sucesso em staging |
| CD — produção | Deploy, smoke test e tag de baseline. | Aprovação do revisor obrigatório |
