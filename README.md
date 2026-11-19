# 🗺️ App de Otimização de Rotas Compartilhadas

<div align="center">
  <img src="https://img.shields.io/badge/Fase-Constru%C3%A7%C3%A3o%20(2%C2%AA%20Itera%C3%A7%C3%A3o%20%7C%20v2)-success?style=for-the-badge" alt="Status do Projeto">
  <img src="https://img.shields.io/badge/Disciplina-Pr%C3%A1tica%20Profissional%20ADS-blue?style=for-the-badge" alt="Disciplina">
  <img src="https://img.shields.io/badge/Universidade-Mackenzie-cc0000?style=for-the-badge" alt="Universidade">
</div>

<br>

> **Nota:** Projeto acadêmico desenvolvido para a disciplina de *Prática Profissional em Análise e Desenvolvimento de Sistemas* da Universidade Presbiteriana Mackenzie.

---

## 🌍 Acesso à Aplicação

A aplicação encontra-se implantada em produção na nuvem e disponível para testes:

🔗 **[Acessar Rotas Compartilhadas na Vercel](https://pratprofsnalisasesensistemas-git-main-vinicius-buzatos-projects.vercel.app)**

*(Disponível ininterruptamente durante todo o período de avaliação).*

---

## 📖 Sobre o Projeto

O **App de Rotas Compartilhadas** é uma solução pensada para otimizar a logística de grupos que precisam se deslocar para um destino comum a partir de origens diferentes. O sistema calcula as rotas individuais, identifica o melhor ponto de encontro e traça o trajeto final unificado.

**🚗 Exemplo de Aplicação:** 
Imagine um grupo de amigos que vai viajar para um show. Eles partem de diferentes bairros em São Paulo e precisam se encontrar antes de pegar a estrada juntos rumo ao Rio de Janeiro. O aplicativo analisa a localização de cada um, sugere o melhor terminal ou ponto de referência para o encontro e roteiriza a viagem unificada até o evento, economizando tempo e recursos.

---

## ✨ Funcionalidades Implementadas

- **👤 Gestão de Usuários:** Autenticação e identificação gravadas no banco de dados relacional.
- **📅 Criação de Grupos de Viagem (UC01):** Organizadores podem definir um destino, data e horário limite de chegada no Dashboard, gerando códigos de convite únicos.
- **🔗 Entrada de Participantes e Partida (UC02):** Associação de passageiros a viagens específicas utilizando o código único via Lobby e definição do endereço de origem.
- **💾 Persistência em Tempo Real:** Dados de usuários, viagens e vínculos relacionais (`viagem_participantes`) persistidos em nuvem.

---

## 🛠️ Tecnologias e Ferramentas

O projeto utiliza a seguinte arquitetura de software:

- **Frontend:** ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=flat&logo=javascript&logoColor=F7DF1E)
- **Backend & Banco de Dados:** ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
- **Ambiente & Versionamento:** ![VS Code](https://img.shields.io/badge/VS%20Code-0078D4?style=flat&logo=visual%20studio%20code&logoColor=white) ![Git](https://img.shields.io/badge/GIT-E44C30?style=flat&logo=git&logoColor=white)
- **Deploy e Hospedagem:** ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

---

## 💻 Guia de Execução para Desenvolvedores

Para configurar e executar a aplicação localmente em seu computador pessoal, siga os passos abaixo:

### 📋 Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Edge).
- Editor de código **VS Code** (ou similar).
- Extensão **Live Server** (recomendada para simular um servidor local).

### 🚀 Passo a Passo para Execução Local

1. **Clone o repositório:**
```bash
   git clone [https://github.com/Vinicius-Buzato/Prat_Prof_AnalisaDeSen_Sistemas.git](https://github.com/Vinicius-Buzato/Prat_Prof_AnalisaDeSen_Sistemas.git)
```

2. Acesse a pasta do projeto:
```bash
cd Prat_Prof_AnalisaDeSen_Sistemas
```

3. Abra o projeto no VS Code:
```bash
code .
```

4. Configuração do Backend (Supabase):
- O frontend se comunica diretamente com a instância do Supabase via API REST.
- Certifique-se de que o arquivo de configuração JavaScript (app.js ou equivalente) contém as credenciais válidas (SUPABASE_URL e chave pública anon key) configuradas nas constantes de conexão.

5. Executando a aplicação:
- Como a aplicação utiliza HTML/CSS/JavaScript nativos, você pode abrir o arquivo index.html diretamente no navegador ou clicar com o botão direito sobre ele no VS Code e selecionar "Open with Live Server" (http://localhost:5500).

6. Após colar e salvar essa alteração no arquivo `README.md`, envie as alterações para o GitHub via terminal:
```bash
git add README.md
git commit -m "docs: atualiza instrucoes detalhadas para desenvolvedores no README"
git push origin main
```

## 🔑 Dados de Teste e Roteiro de Validação

Para validar os fluxos dos casos de uso (UC01 e UC02) sem precisar configurar novos cadastros do zero, utilize os dados abaixo:

### 1. Identificação (Usuário de Teste)
* **Nome de Teste:** `Usuário Avaliador`
* **E-mail de Teste:** `avaliador@mackenzie.br`

### 2. Massa de Dados Ativa (Para Teste do Lobby - UC02)
- **Código de Convite Ativo:** `61HXYX`
- **Destino Cadastrado:** `Allianz Parque, São Paulo`
- **Horário Limite de Chegada:** `19:30`

### 🧭 Roteiro Rápido
1. Acesse a **[URL da Aplicação na Vercel](https://pratprofsnalisasesensistemas-git-main-vinicius-buzatos-projects.vercel.app)**.
2. Realize a identificação utilizando o **Usuário de Teste** (ou cadastre um novo nome/e-mail).
3. **Para testar o UC01:** No Dashboard, informe um destino, data e horário limite para criar uma viagem e gerar um novo código de convite.
4. **Para testar o UC02:** Na área do Lobby, insira o **Código de Convite** ativo, preencha um endereço de origem e confirme a entrada no grupo.

---

## 📂 Estrutura de Documentação e Artefatos

Todos os artefatos de engenharia de software elaborados durante o ciclo do projeto estão consolidados:

- [x] Documento de Visão e Requisitos (Fase de Concepção)
- [x] Diagrama de Casos de Uso (UC01 e UC02)
- [x] Diagrama de Implantação UML (Vercel + Supabase)
- [x] Guia do Usuário e Guia de Execução Local
- [x] Evidências de Persistência e Consultas SQL (Supabase)
- [x] Plano e Execução de Testes (100% de Cobertura de Execução e Requisitos)
- [ ] Integração com API de Roteirização / Mapas *(Evoluções Futuras)*

---

## 👥 Equipe de Desenvolvimento

| Nome | Curso | Função Principal |
| :--- | :--- | :--- |
| **Vinicius Ferreira Buzato** | Análise e Desenvolvimento de Sistemas | Desenvolvedor Full-Stack / Analista |

