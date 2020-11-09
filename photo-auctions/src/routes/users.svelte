<script>
    import {onMount} from 'svelte'
    import {roles} from './store.js'

    let users = []
    let errorMessage

    onMount(() => {
        const request = new Request('/api/users', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('sessionToken')
            },
        })
        fetch(request)
            .then(response => response.json()
                .then(json => {
                    if (response.status === 200) {
                        users = json
                        console.log(users)
                    } else {
                        errorMessage = json.error
                    }
                }))
    })

</script>

{#if $roles && $roles.includes('admin')}
    <div class="row">
        <h1 class="auction_title">Users</h1>
    </div>
    <div class="row">
        <table>
            <tr>
                <th>Username</th>
                <th>E-mail</th>
                <th>Admin?</th>
            </tr>
            {#each users as {username, email, roles}}
                <tr>
                    <td>{username}</td>
                    <td>{email}</td>
                    <td>{roles.includes('admin')}</td>
                </tr>
            {/each}
            {#if errorMessage}
                <span class="error">{errorMessage}</span>
            {/if}
        </table>
    </div>
{:else}
    <div class="row">
        <span class="error_message">User doesn't have permission to access this page</span>
    </div>
{/if}

<style>
    .row {
        font-family: arial;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        width: 100%;
    }

    h1.title {
        text-align: center;
        width: 100%;
        font-size: 32px;
    }

    .error_message{
        font-size: 32px;
        margin: 1rem;
        display: block;
        color: red;
        text-decoration: none;
    }

    table {
        width: 50%;
    }

    table th {
        padding-top: 1rem;
        padding-bottom: 1rem;
        text-align: center;
        background-color: #009c82;
        color: white;
    }

    table tr:nth-child(even){ background-color: #f2f2f2; }

    table tr:hover { background-color: #ddd; }

    table td, table th {
        border: 1px solid #ddd;
        padding: 0.5rem;
        text-align: center;
    }
</style>