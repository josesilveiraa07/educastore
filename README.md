# Educastore

E-commerce de materiais escolares. A vitrine, o carrinho, o checkout, a conta do cliente e as páginas de contato são um site estático em HTML, CSS e Web Components.

O plano de gerenciamento de configuração deste projeto está em [docs/plano-gcs.md](docs/plano-gcs.md) (o original em Word está em [docs/Plano_GCS_Educastore.docx](docs/Plano_GCS_Educastore.docx)).

| Pasta | Conteúdo |
|---|---|
| `components/` | Web Components da loja (cabeçalho, produto, carrinho, conta) |
| `pages/` | Páginas montadas com esses componentes |
| `styles/` | Folhas de estilo globais |
| `images/` | Imagens do catálogo e da marca |
| `docs/` | Plano de GCS |
| `.github/` | Modelos de Pull Request e de Issue, e `CODEOWNERS` |

## Stack

HTML, CSS e JavaScript no navegador, sem framework e sem backend. O ícone do Font Awesome vem de CDN. Não há dependências instaláveis, então o repositório não tem lockfile.

## Como rodar

Na raiz do repositório:

```bash
python3 -m http.server 8080
```

Abra [http://localhost:8080](http://localhost:8080).

O servidor precisa partir da raiz: vários links usam caminho absoluto (`/pages/...`) e não funcionam se o `index.html` for aberto direto pelo disco.

## Como testar

Esta versão ainda não tem suíte automatizada. A verificação é manual, com o servidor local no ar:

1. Home: vitrine, busca e listagem de produtos.
2. Produto: `/pages/product/product-detail.html`.
3. Carrinho: abrir o componente pela vitrine.
4. Autenticação: `/pages/auth/login.html`, `/pages/auth/register.html` e `/pages/auth/reset.html`.
5. Conta: `/pages/account/my-account.html`.
6. Pagamento: `/pages/payment/payment.html`.
7. Contato: `/pages/contact/contact.html`.

## Integrantes

- Victhor Hugo Wandersee Rodrigues Philippe
- José Eduardo Gonçalves Silveira
- Enzo Viana
- Kaian Dias
- Otávio Luiz Gelain
- João Henrique de Souza Ramos
