<script>
	import {reloadRoles, resetToken, roles} from "../routes/store.js";
	import { goto } from '@sapper/app'
	import {onMount} from 'svelte'

	function handleLogout(event){
		event.preventDefault()
		resetToken()
		goto('/login')
	}

	onMount(() => {
		reloadRoles()
	})

	export let segment;
</script>

<nav>
	{#if $roles}
		<a aria-current="{segment === undefined ? 'page' : undefined}" href=".">home</a>
		{#if segment === 'auction'}
			<a aria-current="{segment === 'auction' ? 'page' : undefined}" href="auction">auction details</a>
		{/if}
		<a aria-current="{segment === 'about' ? 'page' : undefined}" href="about">about</a>
		<a aria-current="{segment === 'bids' ? 'page' : undefined}" href="bids">my bids</a>
		{#if $roles.includes('admin')}
			<a aria-current="{segment === 'admin' ? 'page' : undefined}" href="admin">admin</a>
			{#if segment === 'edit'}
				<a aria-current="{segment === 'edit' ? 'page' : undefined}" href="edit">edit</a>
			{/if}
			<a aria-current="{segment === 'users' ? 'page' : undefined}" href="users">users</a>
		{/if}
		<a aria-current="{segment === 'logout' ? 'page' : undefined}" href="logout" on:click={handleLogout}>logout</a>
	{:else}
		<a aria-current="{segment === 'about' ? 'page' : undefined}" href="about">about</a>
		<a aria-current="{segment === 'login' ? 'page' : undefined}" href="login">login</a>
		<a aria-current="{segment === 'register' ? 'page' : undefined}" href="register">register</a>
	{/if}
</nav>

<style>
	* {
		font-family: arial;
		font-size: inherit;
	}

	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em;
		overflow: hidden;
		background-color: #009c82;
	}

	[aria-current] {
		position: relative;
		display: inline-block;
		background-color: #005066;
		color: white;
	}

	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		display: block;
		bottom: -1px;
	}

	a {
		float: left;
		display: block;
		color: white;
		text-align: center;
		padding: 1.5rem;
		text-decoration: none;
		font-size: 17px;
	}

	a:hover{
		background-color: #ddd;
		color: black;
	}

	nav {
		overflow: hidden;
		background-color: #009c82;
	}

	nav input[type=text] {
		margin-top: 0.9rem;
		border: none;
	}


</style>
