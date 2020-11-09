<script>
    import {onMount} from 'svelte'
    import {roles, dimensions, categories} from './store.js'
    import {goto} from '@sapper/app'

    let auctions = []
    let errorMessage
    let productName
    let productDescription
    let endDate
    let endTime = ''
    let category
    let dimension
    let startingPrice = ''
    $: endTimeOk = endTime.match('^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$')
    $: startingPriceOk = startingPrice.match('^([0-9]+)$|^([0-9]+\.[0-9]{1,2})$')

    onMount(() =>{
        const request = new Request('/api/auctions', {
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
                        auctions = json
                    }else{
                        errorMessage = json.error
                    }
                }))
    })

    function handleEditAuction(auctionId){
        goto(`/edit?id=${auctionId}`)
    }

    function handleDeleteAuction(auctionId){
        const request = new Request(`/api/auctions/${auctionId}`, {
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
                        auctions = json
                    }else{
                        errorMessage = json.error
                    }
                }))
    }

    function handleAddAuction(event){
        event.preventDefault()
        const request = new Request('/api/auctions', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('sessionToken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({productName, productDescription, endDate, endTime, startingPrice, category, dimension})
        })
        fetch(request)
            .then(response => response.json()
                .then(json => {
                    if(response.status === 200){
                        auctions = json
                    }else{
                        errorMessage = json.error
                    }
                }))
    }

    function getTodayDate(){
        const today = new Date()

        let day = today.getDate()
        if(day < 10){
            day = '0'+day
        }

        let month = today.getMonth()+1
        if(month < 10){
            month = '0'+month
        }

        const year = today.getFullYear()

        return year+'-'+month+'-'+day
    }

</script>

<svelte:head>
    <title>Sapper project template</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</svelte:head>

{#if $roles && $roles.includes('admin')}
<main>
    <div class="row">
        <h1 class="auction_title">Add, update or delete auctions</h1>
    </div>
    <div class="row">
        <table>
            <tr>
                <th>Name</th>
                <th>End date</th>
                <th>End time</th>
                <th>Category</th>
                <th>Dimensions</th>
                <th>Starting price</th>
                <th>Actions</th>
            </tr>
            {#each auctions as auction}
                <tr>
                    <td>{auction.productName}</td>
                    <td>{auction.endDate}</td>
                    <td>{auction.endTime}</td>
                    <td>{auction.category}</td>
                    <td>{auction.dimension}</td>
                    <td>{auction.startingPrice}</td>
                    <td>
                        <i class="fa fa-pencil" on:click="{handleEditAuction(auction.id)}"></i>
                        <i class="fa fa-trash" on:click={handleDeleteAuction(auction.id)}></i>
                    </td>
                </tr>
            {/each}
        </table>
    </div>
    <div class="row">
        <form class="auction_form" method="" action="">
            <h1 class="auction_title">Edit auction</h1>
            <label>Product name</label>
            <input class={!productName ? 'bad' : ''} type="text" placeholder="Product name" name="product-name" id="product-name" bind:value={productName}/>
            <label>End date</label>
            <input class={!endDate ? 'bad' : ''} type="date" min={getTodayDate()} placeholder="End date" name="end_date" id="end_date" bind:value={endDate}/>
            <label>End time</label>
            <input class={!endTimeOk ? 'bad' : ''} type="text" placeholder="End time" name="end_time" id="end_time" bind:value={endTime}/>
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
            <select name="dimensions" id="dimensions" required bind:value={dimension}>
                <option value="none" selected disabled hidden>
                    Select an Option
                </option>
                {#each $dimensions as dimension}
                    <option>{dimension}</option>
                {/each}
            </select>
            <label>Starting price</label>
            <input class={!startingPriceOk ? 'bad' : ''} type="text" placeholder="Starting price" name="starting_price" id="starting_price" bind:value={startingPrice}/>
            <input type="submit" value="Save" on:click={handleAddAuction} disabled={!productName || !productDescription || !category || !dimension || !startingPriceOk || !endDate || !endTimeOk}>
        </form>
    </div>
</main>
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

    .error_message {
        font-size: 32px;
        margin: 1rem;
        display: block;
        color: red;
        text-decoration: none;
    }

    h1.title {
        text-align: center;
        width: 100%;
        font-size: 32px;
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
        margin-top: 3%;
        background-color: #005066;
        color: white;
        padding: 0.5rem;
        font-size: 17px;
        border: 1px solid #005066;
    }

    table{
        overflow-y:scroll;
        height: 20rem;
        display: block;
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

    table i {
        cursor: pointer;
    }
</style>