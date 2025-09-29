# Guia de Contribuição

Este documento define as boas práticas para contribuir com este projeto, garantindo clareza e consistência no histórico de commits.

---

## 📌 Padrão de mensagens de commit

Utilizamos a convenção [Conventional Commits](https://www.conventionalcommits.org/).
Cada commit deve seguir o formato:

```
<tipo>(escopo opcional): descrição curta

[descrição detalhada opcional]
[referência a issues/tickets]
```

### Tipos aceitos

* **feat:** inclusão de uma nova funcionalidade
* **fix:** correção de bug
* **docs:** alterações apenas em documentação
* **style:** ajustes de formatação/estilo (sem alterar lógica)
* **refactor:** refatoração de código sem mudança de comportamento
* **test:** adição ou modificação de testes
* **chore:** tarefas de manutenção (dependências, configs, build, etc)

### Exemplos

```
feat(auth): adiciona autenticação JWT

Implementa login com geração de token JWT e middleware de validação
para rotas privadas. Atualiza documentação no Swagger.

closes #42
```

```
fix(user-service): corrige erro ao excluir usuário sem roles
```

```
docs(readme): adiciona instruções de configuração local
```

---

## 📌 Boas práticas

* **Escreva no imperativo** → “adiciona”, “corrige”, “remove”.
* **Limite a linha de título a 50 caracteres.**
* **Commits pequenos e focados** → uma mudança por commit.
* **Inclua descrição detalhada quando necessário.**
* **Relacione issues/tickets** → `closes #123`, `refs #456`.

---

## 📌 Fluxo de branches

* **main** → código estável em produção.
* **develop** → integração de novas features.
* **feature/nome-da-feature** → novas funcionalidades.
* **fix/nome-do-fix** → correções.
* **hotfix/nome-do-hotfix** → correções urgentes em produção.

---

Seguindo este padrão, conseguimos manter um histórico limpo, fácil de entender e pronto para automatizações (changelog, versionamento semântico, CI/CD).


