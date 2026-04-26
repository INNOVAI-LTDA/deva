# DEVA Diagnóstico Frontend — versão Vercel

Frontend focado exclusivamente no Diagnóstico DEVA, preparado para publicação via GitHub + Vercel.

## O que esta versão faz

- Removeu menus que não fazem parte do diagnóstico.
- Removeu topbar de perfil/sair.
- Mantém apenas o fluxo:
  1. Contexto econômico
  2. Perguntas por eixo
  3. Resultado DEVA
  4. Envio do resultado
- Na tela final há apenas um botão principal:
  - **Enviar resultados**
- O botão só habilita após preencher:
  - Nome
  - E-mail válido
  - WhatsApp

## Correção do Índice DEVA

A relação agora é explícita:

```js
distanciaRadialPercentual = distanciaRadialNormalizada * 100
indiceDEVA = 100 - distanciaRadialPercentual
```

Ou seja:

- distância radial baixa → índice DEVA alto
- distância radial alta → índice DEVA baixo
- distância radial 0 → índice DEVA 100%
- ponto real em vértice → índice DEVA 0%

## Envio automático

O botão **Enviar resultados** monta o JSON completo por trás e envia para:

```txt
/api/send-diagnosis
```

Essa rota está em:

```txt
api/send-diagnosis.js
```

Ela usa Resend para enviar e-mail.

## Variáveis de ambiente no Vercel

Cadastre no painel do Vercel:

```txt
RESEND_API_KEY
DIAGNOSIS_TO_EMAIL
DIAGNOSIS_FROM_EMAIL
```

Exemplo:

```txt
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
DIAGNOSIS_TO_EMAIL=seu-email@seudominio.com
DIAGNOSIS_FROM_EMAIL=Diagnóstico DEVA <diagnostico@seudominio.com>
```

Também existe um arquivo:

```txt
.env.example
```

## Como rodar localmente

```bash
python -m http.server 8080
```

A parte visual roda localmente.

Para testar a API serverless localmente, use:

```bash
vercel dev
```

## Estrutura

```txt
api/
  send-diagnosis.js
src/
  assets/
  config/
  core/
  data/
  styles/
  views/
index.html
vercel.json
package.json
README.md
.env.example
```

## Observação

O navegador não consegue enviar e-mail direto de forma segura sem uma API.
Por isso, o envio real fica na rota serverless `/api/send-diagnosis`.
