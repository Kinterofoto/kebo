/**
 * External URLs configuration
 * 
 * Centralized configuration for all external URLs used in the app.
 * This makes it easier to update URLs and ensures consistency.
 */

export const EXTERNAL_URLS = {
  // Legal
  TERMS_CONDITIONS: "https://kebo.app/es/terms",
  PRIVACY_POLICY: "https://kebo.app/es/privacy-policy",
  
  // Support
  WHATSAPP_SUPPORT: "https://wa.me/573176989062?text=Hello Kebo support! I need help with the app",
  DISCORD_COMMUNITY: "https://discord.gg/UmU9mbDkUx",
  
  // Social Media
  INSTAGRAM: "https://www.instagram.com/kebo.finanzas/",
  
  // GitHub
  GITHUB: "https://github.com/kebo-ai/kebo",

  // Feedback & Features
  FEATURE_REQUESTS: "https://keboapp.featurebase.app/",
  
  // Learning
  LEARNING_BASE: "https://aprende.kebo.app/",
  LEARNING_INVESTMENT: "https://aprende.kebo.app/inversion",
} as const;

export type ExternalUrlKey = keyof typeof EXTERNAL_URLS;

