# 🔐 Chaveiro Pro — SaaS de Gestão para Chaveiros

Sistema **SaaS multi-cliente** de gestão de estoque e vendas, feito sob medida para chaveiros e serralherias. Substitui cadernos e planilhas por um painel único, com controle de produtos, vendas, movimentação de estoque, login seguro e **cobrança recorrente por assinatura**.

> Desenvolvido por um chaveiro, para chaveiros — resolvendo uma dor real do dia a dia do negócio.

🔗 **Demo ao vivo:** https://chaveiro-saas.vercel.app

<!-- 📸 DICA: coloque aqui um print do painel. Salve a imagem em /public e troque a linha abaixo:
![Painel do Chaveiro Pro](public/screenshot-dashboard.png)
-->

---

## ✨ Funcionalidades

- 🔑 **Autenticação segura** com login social (Google e GitHub) via NextAuth/Auth.js
- 🏢 **Multi-cliente (multi-tenant):** cada usuário enxerga somente os próprios dados
- 💳 **Assinatura com Stripe:** teste grátis + cobrança mensal automática no cartão
- 📦 **Gestão de produtos:** cadastro com cálculo de custo, preço e margem
- 🛒 **Vendas:** carrinho com baixa automática de estoque
- 📊 **Movimentação de estoque:** entradas, saídas e ajustes com histórico
- 🛡️ **Rate limiting** com Upstash Redis e **recuperação de senha** por e-mail
- 📈 **Relatórios** de vendas e produtos

## 🛠️ Tecnologias

| Camada | Tecnologias |
|--------|-------------|
| Front-end | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Back-end | Next.js API Routes, Prisma ORM |
| Banco de dados | PostgreSQL (Supabase) |
| Autenticação | NextAuth / Auth.js (Google, GitHub) |
| Pagamentos | Stripe (assinaturas) |
| Segurança | bcrypt, Upstash Redis (rate limit), Nodemailer |
| Deploy | Vercel |

## 🚀 Como rodar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/jcavalcante88/chaveiro-saas.git
cd chaveiro-saas

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente (.env)
#    O passo a passo completo está em INSTALACAO.md

# 4. Prepare o banco de dados
npx prisma generate
npx prisma db push

# 5. Rode o projeto
npm run dev
```

> 📋 O guia detalhado de configuração (Supabase, Google/GitHub OAuth e Stripe) está em **[INSTALACAO.md](INSTALACAO.md)**.

## 🧠 O que este projeto demonstra

Aplicação SaaS **completa e em produção**: autenticação social, arquitetura multi-cliente, cobrança recorrente com Stripe, controle de acesso, rate limiting e modelagem de dados relacional com Prisma — o ciclo completo de um produto real, do banco de dados ao pagamento.

---

## 👤 Autor

**Jerry Cavalcante Camargo Das Dores** — Desenvolvedor Full-Stack

- 🐙 GitHub: [@jcavalcante88](https://github.com/jcavalcante88)
- 💼 LinkedIn: [jerry-camargo](https://www.linkedin.com/in/jerry-camargo)
- 🌐 Portfólio: [portf-lio-xi-ruddy.vercel.app](https://portf-lio-xi-ruddy.vercel.app)
