# Captura de lead no Diagnóstico DEVA

## Fluxo ideal com QR Code

1. Pessoa escaneia o QR Code
2. Abre o link público do Diagnóstico DEVA
3. Preenche contexto econômico
4. Responde perguntas por eixo
5. Visualiza resultado
6. Informa nome/e-mail/WhatsApp
7. Envia diagnóstico

## Implementação atual

Na versão atual publicada neste repositório, a tela final não exibe botões de:

- `mailto`
- `wa.me`
- download JSON
- copiar JSON

O frontend gera o JSON internamente e envia um `POST` para:

```txt
/api/send-diagnosis
```

Essa rota serverless recebe o payload e dispara o envio por e-mail.

## Payload enviado

O frontend envia um POST com:

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

## Observação

Ainda existem referências antigas a `mailto`, `wa.me` e ações de JSON em documentação e estilos legados, mas esses controles não fazem parte da UI atual renderizada pela tela de resultado.
