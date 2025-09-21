# Backend Cidadeclipse - TARTARU'S CAFETERIA 📚

## Este backend, batizado de **backend-cd**, serve como o núcleo de gestão dos serviços da Cidadeclipse, incluindo autenticação, controle de usuários, operações de carrinho de compras e entrega de livros gratuitos.
[Conheça o Frontend do projeto!](https://github.com/lllleao/frontend-cd)

### [Cidade Eclipse](https://www.cidadeclipse.com)
---

## 🧰 Tecnologias e Dependências

- **NestJS** (v11) – framework modular e escalável para Node.js, com suporte a injeção de dependência, interceptors e teste integrado.
- **Prisma ORM** (v6) + **MySQL** – solução moderna e tipada para controle de acesso ao banco de dados.
- **JWT** (`jsonwebtoken`) + **CSRF** (`csrf`) – autenticação segura através de tokens e proteção a ataques CSRF.

Outras bibliotecas importantes:

- **bcrypt** – hash de senhas para garantir segurança dos dados do usuário.
- **cookie-parser**, **helmet** – middlewares para segurança e parsing de cookies.
- **class-validator** & **class-transformer** – validação automática de DTOs, promovendo dados consistentes e limpos.
- **Nodemailer**: para recursos de notificação por e-mail.
- **Nest-Throttle + Helmet**: hardening de segurança com rate limiting e proteção de cabeçalhos HTTP.
- **Oracle Cloud + Docker + Nginx**: O backend está em contêiner Docker, implantado na Oracle Cloud, com o Nginx configurado como proxy reverso para gerenciar requisições HTTPS e terminação TLS

---

## ✅ Funcionalidade em produção

- Endpoints públicos que entregam livros gratuitos disponíveis no site.
- Cadastro e login de usuários.
- Autenticação com JWT e proteção CSRF.
- Hash de senhas com sal via `bcrypt`.
- CRUD em carrinho de compras – adicionar, remover itens e listar conteúdo.
- Finalização de pedido via pagamento **PIX**.
- Segurança reforçada por `helmet`, `cookie-parser` e `nest-throttle`.
- Validação e transformação de dados com `class-validator` e `class-transformer`.
- Suporte para envio de e-mails com `nodemailer`.

