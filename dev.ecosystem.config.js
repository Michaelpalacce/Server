module.exports	= {
	apps : [
		{
			script: 'index.js',
			watch: true,
			ignore_watch : ["node_modules", "cache", "logs", "*.log", "*.json", "*.tmp", ".idea", ".git"],
			watch_options: {
				followSymlinks: false,
				usePolling: true
			},
			env: {
				"APP_PORT": "80",
				"APP_ADDRESS": "0.0.0.0",
				"STATIC_PATH": "public",
				"REQUEST_TIMEOUT": "60000",
				"TEMPLATING_DIR": "./templates",
				"UPLOADS_DIR": "/Uploads",
				"ADMIN_USERNAME": "root",
				"ADMIN_PASSWORD": "toor",
				"DEBUG": "1",
				"ENABLE_SECURITY": "0",
				"ENABLE_SECURITY_HEADERS": "0",
				"ENABLE_TERMINAL": "0",
				"USERS_DIR": "",
				"TERMINAL_TO_SPAWN": "",
				"SSL_KEY_PATH": "",
				"SSL_CERT_PATH": "",
			}
		}
	]
};
