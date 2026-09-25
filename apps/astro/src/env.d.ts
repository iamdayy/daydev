/// <reference types="astro/client" />

declare namespace App {
  interface Locals {}
}

interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}