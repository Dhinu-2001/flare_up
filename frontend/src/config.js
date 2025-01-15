export const getConfig = () => {
    if (window.RUNTIME_CONFIG) {
      return {
        VITE_map_key: window.RUNTIME_CONFIG.VITE_map_key || import.meta.env.VITE_map_key,
        VITE_cloudinary_name: window.RUNTIME_CONFIG.VITE_cloudinary_name || import.meta.env.VITE_cloudinary_name,
        VITE_cloudinary_upload_preset: window.RUNTIME_CONFIG.VITE_cloudinary_upload_preset || import.meta.env.VITE_cloudinary_upload_preset,
        VITE_stripe: window.RUNTIME_CONFIG.VITE_stripe || import.meta.env.VITE_stripe,
        VITE_googleOauthClientId: window.RUNTIME_CONFIG.VITE_googleOauthClientId || import.meta.env.VITE_googleOauthClientId,
        VITE_gateway_svc: window.RUNTIME_CONFIG.VITE_gateway_svc || import.meta.env.VITE_gateway_svc,
        VITE_notification_svc: window.RUNTIME_CONFIG.VITE_notification_svc || import.meta.env.VITE_notification_svc,
      };
    }
    
    return {
        VITE_map_key: import.meta.env.VITE_map_key,
        VITE_cloudinary_name: import.meta.env.VITE_cloudinary_name,
        VITE_cloudinary_upload_preset: import.meta.env.VITE_cloudinary_upload_preset,
        VITE_stripe: import.meta.env.VITE_stripe,
        VITE_googleOauthClientId: import.meta.env.VITE_googleOauthClientId,
        VITE_gateway_svc: import.meta.env.VITE_gateway_svc,
        VITE_notification_svc: import.meta.env.VITE_notification_svc,
    };
  };
  