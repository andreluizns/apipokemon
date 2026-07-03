# Pokedex

SPA em React + TypeScript que consome a [PokeAPI](https://pokeapi.co/) pública para listar, buscar, filtrar (tipo, altura, peso, geração), favoritar, comparar estatísticas e exibir a cadeia evolutiva de Pokémons.

## Rodando localmente

Pré-requisitos: Node.js 18+.

```bash
npm install
npm run dev
```

Acesse http://localhost:5173.

Rodar os testes:

```bash
npm run test
```

Build de produção:

```bash
npm run build
npm run preview
```

## Funcionalidades

- **Listagem paginada**: no mínimo 20 Pokémons por vez, com "Carregar mais".
- **Busca por nome**: com debounce de 300ms.
- **Filtro por tipo**: bottom sheet com os 18 tipos, rótulos em pt-BR.
- **Filtros avançados**: altura, peso e geração (diferencial do case).
- **Favoritos**: estado global (Zustand), persistido em `localStorage`, com página dedicada (`/favoritos`).
- **Detalhes em rota dedicada**: `/pokemon/:id`, com sprite em pixel art, descrição, peso/altura/categoria/habilidade, proporção de gênero, estatísticas, fraquezas de tipo (calculadas no cliente) e cadeia evolutiva (suporta ramificações, ex.: Eevee).
- **Comparação**: `/comparar`, duas colunas de estatísticas lado a lado.
- **Responsivo**: layout mobile-first que expande para 2 colunas e um container mais largo a partir de 768px.

## Stack

- React 19 + TypeScript (strict, sem `any`)
- Vite
- Tailwind CSS v4 + Poppins (`@fontsource/poppins`)
- React Router (`/`, `/pokemon/:id`, `/favoritos`, `/comparar`)
- Zustand com middleware `persist` (favoritos em `localStorage`)
- Vitest + Testing Library (TDD em toda a lógica de hooks/utils e nos componentes — 96 testes)

## Decisões técnicas

- **Sem backend próprio**: a PokeAPI é pública, sem autenticação e com CORS liberado, então todo o fetch acontece direto do client.
- **Busca por nome**: a PokeAPI não tem endpoint de busca textual. A lista completa de nomes (`/pokemon?limit=100000`) é buscada uma vez por sessão de filtro e filtrada no cliente por substring (`resolvePokemonCandidates`).
- **Filtro por tipo**: usa `/type/{nome}`, que já retorna todos os Pokémons daquele tipo.
- **Filtros de altura/peso/geração**: esses campos só existem no endpoint de detalhe (`/pokemon/{id}`) e de espécie (`/pokemon-species/{id}`), não no de listagem. Por isso são aplicados no cliente sobre os detalhes já carregados (`filterByHeightAndWeight`, `filterByGeneration`), depois que o filtro de tipo/nome já reduziu a lista de candidatos — combinar um filtro muito restritivo com "carregar mais" pode fazer uma página aparente ter menos de 20 itens, já que o filtro é local ao lote buscado, não ao total do dataset. Tradeoff assumido conscientemente por não haver filtro combinado no lado do servidor.
- **Cadeia evolutiva**: `pokemon-species` aponta para uma `evolution-chain`, que é uma árvore (não uma lista) para suportar ramificações como a do Eevee. `flattenEvolutionChain` percorre essa árvore em largura e devolve estágios, cada um podendo ter múltiplas espécies. A URL da cadeia evolutiva é reaproveitada da mesma resposta de espécie já buscada pela página de detalhes, evitando uma segunda chamada duplicada a `/pokemon-species/{id}`.
- **Estado global de favoritos**: Zustand com `persist`, chave `pokedex-favorites` no `localStorage`.
- **Tratamento consistente de fetch assíncrono**: todo hook/efeito que busca dados segue o mesmo padrão — flag de cancelamento (evita atualizar estado de uma resposta obsoleta quando os filtros mudam no meio de uma requisição), `isLoading` cobrindo o fetch inteiro (inclusive fases intermediárias, como a resolução de candidatos antes da busca de detalhes) e `.catch()` explícito com mensagem de erro visível ao usuário.
- **Fraquezas de tipo**: a PokeAPI não retorna um campo pronto de "fraquezas". `computeWeaknesses` busca `damage_relations` de cada tipo do Pokémon via `/type/{nome}` e multiplica os multiplicadores entre si (ex.: um Pokémon Grama/Venenoso é fraco contra Terra pela Grama, mas o Venenoso resiste Terra — o resultado final é neutro, não fraqueza). Validado contra a tabela real do Bulbasaur.
- **Texto descritivo (flavor text)**: busca a entrada em `pt-br` e cai para `en` se não existir. Na prática, a maioria das espécies na PokeAPI real não tem tradução para português — o fallback para inglês é o caminho comum, não uma exceção.
- **Ícones fornecidos pelo usuário**: alguns PNGs continham a borda tracejada do frame do Figma gravada nos próprios pixels do export; foram recortados automaticamente (detecção de cor + bounding box) antes de entrar no projeto. Ícones com dois estados empilhados numa única imagem (ativo/inativo) são "fatiados" via CSS (`background-position` + `background-size: 100% 200%`) em vez de duplicar o arquivo.

## Estrutura

```
src/
  api/         # funções tipadas de acesso à PokeAPI
  components/  # componentes de apresentação, um por pasta com teste co-localizado
  constants/   # cores/labels de tipo, gerações
  hooks/       # lógica de dados (fetch, paginação, filtros, debounce)
  pages/       # telas roteadas
  store/       # estado global (favoritos)
  types/       # tipos das respostas da PokeAPI
  utils/       # funções puras (formatação, filtros, parsing da evolution chain)
```

## Deploy

[preencher após o deploy, ex.: https://pokedex-seu-usuario.vercel.app]
