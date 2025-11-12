// Admin.tsx

// Types ------------------------------------------------------------------------------------------
export type AppInfoType = {
	_id: string;
	admin_name: string;
	admin_email: string;
	admin_role: string;
	admin_regDt: string;
	admin_updateDt: string;
};

// Schema -----------------------------------------------------------------------------------------
export const AppInfo: AppInfoType = {
	_id: "",
	admin_name: "",
	admin_email: "",
	admin_role: "user",
	admin_regDt: "",
	admin_updateDt: "",
};