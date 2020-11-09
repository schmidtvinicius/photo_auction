<script>
    import { goto } from '@sapper/app'
    import {saveToken} from "./store.js";

    let username
    let password
    let errorMessage

    function login(event){
        event.preventDefault()
        const request = new Request('/credentials', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        })
        fetch(request)
            .then(response => response.json()
                .then(json => {
                    if(response.status === 200){
                        saveToken(json.token)
                        goto('/')
                    }else{
                        errorMessage = json.error
                    }
                }))
    }
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<form class="login_form" method="" action="">
    <h1 class="auction_title">Login</h1>
    <input type="text" placeholder="Username" name="username" required bind:value={username} class={!username ? 'bad' : ''}/>
    <input type="password" placeholder="Password" required bind:value={password} class={!password ? 'bad' : ''}/>
    <input type="submit" value="Login" on:click={login} disabled={!username || !password}/>
    <a href="register.html">Register</a>
    {#if errorMessage}
        <span class="error">{errorMessage}</span>
    {/if}
</form>

<style>
    form input.bad{
        border-color: red;
    }
    .error{
        font-size: 32px;
        margin: 1rem;
        display: block;
        color: red;
        text-decoration: none;
    }

    * {
        font-family: arial;
        font-size: inherit;
    }

    h1{
        font-size: 32px;
        margin: 1rem;
        display: block;
        color: black;
        text-decoration: none;
    }

    form{
        background-color: white;
        box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
        padding: 1.5rem;
        margin-left: 25%;
        width: 50%;
    }

    form input[type=text],
    form input[type=password] {
        width: 100%;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        margin: 1rem 0;
    }

    a{
        display: block;
        margin-top: 1.5rem;
    }

    input[type=submit] {
        background-color: #005066;
        color: white;
        padding: 0.5rem;
        font-size: 17px;
        border: 1px solid #005066;
    }
</style>
