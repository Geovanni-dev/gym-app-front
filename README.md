<div align="center">
  
  #   **Super Frango App**
  *"A força não vem do corpo. Vem da vontade de nunca parar."*

  [![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://gym-app-front.vercel.app)
  [![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>

<br />

## 📱 **Sobre o Projeto**

O **Super Frango App** é um aplicativo mobile-first de gerenciamento de treinos desenvolvido para suprir uma necessidade real minha e de um grupo de amigos. Inspirado no nosso grupo "Super Frango" do **Gym Rats** (aplicativo de desafios em grupo na academia), o projeto nasceu da necessidade de **compartilhar treinos** e **acompanhar evolução** de forma prática e personalizada. As cores, o nome e a identidade visual foram totalmente inspirados no grupo, trazendo uma identidade única e familiar para os membros.

A **API** foi desenvolvida com o objetivo de consolidar habilidades técnicas em **Node.js, Express e MongoDB**. Partindo de uma base já existente, foram adicionadas apenas mais algumas funcionalidades essenciais e integradas ao frontend. Este foi construído integralmente em **React** para atender às necessidades do projeto e aplicar boas práticas do framework.


## 🖥️ **Demonstração**


<p align="center">
<img src="./public/images/TELA-LOGIN.png" width="220" alt="Login" />
&nbsp;&nbsp;&nbsp;&nbsp;
<img src="./public/images/TELA-INICIO.png" width="220" alt="Início" />
&nbsp;&nbsp;&nbsp;&nbsp;
<img src="./public/images/TELA-EXERCICIO.png" width="220" alt="Treino" />
&nbsp;&nbsp;&nbsp;&nbsp;
<img src="./public/images/TELA-HISTORICO.png" width="220" alt="Histórico" />
</p>

---

## ⚡ **Destaques & Funcionalidades**

-  **Planos Inteligentes** – Crie do zero ou gere treinos automáticos por objetivo.
-  **Ecossistema Social** – Importe treinos de amigos via código único.
-  **Modo Treino Ativo** – Checklist interativo e registro de histórico em tempo real.
-  **Hall dos PRs** – Acompanhe seus recordes pessoais por exercício.
-  **Cloudinary Integration** – Upload de foto de perfil integrado.

---

## 🎯 **Diferenciais de UX Mobile**

Para entregar uma experiência próxima a um app nativo (PWA), implementei:

*  **Overlays Inteligentes:** Edições utilizam camadas flutuantes, preservando o scroll e o estado da página principal.
*  **Keyboard Awareness:** Detecção automática de teclado no Android para liberar espaço de input.
*  **Scroll Controlado:** Uso de `overscroll-behavior-y: contain` para evitar comportamentos indesejados de "pull-to-refresh".

---

| Categoria | Tecnologia | Finalidade |
|:----------|:-----------|:-----------|
| **Core** | `React 18` | Biblioteca de UI |
| **Tooling** | `Vite` | Build tool ultra-rápido |
| **Styles** | `Tailwind CSS` | Estilização utilitária e responsiva |
| **Forms** | `React Hook Form` | Gerenciamento de formulários |
| **Validation** | `Zod` | Validação de schemas tipados |
| **Data** | `Axios` | Consumo da API REST |
---

### Organização de Pastas
```bash
src/
├── components/   # UI Reutilizável & Modais (Overlays)
├── views/        # Telas principais da aplicação
├── hooks/        # Lógica customizada (ScrollLock, Mobile detection)
├── services/     # Camada de dados e chamadas API
└── utils/        # Temas e funções auxiliares
````

## 📱 Instalação como PWA (Mobile)

Acesse o app diretamente pelo link: [https://gym-superfrango.vercel.app](https://gym-superfrango.vercel.app)

* **No Android:** Chrome → Menu (três pontos) → Instalar aplicativo.
* **No iOS:** Safari → Compartilhar → Adicionar à Tela de Início.

**Após a instalação, o app terá ícone personalizado e abrirá em tela cheia, sem a barra de endereços do navegador.**

## 🌐 Deploy no Vercel

O frontend do projeto está hospedado na **Vercel** (plataforma cloud gratuita).

### ☁️ Por que escolhi a Vercel?

- ✅ Deploy gratuito e simples
- ✅ Integração direta com GitHub
- ✅ Suporte nativo a React e Vite
- ✅ SSL automático (HTTPS)
- ✅ Preview automático a cada push

---

```markdown
### 💻 Rodando Localmente

```bash
# Clone o repositório
git clone https://github.com/Geovanni-dev/gym-app-front.git

# Acesse a pasta
cd gym-app-front

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

## 📄 **Licença**

MIT © Geovani Rodrigues