# Letramento Digital na Terceira Idade
Aplicação web progressiva para promoção da autonomia digital de idosos.

[Acesse o site!](https://lucasarrudab.github.io/alfabetizacao_digital/index.html)

## Sumário
- [1. Sobre o Projeto](#1-sobre-o-projeto)
- [2. Justificativa e Impacto](#2-justificativa-e-impacto)
- [3. Metodologia: Alfabetização Computacional Assistida (ACA)](#3-metodologia-alfabetização-computacional-assistida-aca)
- [4. Tecnologias e Acessibilidade](#4-tecnologias-e-acessibilidade)
  - [4.1 Estratégias de design aplicadas](#41-estratégias-de-design-aplicadas)
- [5. Equipe (Discentes)](#5-equipe-discentes)

## 1. Sobre o Projeto
Este projeto foi desenvolvido como parte da componente curricular T318 - Projeto Tecnologia Intercursos no Centro de Ciências Tecnológicas da UNIFOR (2026).

O objetivo é enfrentar a exclusão digital de idosos no Brasil através de uma aplicação web interativa que simula ambientes digitais do cotidiano (WhatsApp, YouTube, câmera, etc.), permitindo a experimentação tecnológica sem o medo de "quebrar" o dispositivo ou cometer erros irreversíveis.

O projeto foi originalmente desenvolvido em HTML, CSS e JavaScript puros e posteriormente migrado para uma arquitetura baseada em componentes React com TypeScript, ganhando navegação client-side, sistema de acessibilidade global e leitura de tela integrada.

## 2. Justificativa e Impacto
O envelhecimento populacional no Brasil é uma realidade, com mais de 30 milhões de pessoas acima de 60 anos. Apesar do aumento do acesso à internet, a barreira da proficiência ainda gera isolamento social.

Nosso projeto foca no Letramento Digital, que vai além de apenas operar aparelhos; trata-se de garantir que o idoso compreenda o "vocabulário visual" (ícones, fluxos e símbolos) necessário para exercer sua cidadania em serviços essenciais como bancos e transporte.

## 3. Metodologia: Alfabetização Computacional Assistida (ACA)
Diferente do ensino tradicional, utilizamos a abordagem ACA, que utiliza o suporte tecnológico para adaptar o conteúdo ao ritmo do usuário.

- **Ambiente Seguro (Sandbox):** Por ser apenas um ambiente simulado, há a redução da ansiedade e o medo de erros, permitindo a repetição do gesto motor até a consolidação da memória.
- **Leitura de Tela Integrada:** Todos os módulos possuem botão de áudio com síntese de voz em português (Web Speech API), permitindo que usuários com baixa literacia ou dificuldade visual acompanhem o conteúdo.
- **Modo de Acessibilidade:** Toggle global que aumenta fontes, reforça contrastes e amplia áreas de toque, seguindo as diretrizes WCAG 2.1.

## 4. Tecnologias e Acessibilidade
O desenvolvimento prioriza a Acessibilidade Web (W3C/WCAG 2.1) e o Design Centrado no Usuário (UCD):

| Tecnologia | Motivação | Descrição de uso |
|---|---|---|
| React 19 + TypeScript | Componentização e tipagem | Interface construída em componentes reutilizáveis com tipagem estática, reduzindo erros e facilitando manutenção |
| Vite | Build e desenvolvimento | Servidor de desenvolvimento rápido e bundling otimizado para produção |
| Tailwind CSS v4 | Estilização e contraste | Sistema de design utility-first com tokens de cor para alto contraste e fontes amplas |
| TanStack Router | Navegação client-side | Roteamento type-safe com carregamento instantâneo entre módulos |
| Radix UI + shadcn/ui | Acessibilidade de componentes | Primitivos de UI com suporte nativo a ARIA, navegação por teclado e leitores de tela |
| Lucide React | Ícones semânticos | Ícones consistentes com `aria-label` e tamanhos adaptados ao modo de acessibilidade |
| Web Speech API | Leitura de tela | Síntese de voz em pt-BR integrada em todos os módulos, sem dependência de biblioteca externa |

### 4.1 Estratégias de design aplicadas

- **Redução de Carga Cognitiva:** Telas limpas, evitando a "poluição visual"; cada módulo apresenta uma tarefa por vez.
- **Affordance Visual:** Botões com pistas claras de interatividade, bordas destacadas e ícones descritivos.
- **Analogias com o Mundo Físico:** Cada aplicativo é apresentado comparado a um objeto já conhecido (ex.: YouTube → televisão; WhatsApp → cartas e SMS).
- **Minimização do Erro:** Prevenção de falhas, confirmações explícitas e saídas fáceis da navegação em todos os fluxos.

## 5. Equipe (Discentes)
- Renê Medeiros Montenegro
- Mariana Lousada Gonçalves
- Leonardo José Lima Martins
- Sara Pessoa Silva
- João Lucas Arruda Braga Girão Silveira

Supervisão: Prof.ª Laldiane Pinheiro
