import { createRouter, createWebHistory }	from 'vue-router'
import Login								from '@/views/App/Login/Login'
import Browse								from '@/views/App/Browse/Browse'
import Preview								from '@/views/App/Browse/Preview'
import Dashboard							from '@/views/App/Dashboard/Dashboard'
import Users								from '@/views/App/Users/Users'
import UsersUser							from '@/views/App/Users/User'
import User									from '@/views/App/User/User'
import Roles								from '@/views/App/Users/Roles'
import Permissions							from '@/views/App/Users/Permissions'

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
		name: 'users-user',
		component: UsersUser
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
	{
		path: '/user',
		name: 'user',
		component: User
	},
]

export default createRouter({
	history: createWebHistory( process.env.BASE_URL ),
	routes
})
