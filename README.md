# Backend Cidadeclipse - TARTARU'S CAFETERIA 📚

Este backend, batizado de **backend-cd**, serve como o núcleo de gestão dos serviços da Cidadeclipse, incluindo autenticação, controle de usuários, operações de carrinho de compras e entrega de livros gratuitos.

---

## 🧰 Tecnologias e Dependências

- **NestJS** (v11) – framework modular e escalável para Node.js, com suporte a injeção de dependência, interceptors e teste integrado.
- **Prisma ORM** (v6) + **MySQL** – solução moderna e tipada para controle de acesso ao banco de dados.
- **JWT** (`jsonwebtoken`) + **CSRF** (`csrf`) – autenticação segura através de tokens e proteção a ataques CSRF.

Outras bibliotecas importantes:

- **bcrypt** – hash de senhas para garantir segurança dos dados do usuário.
- **cookie-parser**, **helmet**, **express-rate-limit** – middlewares para segurança, parsing de cookies e controle de requisições.
- **class-validator** & **class-transformer** – validação automática de DTOs, promovendo dados consistentes e limpos.
- **nodemailer** – preparado para notificações via e-mail e envio de mensagens posteriores.
- **rxjs** – integrado com NestJS para programação reativa quando necessário.

---

## 🚧 Funcionalidades (em desenvolvimento)

Todas as seguintes funcionalidades estão sendo desenvolvidas e ainda não estão disponíveis em produção:

- Cadastro e login de usuários.
- Autenticação com JWT e proteção CSRF.
- Hash de senhas com sal via `bcrypt`.
- CRUD em carrinho de compras – adicionar, remover itens e listar conteúdo.
- Finalização de pedido via pagamento **PIX**.
- Segurança reforçada por `helmet`, `cookie-parser` e `express-rate-limit`.
- Validação e transformação de dados com `class-validator` e `class-transformer`.
- Suporte futuro para envio de e-mails com `nodemailer`.

---

## ✅ Funcionalidade em produção

- Endpoints públicos que entregam livros gratuitos disponíveis no site.

---

## ⚙️ Banco de Dados

Utiliza **MySQL** gerenciado por **Prisma**, com esquema organizado em tabelas para usuários, tokens, carrinho, pedidos, itens de pedidos, e livros disponíveis.

---
