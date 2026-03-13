/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
  readonly STRIPE_PUBLIC_KEY: string;
  readonly MUX_TOKEN_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
