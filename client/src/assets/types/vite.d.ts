interface ImportMetaEnv {
  readonly VITE_APP_PUBLIC_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_SERVER_URL: string;
  readonly VITE_APP_GCLOUD_URL: string;
	readonly VITE_APP_ADMIN_ID: string;
	readonly VITE_APP_ADMIN_PW: string;
	readonly VITE_APP_ADMIN: string;
	readonly VITE_APP_TODAY: string;
	readonly VITE_APP_CALENDAR: string;
	readonly VITE_APP_EXERCISE: string;
	readonly VITE_APP_FOOD: string;
	readonly VITE_APP_MONEY: string;
	readonly VITE_APP_SLEEP: string;
	readonly VITE_APP_USER: string;
	readonly VITE_APP_GOOGLE: string;
	readonly VITE_APP_ADMOB: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
