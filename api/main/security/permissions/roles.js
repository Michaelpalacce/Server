module.exports	= {
	admin		: {
		rules: [
			{
				type: 'ALLOW',
				route: '',
				method: ''
			}
		]
	},
	moderator	: {
		rules: [
			{
				type: 'DENY',
				route: /^(\/users(.+)?)/,
				method: ''
			},
			{
				type: 'DENY',
				route: /^(\/terminal(.+)?)/,
				method: ''
			},
			{
				type: 'ALLOW',
				route: '',
				method: ''
			}
		]
	},
	user		: {
		rules: [
			{
				type: 'DENY',
				route: /^(\/users(.+)?)/,
				method: ''
			},
			{
				type: 'DENY',
				route: /^(\/terminal(.+)?)/,
				method: ''
			},
			{
				type: 'ALLOW',
				route: '',
				method: ''
			}
		]
	}
	,
};
