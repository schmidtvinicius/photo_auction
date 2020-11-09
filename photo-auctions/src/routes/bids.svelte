<script>
    import {onMount} from 'svelte'
    import {getTokenPayload} from "./store.js";

    let bids = []
    let errorMessage

    onMount(() => {
        const username = getTokenPayload().username
        const request = new Request(`/api/users/${username}/bids`, {
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
                        bids = json
                        console.log(bids)
                    } else {
                        errorMessage = json.error
                    }
                }))
    })

    function handleDelete(bidId) {
        const username = getTokenPayload().username
        const request = new Request(`/api/users/${username}/bids/${bidId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('sessionToken')
            },
        })
        fetch(request)
            .then(response => response.json()
                .then(json => {
                    if(response.status === 200){
                        bids = json
                    }else{
                        errorMessage = json.error
                    }
                }))
    }

</script>

<svelte:head>
    <title>Sapper project template</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</svelte:head>

<div class="row">
    <h1 class="auction_title">My bids</h1>
</div>
<div class="row">
    <table>
        <tr>
            <th>Id</th>
            <th>Username</th>
            <th>Price</th>
            <th>Time</th>
            <th>Is best bid?</th>
            <th>Placed by</th>
            <th>Action</th>
        </tr>
        {#each bids as {id, name, bidValue, placedAt, isHighestBid, placedBy}}
            <tr>
                <td>{id}</td>
                <td>{name}</td>
                <td>&#8364;{bidValue}</td>
                <td>{placedAt}</td>
                <td>{isHighestBid}</td>
                <td>{placedBy}</td>
                <td>
                    <i class="fa fa-trash" on:click={handleDelete(id)}></i>
                </td>
            </tr>
        {/each}
        {#if errorMessage}
            <span class="error">{errorMessage}</span>
        {/if}
    </table>
</div>

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

    .error{
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