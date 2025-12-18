# Deploy Neil’s GitHub repo to Netlify

## 1. Conectar Repo
En Netlify: `Add new site` -> `Import from Git` -> Elige el repo.

## 2. Variables de Entorno (CRÍTICO)
Configura estas variables en Netlify (Site Settings -> Environment variables):
- `GEMINI_API_KEY`: Tu llave de Google AI Studio.
- `STRIPE_SECRET_KEY`: Tu llave secreta de Stripe (empieza con sk_).
- `STRIPE_WEBHOOK_SECRET`: Se obtiene al configurar el webhook en Stripe Dashboard.

## 3. Endpoints de la API
Tus funciones están listas en:
- `/.netlify/functions/create-checkout-session`
- `/.netlify/functions/stripe-webhook`
- `/.netlify/functions/generate`

## 4. Webhook de Stripe
Configura en Stripe que envíe el evento `checkout.session.completed` a:
`https://tu-dominio.netlify.app/.netlify/functions/stripe-webhook`

## 5. Pruebas Rápidas
Usa `curl` o Postman para probar el checkout:
```bash
curl -X POST https://tu-dominio.netlify.app/api/create-checkout-session -d '{"currency":"usd"}'
```
