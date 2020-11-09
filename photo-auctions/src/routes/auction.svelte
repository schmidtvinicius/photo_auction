<script>
    import {onMount} from 'svelte'

    let auctionId
    let auction
    let errorMessage
    let bidValue = ''
    $: amountOk = bidValue.match('^([0-9]+)$|^([0-9]+\.[0-9]{1,2})$')

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
                        console.log(auction)
                        errorMessage = undefined
                    }else{
                        errorMessage = json.error
                    }
                }))
    })

    function handleBid(event){
        event.preventDefault()
        const request = new Request(`/api/auctions/${auctionId}/bids`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('sessionToken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({bidValue})
        })
        fetch(request)
            .then(response => response.json()
                .then(json => {
                    if(response.status === 200){
                        auction = json
                        errorMessage = undefined
                    }else{
                        errorMessage = json.error
                    }
                }))
    }

    function alertAuctionEnded(event){
        event.preventDefault()
        alert(`No bids allowed! The auction has ended! The winner is: ${!auction.highestBid.placedBy ? 'No one... =(' : auction.highestBid.placedBy}`)
    }

</script>

<svelte:head>
    <title>Sapper project template</title>
</svelte:head>

{#if auction !== undefined}
    <section class="auction_detail">
        {#if errorMessage}
            <span class="error_message">{errorMessage}</span>
        {/if}
        <div class="auction_column" id="auction_detail">
            <h1 class="auction_title">Product name: {auction.productName}</h1>
            <p class="auction_description" id="description">Product description: {auction.productDescription}</p>
            <p class="auction_description" id="starting_price">Starting price: {auction.startingPrice}</p>
            <p class="auction_description" id="end_date">End date: {auction.endDate}</p>
            <p class="auction_description" id="end_time">End time: {auction.endTime}</p>
            <form method="" action="/">
                <input class={!amountOk ? 'auction_bid_amount bad' : 'auction_bid_amount'} type="text" placeholder="amount" bind:value={bidValue}/>
                <input class="auction_bid_button" type="submit" value="Bid" disabled={!amountOk} on:click={auction.hasEnded ? alertAuctionEnded : handleBid}/>
            </form>
        </div>
        <div class="auction_detail_bid_list">
            <h2>Bids</h2>
            <ul>
                <li class="auction_detail_bid">
                    <span class="auction_detail_bid_price">Price</span>
                    <span class="auction_detail_bid_user">User</span>
                    <span class="auction_detail_bid_time">Time</span>
                </li>
                {#each auction.bids as bid}
                    <li class="auction_detail_bid">
                        <span class="auction_detail_bid_price">&#8364;{bid.bidValue}</span>
                        <span class="auction_detail_bid_user">{bid.placedBy}</span>
                        <span class="auction_detail_bid_time">{bid.placedAt}</span>
                    </li>
                {/each}
            </ul>
        </div>
    </section>
{/if}
<style>
    * {
        font-family: arial;
        font-size: inherit;
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
        padding: 0.5rem;
        font-size: 17px;
        border: 1px solid #005066;
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

    p.auction_description {
        padding: 0 1rem;
    }

    .auction_column{
        display: flex;
        flex-direction: column;
    }

    .auction_detail {
        margin-top: 4rem;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        background-color: white;
        box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
    }

    .auction_detail_bid_list,
    .auction_detail_bid_list ul {
        width: 100%;
        margin: 0;
    }

    .auction_detail_bid_list h2 {
        padding: 0 1rem;
        font-size: 24px;
    }

    .auction_detail_bid_list {
        display: flex;
        flex-flow: wrap;
        height: 20rem;
        overflow: scroll;
        margin: 0;
    }

    .auction_detail_bid_list .auction_detail_bid {
        display: flex;
        width: 100%;
        height: 2rem;
    }

    .auction_detail_bid_price,
    .auction_detail_bid_user,
    .auction_detail_bid_time {
        flex: 0 0 30%;
        line-height: 2rem;
    }

    .auction_bid_amount {
        float: left;
    }

    .auction_bid_button {
        float: left;
    }

    .auction_detail form {
        padding: 1rem;
    }
</style>

