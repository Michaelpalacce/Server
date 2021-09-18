const config	= {
	configureWebpack: {
		devServer: {
			stats: {
				colors: true,
				hash: false,
				version: false,
				timings: false,
				assets: false,
				chunks: false,
				modules: false,
				reasons: false,
				children: false,
				source: false,
				errors: false,
				errorDetails: false,
				warnings: false,
				publicPath: false
			}
		}
	},
	productionSourceMap: false,
	devServer: {
		proxy: 'http://localhost:8888'
	},
	pwa: {
		pwaIcons: {
			favicon32: 'img/icons/favicon-32x32.png',
			favicon16: 'img/icons/favicon-16x16.png',
			appleTouchIcon: null,
			maskIcon: null,
			msTileImage: 'img/icons/favicon-32x32.png'
		}
	}
};

module.exports	= config;