import { createRouter, createWebHistory }	from 'vue-router'
import Login								from '@/views/App/Login/Login'
import Browse								from '@/views/App/Browse/Browse'
import Preview								from '@/views/App/Browse/Preview'
import Dashboard							from '@/views/App/Dashboard/Dashboard'
import Users								from '@/views/App/Users/Users'
import User									from '@/views/App/Users/User'
import Roles								from '@/views/App/Users/Roles'
import Permissions								from '@/views/App/Users/Permissions'

const routes	= [
	{
		path: '/',
		name: 'login',
		component: Login
	},
	{
		path: '/dashboard',
		name: 'dashboard',
		component: Dashboard
	},
	{
		path: '/browse',
		name: 'browse',
		component: Browse
	},
	{
		path: '/preview',
		name: 'preview',
		component: Preview
	},
	{
		path: '/users',
		name: 'users',
		component: Users
	},
	{
		path: '/user/:username',
		name: 'user',
		component: User
	},
	{
		path: '/user/:username/roles',
		name: 'user-roles',
		component: Roles
	},
	{
		path: '/user/:username/permissions',
		name: 'user-permissions',
		component: Permissions
	},
]

export default createRouter({
	history: createWebHistory( process.env.BASE_URL ),
	routes
})
