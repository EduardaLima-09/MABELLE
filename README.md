# MABELLE

Loja de beleza especializada em perucas, laces, cabelo humano, rabos de cavalo e acessórios.

Loja demonstrativa (projeto acadêmico). Todos os produtos, preços e dados comerciais são fictícios.

## Identidade visual

Direção editorial de luxo, definida por tokens globais em `src/shared/theme.css`:

- Paleta: vinho profundo (`#2b1018`), vinho bordô (`#6f2c3e`), nude (`#e7d7c9`), creme (`#f4ede4`), off-white (`#fbf8f4`), ouro suave (`#c2a46c`) e tinta escura (`#241017`).
- Tipografia: Cormorant Garamond (títulos) e Jost (textos).
- Linhas divisórias finas, bordas discretas, sombras suaves e bastante espaço em branco.
- Logotipo: `src/assets/LogoMabelleWordmark.png` (wordmark extraído de `src/assets/LogoMabelle.png`).

## Stack

- React 19 + Vite
- JavaScript com CSS Modules
- Oxlint (lint)

## Scripts

```bash
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção em dist/
npm run preview  # pré-visualização do build
npm run lint     # análise estática
```

## Estrutura

```
src/
  assets/        imagens da marca e catálogo de produtos
  components/    componentes reutilizáveis (carrinho, modais, filtros, títulos de seção, rodapé)
  data/          dados do catálogo (produtos e destaques)
  model/         dados legados de demonstração
  presentation/  seções da página (hero, sobre, queridinhos, FAQ, depoimentos, navbar)
  shared/        tema global (variáveis CSS e fontes)
  viewmodel/     hooks de estado (carrinho, favoritos, animação de entrada)
```

## Seções

- Hero editorial de campanha
- Sobre a MABELLE
- Os queridinhos da MABELLE (destaques em destaque)
- Catálogo completo com filtros, favoritos e ordenação
- Depoimentos (marcados como ilustrativos)
- Dúvidas frequentes
- Card de boas-vindas exibido a cada carregamento da página
- Rodapé com categorias, contato e avisos de dados fictícios

