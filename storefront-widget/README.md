# Abihacart Storefront Chat Widget

Customer-facing, responsive chat widget engineered in Vanilla HTML5, CSS3, and JavaScript.

## Architecture

- Zero dependencies (no React, Next.js, or external UI frameworks).
- Designed to be embedded via Shopify Online Store 2.0 Theme App Extension (`blocks/chat_embed.liquid`).
- Communicates directly with the backend REST endpoints over HTTPS.

## Directory Structure

```text
storefront-widget/
├── css/
│   └── widget.css    # Premium ecommerce styling, animations, responsiveness
├── js/
│   └── widget.js     # State machine, chat UI, suggestion chips, product cards
└── README.md
```
