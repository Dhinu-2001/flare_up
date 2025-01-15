#!/bin/sh

# Inject environment variables into runtime config
cat <<EOF > /app/dist/config.js
window.RUNTIME_CONFIG = {
  VITE_map_key: "${VITE_map_key}",
  VITE_cloudinary_name: "${VITE_cloudinary_name}",
  VITE_cloudinary_upload_preset: "${VITE_cloudinary_upload_preset}",
  VITE_stripe: "${VITE_stripe}",
  VITE_googleOauthClientId: "${VITE_googleOauthClientId}",
  VITE_gateway_svc: "${VITE_gateway_svc}",
  VITE_notification_svc: "${VITE_notification_svc}",
};
EOF

# Start serve
exec serve -s dist -l 3000