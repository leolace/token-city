/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_CORE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
