# Commit message rules

Sempre gerar mensagens de commit seguindo o padrão Conventional Commits.

Formato obrigatório:

<tipo>(<escopo>): <descrição curta>

Regras:
- usar português
- descrição curta e objetiva
- verbo no infinitivo
- tudo em minúsculo
- sem ponto final
- máximo 72 caracteres
- escopo obrigatório quando possível

Tipos permitidos:
- feat
- fix
- refactor
- chore
- docs
- style
- test
- perf

Exemplos válidos:
- feat(auth): adicionar login com jwt
- fix(api): corrigir validação do token
- refactor(user): separar service de repository