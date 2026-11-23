# Abihacart AI Customer Support Chatbot

Production-ready AI customer-support chatbot system for [Abihacart](https://abihacart.myshopify.com/) (UAE).

## Architecture Overview

- **Backend:** Node.js, Express.js, MongoDB (Mongoose), Winston logger, Helmet, CORS, Rate Limiting.
- **AI Engine:** OpenAI API with Tool/Function Calling.
- **Shopify Integration:** GraphQL Admin API (2025-01 / 2024-10) with verified webhook HMAC authentication.
- **Storefront Integration:** Shopify Online Store 2.0 Theme App Extension (App Embed Block) using vanilla HTML/CSS/JS.
- **Human Escalation:** Meta WhatsApp Business Cloud API.
- **Admin Dashboard:** Secure administrative console for conversation tracking, ticket escalations, and verified knowledge base management.

## Project Structure

```text
├── backend/            # Express.js REST API & webhook ingress
├── storefront-widget/  # Vanilla JS & CSS chat widget component
├── shopify-app/        # Shopify App & Theme App Extensions (App Embed)
├── admin-dashboard/    # Administrative cockpit & ticket manager
└── docs/               # Technical documentation & guides
```

## Security & Privacy Guidelines

- Never commit `.env` or sensitive credentials to Git.
- Client secrets, access tokens, and API keys are strictly server-side.
- Zero customer PII or address disclosure without 2-factor order verification.
- English-only support for UAE ecommerce market.
