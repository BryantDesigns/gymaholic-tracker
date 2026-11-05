/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set to "true" to allow demo (no-payment) checkout in a production build. */
  readonly VITE_DEMO_CHECKOUT?: string;
}

// This fontsource package ships no type declarations for its CSS entry.
declare module '@fontsource-variable/big-shoulders-display';
