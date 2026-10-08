# 🗺️ App de Otimização de Rotas Compartilhadas

<div align="center">
  <img src="https://img.shields.io/badge/Fase-Constru%C3%A7%C3%A3o%20(1%C2%AA%20Itera%C3%A7%C3%A3o)-success?style=for-the-badge" alt="Status do Projeto">
  <img src="https://img.shields.io/badge/Disciplina-Pr%C3%A1tica%20Profissional%20ADS-blue?style=for-the-badge" alt="Disciplina">
  <img src="https://img.shields.io/badge/Universidade-Mackenzie-cc0000?style=for-the-badge" alt="Universidade">
</div>

<br>

> **Nota:** Projeto acadêmico desenvolvido para a disciplina de *Prática Profissional em Análise e Desenvolvimento de Sistemas* da Universidade Presbiteriana Mackenzie.

---

## 🌍 Acesso à Aplicação

A versão da 1ª iteração já está em produção e pode ser acessada diretamente pelo navegador:

🔗 **[Acessar Rotas Compartilhadas na Vercel](https://pratprofsnalisasesensistemas-git-main-vinicius-buzatos-projects.vercel.app)**

*(Utilize o **Guia do Usuário** presente na documentação para instruções de uso).*

---

## 📖 Sobre o Projeto

O **App de Rotas Compartilhadas** é uma solução pensada para otimizar a logística de grupos que precisam se deslocar para um destino comum a partir de origens diferentes. O sistema calcula as rotas individuais, identifica o melhor ponto de encontro e traça o trajeto final unificado.

**🚗 Exemplo de Aplicação:** 
Imagine um grupo de amigos que vai viajar para um show. Eles partem de diferentes bairros em São Paulo e precisam se encontrar antes de pegar a estrada juntos rumo ao Rio de Janeiro. O aplicativo analisa a localização de cada um, sugere o melhor terminal ou ponto de referência para o encontro e roteiriza a viagem unificada até o evento, economizando tempo e recursos.

---

## ✨ Funcionalidades (1ª Iteração)

- **👤 Gestão de Usuários:** Autenticação e identificação (Mock/Simulada nesta etapa) gravadas no banco de dados.
- **📅 Criação de Grupos de Viagem:** Organizadores podem definir um destino, criar viagens ativas no Dashboard e gerar códigos de convite.
- **🔗 Entrada de Participantes:** Associação de usuários a viagens específicas utilizando um código único via Lobby.
- **📍 Definição de Partida:** Passageiros informam sua origem exata ao entrar no grupo.
- **💾 Persistência em Tempo Real:** Dados de usuários, viagens e vínculos relacionais persistidos em nuvem.

---

## 🛠️ Tecnologias e Ferramentas

O projeto utiliza a seguinte arquitetura de software:

* **Frontend:** ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=flat&logo=javascript&logoColor=F7DF1E)
* **Backend & Banco de Dados:** ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
* **Ambiente & Versionamento:** ![VS Code](https://img.shields.io/badge/VS%20Code-0078D4?style=flat&logo=visual%20studio%20code&logoColor=white) ![Git](https://img.shields.io/badge/GIT-E44C30?style=flat&logo=git&logoColor=white)
* **Deploy e Hospedagem:** ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

---

## 🚀 Como Executar o Projeto Localmente

Para rodar a aplicação no seu ambiente de desenvolvimento:

```bash
# Clone este repositório (Tag v0.1 - Entrega Aula 3)
$ git clone [https://github.com/Vinicius-Buzato/Prat_Prof_AnalisaDeSen_Sistemas.git](https://github.com/Vinicius-Buzato/Prat_Prof_AnalisaDeSen_Sistemas.git)

# Acesse a pasta do projeto
$ cd Prat_Prof_AnalisaDeSen_Sistemas

# Abra no VS Code ou editor de preferência
$ code .

Como a aplicação utiliza HTML/JS nativo e a API REST do Supabase, basta abrir o arquivo `index.html` no navegador ou utilizar uma extensão como o *Live Server* do VS Code.
```

## 📂 Estrutura de Documentação

Todos os artefatos de engenharia de software elaborados durante o processo unificado estão disponíveis na pasta de documentação do repositório:

- [x] Documento de Visão e Requisitos (Fase de Concepção)
- [x] Diagrama de Casos de Uso
- [x] Guia do Usuário da Aplicação
- [x] Diagrama de Implantação UML
- [x] Evidências de Persistência e Consultas SQL (Supabase)
- [ ] Especificação da Integração com API de Mapas *(Próximas Iterações)*

## 👥 Equipe de Desenvolvimento

| Nome | Curso | Função Principal |
| :--- | :--- | :--- |
| **Vinicius Ferreira Buzato** | Análise e Desenvolvimento de Sistemas | Desenvolvedor Full-Stack / Analista |
