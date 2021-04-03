import { createApp }	from 'vue';
import App				from './App.vue';
import router			from './router';
import mitt				from 'mitt';

import './style/index.css';
import './style/dropzone.css';

const emitter	= mitt();
const app		= createApp( App );

app.config.globalProperties.emitter	= emitter;
app.use( router ).mount( '#app' );
