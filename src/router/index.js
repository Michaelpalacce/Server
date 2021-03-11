import { createRouter, createWebHistory }	from 'vue-router'
import Login								from '../views/Login.vue'

const routes	= [
	{
		path: '/',
		name: 'Login',
		component: Login
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: function () {
			return import( '../views/App/Dashboard.vue' );
		}
	},
	{
		path: '/browse',
		name: 'Browse',
		component: function () {
			return import( '../views/App/Dashboard.vue' );
		}
	}
]

const router	= createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router
