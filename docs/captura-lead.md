# Captura de lead no Diagnóstico DEVA

## Fluxo ideal com QR Code

1. Pessoa escaneia o QR Code
2. Abre o link público do Diagnóstico DEVA
3. Preenche contexto econômico
4. Responde perguntas por eixo
5. Visualiza resultado
6. Informa nome/e-mail/WhatsApp
7. Envia diagnóstico

## Modos de envio

### Modo sem backend

Usa:

- mailto
- wa.me
- download JSON
- copiar JSON

### Modo com backend/webhook

Configure `endpointUrl` em:

```txt
src/config/capture.config.js
```

O frontend enviará um POST com:

```json
{
  "generatedAt": "...",
  "economicInputs": {},
  "economicMetrics": {},
  "devaAnswers": {},
  "devaMetrics": {},
  "interpretation": {},
  "lead": {
    "name": "",
    "email": "",
    "whatsapp": ""
  }
}
```

## Recomendação prática

Para uso público, o caminho mais rápido é usar um webhook do Make/Zapier/Apps Script que:

1. recebe o JSON
2. salva em planilha/CRM
3. envia notificação por e-mail
4. dispara mensagem para o responsável comercial
