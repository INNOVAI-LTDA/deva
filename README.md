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
/deva-diagnosis/api/send-diagnosis
```

Essa rota está em:

```txt
api/send-diagnosis.js
```

Ela usa Resend para enviar e-mail.

## Publicação em subrota no Vercel

Esta versão está preparada para responder em:

```txt
https://innovai-solutions.com.br/deva-diagnosis
```

O projeto agora usa um `basePath` em runtime e rewrites no Vercel para servir:

- HTML em `/deva-diagnosis`
- arquivos estáticos em `/deva-diagnosis/src/...`
- função serverless em `/deva-diagnosis/api/send-diagnosis`

### Passos no Vercel

1. Importe este repositório como um projeto.
2. Configure as variáveis `RESEND_API_KEY`, `DIAGNOSIS_TO_EMAIL` e `DIAGNOSIS_FROM_EMAIL`.
3. Adicione o domínio `innovai-solutions.com.br` ao projeto apenas se este projeto for o responsável pelo domínio inteiro.
4. Acesse `https://innovai-solutions.com.br/deva-diagnosis`.

### Observação importante sobre domínio

O Vercel vincula domínios por projeto, não por pasta. Então há dois cenários:

- Se `innovai-solutions.com.br` vai apontar para este projeto, a URL `/deva-diagnosis` funcionará com a configuração atual.
- Se o domínio raiz já serve outro site/projeto, então esse site principal precisa encaminhar a rota `/deva-diagnosis` para este frontend. Isso não é resolvido só dentro deste repositório.

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
