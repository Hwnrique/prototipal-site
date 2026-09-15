# Shalom Med

Protótipo institucional em React, TypeScript e Vite. Somente front-end.

## Desenvolvimento

Requer Node.js 22 e npm.

```bash
npm ci
npm run dev
```

Abra o endereço exibido pelo Vite com o caminho `/prototipal-site/`.

## Build e publicação

```bash
npm run build
npm run preview
```

O build estático é gerado em `dist/`. O workflow `.github/workflows/deploy-pages.yml` publica automaticamente no GitHub Pages a cada push em `main`.

Endereço previsto: https://hwnrique.github.io/prototipal-site/

No repositório, a origem em **Settings → Pages → Build and deployment** deve ser **GitHub Actions**.

## Personalização

- `src/App.tsx`: seções, endereço, imagens do carrossel e links sociais (`socialLinks`).
- `src/data.ts`: catálogo e artigos demonstrativos.
- `src/styles.css`: identidade visual, fontes e responsividade.
- `src/public/img/logo.png`: logo oficial.
- `vite.config.ts`: caminho base da publicação.

Os formulários apenas simulam o envio, sem armazenar dados. Os botões sociais aguardam os links oficiais. Fotografias, fontes e mapa dependem dos serviços externos Unsplash, Google Fonts e Google Maps. Produtos e conteúdo editorial são ilustrativos.
