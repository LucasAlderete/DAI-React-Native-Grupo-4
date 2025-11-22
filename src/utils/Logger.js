// src/utils/Logger.js
export const Logger = {
  info: (tag, ...msg) => {
    console.log(`ℹ️ [${tag}]`, ...msg);
  },
  warn: (tag, ...msg) => {
    console.warn(`⚠️ [${tag}]`, ...msg);
  },
  error: (tag, error, context = '') => {
    console.error(`❌ [${tag}] ${context}`, error?.message || error);
    if (error?.response) {
      console.error("↳ Response data:", error.response.data);
      console.error("↳ Status:", error.response.status);
    }
  },
  success: (tag, ...msg) => {
    console.log(`✅ [${tag}]`, ...msg);
  },
};
