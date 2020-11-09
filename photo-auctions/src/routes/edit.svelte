<script>
    import {onMount} from 'svelte'
    import {roles, categories, dimensions} from './store.js'
    import {goto} from '@sapper/app'

    let auctionId
    let auction
    let errorMessage
    let productName
    let productDescription
    let category
    let updatedDimensions

    onMount(() =>{
        const query = window.location.search.split('?id=')
        auctionId = query[1]
        const request = new Request(`/api/auctions/${auctionId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('sessionToken')
            },
        })
        fetch(request)
            .then(response => response.json()
                .then(json => {
                    if(response.status === 200){
                        auction = json
                        productName = auction.productName
                        productDescription = auction.productDescription
                        category = auction.category
                        updatedDimensions = auction.dimension
                        console.log(auction)
                    }else{
                        errorMessage = json.error
                    }
                }))
    })

    function handleEditAuction(event){
        event.preventDefault()
        const request = new Request(`/api/auctions/${auctionId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('sessionToken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({productName, productDescription, category, updatedDimensions})
        })
        fetch(request)
            .then(response => response.json()
                .then(json => {
                    if(response.status === 200){
                        goto('/admin')
                    }else{
                        errorMessage = json.error
                    }
                }))
    }
</script>

<svelte:head>
    <title>Sapper project template</title>
</svelte:head>

{#if $roles && auction}
    {#if $roles.includes('admin')}
        <main>
            <div class="row">
                <h1 class="auction_title">Update auction</h1>
            </div>
            <div class="row">
                <form class="auction_form" method="" action="">
                    <h1 class="auction_title">Edit auction</h1>
                    <label>Product name</label>
                    <input class={!productName ? 'bad' : ''} type="text" placeholder="Product name" name="product-name" id="product-name" bind:value={productName}/>
                    <label>End date</label>
                    <input disabled type="date" placeholder="End date" name="end_date" id="end_date" value={auction.endDate}/>
                    <label>End time</label>
                    <input disabled type="text" placeholder="End time" name="end_time" id="end_time" value={auction.endTime}/>
                    <label>Product description</label>
                    <input class={!productDescription ? 'bad' : ''} type="text" placeholder="Description" name="description" id="description" bind:value={productDescription}/>
                    <label>Product category</label>
                    <select name="category" id="categories" required bind:value={category}>
                        <option value="none" selected disabled hidden>
                            Select an Option
                        </option>
                        {#each $categories as category}
                            <option>{category}</option>
                        {/each}
                    </select>
                    <label>Product dimensions</label>
                    <select name="dimensions" id="dimensions" required bind:value={updatedDimensions}>
                        <option value="none" selected disabled hidden>
                            Select an Option
                        </option>
                        {#each $dimensions as dimension}
                            <option>{dimension}</option>
                        {/each}
                    </select>
                    <label>Starting price</label>
                    <input disabled class="auction_bid_price" type="text" placeholder="Starting price" name="starting_price" id="starting_price" value=&#8364;{auction.startingPrice}/>
                    <input type="submit" value="Save" on:click={handleEditAuction} disabled={!productName || !productDescription || !category || !updatedDimensions}>
                </form>
            </div>
        </main>
    {:else}
        {#if errorMessage}
            <span class="error">{errorMessage}</span>
        {/if}
    {/if}
{:else}
    <div class="row">Loading...</div>
{/if}

<style>
    .row {
        display: flex;
        font-family: arial;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        width: 100%;
    }

    .auction_title {
        font-size: 32px;
        margin: 1rem;
        display: block;
        color: black;
        text-decoration: none;
    }

    .error_message {
        font-size: 32px;
        margin: 1rem;
        display: block;
        color: red;
        text-decoration: none;
    }

    .auction_form {
        display: flex;
        flex-direction: column;
        background-color: white;
        box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
        padding: 1.5rem;
        margin-top: 4rem;
        width: 50%;
    }

    .auction_form > label{
        margin-top: 3%;
    }

    form input.bad {
        border-color: red;
    }

    input[type=text] {
        color: gray;
        padding: 0.5rem;
        font-size: 17px;
        border: 1px solid grey;
    }

    input[type=submit] {
        background-color: #005066;
        color: white;
        margin-top: 3%;
        padding: 0.5rem;
        font-size: 17px;
        border: 1px solid #005066;
    }
</style>