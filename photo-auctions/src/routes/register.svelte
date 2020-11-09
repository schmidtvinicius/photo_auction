<script>
    import { goto } from '@sapper/app'
    import {saveToken} from "./store";

    let username = ''
    let email = ''
    let password = ''
    let passwordRepeat
    let errorMessage
    $: validUsername = username.length > 0 && !username.match(' ')
    $: validPassword = password.length >= 6 && password.match('[A-Z]') && password.match('[0-9]')
    $: validPasswordRepeat = password === passwordRepeat
    $: validEmail = email.length > 0 && email.match('^[A-Za-z0-9-_.]+@[a-zA-Z0-9]+\\.(com|nl)$')

    function register(event){
        event.preventDefault()
        const request = new Request('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, email, password})
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

<form class="register_form" method="" action="">
    <h1 class="auction_title">Register</h1>
    <input type="text" placeholder="Username" name="username" required bind:value={username} class={!validUsername ? 'bad' : ''}/>
    <input type="text" placeholder="Email" name="email" required bind:value={email} class={!validEmail ? 'bad' : ''}/>
    <input type="password" placeholder="Password" name="password" required bind:value={password} class={!validPassword ? 'bad' : ''}/>
    <input type="password" placeholder="Password repeat" name="password_repeat" required bind:value={passwordRepeat} class={!validPasswordRepeat ? 'bad' : ''}/>
    <input type="submit" value="Register" on:click={register} disabled={!validUsername || !validEmail || !validPassword || !validPasswordRepeat}/>
    {#if errorMessage}
        <span class="error">{errorMessage}</span>
    {/if}
</form>

<style>
    * {
        font-family: arial;
        font-size: inherit;
    }

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

    input[type=submit] {
        background-color: #005066;
        color: white;
        padding: 0.5rem;
        font-size: 17px;
        border: 1px solid #005066;
    }
</style>