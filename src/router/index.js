import { createRouter, createWebHistory }	from 'vue-router'
import Login								from '@/views/App/Login/Login'
import Browse								from '@/views/App/Browse/Browse'
import Preview								from '@/views/App/Browse/Preview'
import Dashboard							from '@/views/App/Dashboard/Dashboard'

const routes	= [
	{
		path: '/',
		name: 'Login',
		component: Login
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: Dashboard
	},
	{
		path: '/browse',
		name: 'Browse',
		component: Browse
	},
	{
		path: '/preview',
		name: 'Preview',
		component: Preview
	}
]

export default createRouter({
	history: createWebHistory( process.env.BASE_URL ),
	routes
})
