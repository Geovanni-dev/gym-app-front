<div align="center">
  
  #   **Super Frango App**
  
  > *"A força não vem do corpo. Vem da vontade de nunca parar."*

  [![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://gym-app-front.vercel.app)
  [![Render](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://superfrango-app.onrender.com)
  [![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>

<br />

## 📱 **Sobre o Projeto**

> O **Super Frango App** é um aplicativo mobile-first de gerenciamento de treinos desenvolvido para suprir uma necessidade real minha e de um grupo de amigos. Inspirado no nosso grupo "Super Frango" do **Gym Rats** (aplicativo de desafios em grupo na academia), o projeto nasceu da necessidade de **compartilhar treinos** e **acompanhar evolução** de forma prática e personalizada.


> A API do aplicativo foi desenvolvida como parte do meu portfólio e para fins de estudo, enquanto o frontend foi construído para uso diário do nosso grupo, com funcionalidades que vão além do básico.



---

## 📸 **Demonstração**

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="./public/images/TELA-LOGIN.png" width="200" alt="Tela de Planos" /></td>
      <td align="center"><img src="./public/images/TELA-INICIO.png" width="200" alt="Detalhe do Plano" /></td>
      <td align="center"><img src="./public/images/TELA-EXERCICIO.png" width="200" alt="Modo Treino" /></td>
      <td align="center"><img src="./public/images/TELA-HISTORICO.png" width="200" alt="Histórico e PRs" /></td>
    </tr>
  </table>
</div>

---

## ✨ **Funcionalidades Principais**

- ✅ **Planos Manuais e Automáticos** – Crie do zero ou gere treinos por objetivo
- 🔄 **Compartilhamento** – Importe treinos via código único
- 📝 **Modo Treino** – Checklist interativo e registro de histórico
- 🏆 **Hall dos PRs** – Acompanhe seus recordes pessoais por exercício
- 🖼️ **Perfil Visual** – Upload de foto integrado ao Cloudinary

---

## 🛠️ **Tecnologias Utilizadas**

| Categoria | Tecnologia | Finalidade |
|:----------|:-----------|:-----------|
| **Core** | `React 18` | Biblioteca de UI |
| **Tooling** | `Vite` | Build tool ultra-rápido |
| **Styles** | `Tailwind CSS` | Estilização utilitária e responsiva |
| **Forms** | `React Hook Form` | Gerenciamento de formulários |
| **Validation** | `Zod` | Validação de schemas tipados |
| **Data** | `Axios` | Consumo da API REST |

---

## 🏗️ **Arquitetura do Frontend**

```bash
src/
├──  components/        # Overlays (Modals) e componentes reutilizaveis
├──  views/             # Telas principais (Auth, App, Modals)
├──  contexts/          # Autenticacao e estado global
├──  hooks/              # Hooks customizados (useLockScroll, useScrollToInput)
├──  services/          # Configuracao Axios e chamadas API
└──  utils/             # Temas e funcoes utilitarias
````
----
## 🎯 Diferenciais Técnicos (UX Mobile)

🔹 Overlays vs Páginas:
Edições usam overlays flutuantes. O conteúdo principal nunca é desmontado, preservando o scroll e o estado ao voltar.
--
🔹 Detecção de Teclado:
O app esconde elementos secundários no Android para liberar espaço para o input quando o teclado sobe.
--
🔹 Scroll Controlado:
Implementação de overscroll-behavior-y: contain para evitar comportamentos indesejados em navegadores mobile.
--

----

## 🚀 Como Executar Localmente
````bash
# Clone o repositório
git clone https://github.com/Geovanni-dev/gym-app-front.git

# Acesse a pasta
cd gym-app-front

# Instale as dependências
npm install

# Execute o projeto
npm run dev
````
## 📄 Licença
Este projeto é de uso pessoal e educacional. Todos os direitos reservados.
