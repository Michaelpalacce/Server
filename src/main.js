import { createApp }	from 'vue';
import App				from './App.vue';
import router			from './router';
import mitt				from 'mitt';

import	'./style/fa/css/all.min.css';
import	'./style/index.css';
import	"highlight.js/styles/dracula.css"

import './registerServiceWorker'

const emitter	= mitt();
const app		= createApp( App );

app.config.globalProperties.emitter	= emitter;
app.use( router ).mount( '#app' );
