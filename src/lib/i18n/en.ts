export const en = {
	'app.name': 'Kabuk',
	'firstRun.title': 'Welcome to Kabuk',
	'firstRun.intro': 'Choose how to set up this device.',
	'firstRun.startFresh': 'Start fresh',
	'firstRun.pair': 'Pair with a device',
	'settings.language': 'Language',
	'settings.languageSystem': 'System default',
	'settings.theme': 'Theme',
	'theme.system': 'System default',
	'theme.light': 'Light',
	'theme.dark': 'Dark',
	'splash.loading': 'Loading'
} as const;

export type MessageKey = keyof typeof en;
