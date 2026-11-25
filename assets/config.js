/**
 * Abihacart AI Support & Order Concierge — Centralized Frontend Configuration
 * Manages environment-aware backend API endpoint resolution between Vercel and Render.
 */
(function (window) {
  'use strict';

  // 1. Detect if running in local development environment
  const isLocalhost = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
     window.location.hostname === '127.0.0.1' ||
     window.location.hostname === '0.0.0.0' ||
     window.location.hostname === '');

  // 2. Production Render Backend URL (Supplied by project owner)
  const PRODUCTION_BACKEND_URL = 'https://abihacart-chatbot-backend.onrender.com';

  // 3. Localhost Development Backend URL (Render default port 10000 or local dev)
  const LOCAL_BACKEND_URL = 'http://localhost:10000';

  // 4. Resolve active backend URL with priority:
  //    a. Explicit window.ABIHACART_CONFIG.backendUrl (preserves Shopify Theme Extension merchant settings)
  //    b. Explicit window.ABIHACART_BACKEND_URL (runtime global override)
  //    c. localStorage override ('abh_backend_url' for developer/tester toggle)
  //    d. Localhost detection (preserves local development)
  //    e. Production Render backend URL
  const existingConfig = window.ABIHACART_CONFIG || {};

  let resolvedBackendUrl = '';
  if (existingConfig.backendUrl && String(existingConfig.backendUrl).trim()) {
    resolvedBackendUrl = String(existingConfig.backendUrl).trim();
  } else if (window.ABIHACART_BACKEND_URL && String(window.ABIHACART_BACKEND_URL).trim()) {
    resolvedBackendUrl = String(window.ABIHACART_BACKEND_URL).trim();
  } else if (typeof localStorage !== 'undefined' && localStorage.getItem('abh_backend_url')) {
    resolvedBackendUrl = String(localStorage.getItem('abh_backend_url')).trim();
  } else if (isLocalhost) {
    resolvedBackendUrl = LOCAL_BACKEND_URL;
  } else {
    resolvedBackendUrl = PRODUCTION_BACKEND_URL;
  }

  // Normalize by stripping trailing slashes
  const cleanBackendUrl = resolvedBackendUrl.replace(/\/+$/, '');

  // Set the centralized configuration object
  window.ABIHACART_CONFIG = Object.assign({}, existingConfig, {
    backendUrl: cleanBackendUrl,
    shop: existingConfig.shop || 'abihacart.myshopify.com',
    isLocalhost: isLocalhost,
  });

  // Convenience helper function
  window.getAbihacartBackendUrl = function () {
    return (window.ABIHACART_CONFIG && window.ABIHACART_CONFIG.backendUrl) || cleanBackendUrl;
  };

})(typeof window !== 'undefined' ? window : this);
