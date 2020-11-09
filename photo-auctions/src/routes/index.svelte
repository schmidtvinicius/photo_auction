<script>
    import {onMount} from 'svelte'
    import {dimensions, categories} from "./store"
    import Pagination from './pagination.svelte';

    const pageSize = 1
    let totalPages
    let auctions = []
    let currentAuctionsBlock = []
    let errorMessage
    let searchTerm
    let selectedCategories = []
    let selectedDimension = 'All'
    let highestPrice = 0
    $: selectedPriceRange = highestPrice


    onMount(() => {
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
                    if (response.status === 200) {
                        totalPages = determineTotalPages(json)
                        auctions = splitAuctionsBlock(json)
                        currentAuctionsBlock = auctions[0]
                        determineHighestPrice()
                        errorMessage = undefined
                    } else {
                        errorMessage = json.error
                    }
                }))
    })

    function splitAuctionsBlock(auctionsTmp){
        let allBlocks = []
        let block = []
        let count = 0
        for(let i = 0; i < totalPages; i++){
            for(let j = 0; j < pageSize && count < auctionsTmp.length; j++){
                block.push(auctionsTmp[count])
                count++
            }
            allBlocks.push(block)
            block = []
        }
        return allBlocks
    }

    function determineTotalPages(json){
        if(json.length <= pageSize){
            return 1
        }else{
            const modulo = json.length % pageSize
            if(modulo === 0){
                return json.length/pageSize
            }else{
                return ((json.length - modulo) / pageSize) + 1
            }
        }
    }

    function handleSearch(event) {
        event.preventDefault()
        const request = new Request('/api/auctions/?q=' + searchTerm, {
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
                        totalPages = determineTotalPages(json)
                        auctions = splitAuctionsBlock(json)
                        currentAuctionsBlock = auctions[0]
                        determineHighestPrice()
                        errorMessage = undefined
                    } else {
                        errorMessage = json.error
                    }
                }))
    }

    function handleFilter(event) {
        event.preventDefault()
        const request = new Request(`/api/auctions?priceRange=${selectedPriceRange}&selectedCategories=${selectedCategories}&selectedDimension=${selectedDimension}`, {
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
                        totalPages = determineTotalPages(json)
                        auctions = splitAuctionsBlock(json)
                        currentAuctionsBlock = auctions[0]
                        determineHighestPrice()
                        errorMessage = undefined
                    } else {
                        errorMessage = json.error
                    }
                }))
    }

    function determineHighestPrice() {
        for (const auctionBlock of auctions){
            for (const auction of auctionBlock) {
                if (Object.keys(auction.highestBid).length !== 0) {
                    if (auction.highestBid.bidValue > highestPrice) {
                        highestPrice = auction.highestBid.bidValue
                    }
                } else {
                    if (auction.startingPrice > highestPrice) {
                        highestPrice = auction.startingPrice
                    }
                }
            }
        }
    }

    function handlePageChange(event){
        const clickedPage = event.detail.clickedPage
        currentAuctionsBlock = auctions[clickedPage]
    }

</script>

<svelte:head>
    <title>Sapper project template</title>
</svelte:head>

<main>
    <div class="search-container">
        <form action="/">
            <input type="text" placeholder="Search..." name="q" bind:value={searchTerm}>
            <button disabled={!searchTerm} on:click={handleSearch}>Submit</button>
        </form>
        <form id="filter-form" action="/">
            <h2>Price range:</h2>
            <input type="text" disabled id="price-input" bind:value={selectedPriceRange}>
            <input type="range" id="price-range" min="0" max={highestPrice} bind:value={selectedPriceRange}>
            <h2>Categories</h2>
            <ul id="categories-list">
                {#each $categories as category}
                    <li><input type="checkbox" bind:group={selectedCategories} value={category}>{category}</li>
                {/each}
            </ul>
            <h2>Dimensions (cm):</h2>
            <select id="dimensions" bind:value={selectedDimension}>
                <option value="All" selected>All</option>
                {#each $dimensions as dimension}
                    <option value={dimension}>{dimension}</option>
                {/each}
            </select>
            <button type="submit" id="submit-filters" on:click={handleFilter}>Filter</button>
        </form>
    </div>

    <div class="row">
        {#if errorMessage}
            <span class="error_message">{errorMessage}</span>
        {:else}
            {#each currentAuctionsBlock as auction}
                <section class="auction_box">
                    <a class="auction_title" href="auction?id={auction.id}">{auction.productName}</a>
                    <p class="auction_description">{auction.productDescription}</p>
                    <div class="auction_bid">
                        {#if Object.keys(auction.highestBid).length === 0}
						<span class="auction_bid_price">
							{auction.startingPrice}
						</span>
                            <span class="auction_bid_time">
							NA
						</span>
                        {:else}
						<span class="auction_bid_price">
							{auction.highestBid.bidValue}
						</span>
                            <span class="auction_bid_time">
							{auction.highestBid.placedAt} uur
						</span>
                        {/if}
                    </div>
                </section>
            {/each}
        {/if}
    </div>
</main>

<footer class="row">
    <Pagination on:change={handlePageChange} totalPages={totalPages}/>
</footer>


<style>
    * {
        font-family: arial;
        font-size: inherit;
    }

    .error_message {
        font-size: 32px;
        margin: 1rem;
        display: block;
        color: red;
        text-decoration: none;
    }

    form {
        display: flex;
        margin-left: 20px;
        margin-bottom: 20px;
        flex-direction: column;
    }

    main {
        display: flex;
    }

    .row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        width: 100%;
    }

    .row > .auction_box {
        background: white;
        margin: 1.5%;
        flex: 0 0 30%;
        box-shadow: 0 2px 1px -1px rgba(0, 0, 0, .2), 0 1px 1px 0 rgba(0, 0, 0, .14), 0 1px 3px 0 rgba(0, 0, 0, .12);
    }

    .auction_bid {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .auction_bid_price:before {
        content: "\20AC";
    }

    .auction_bid_price,
    .auction_bid_time {
        flex-direction: column;
        text-align: center;
        width: 50%;
        padding: 1rem 0;
    }

    .auction_title {
        font-size: 32px;
        margin: 1rem;
        display: block;
        color: black;
        text-decoration: none;
    }

    .search-container {
        margin-top: 5px;
    }

    .search-container button {
        float: right;
        padding: 0.5rem;
        margin-top: 0.9rem;
        margin-right: 1.5rem;
        background: #005066;
        color: white;
        font-size: 17px;
        border: none;
        cursor: pointer;
    }

    .search-container button:hover {
        background: #ccc;
    }

    @media screen and (max-width: 825px) {
        nav .search-container {
            float: none;
        }

        .search-container a, .search-container input[type=text], .search-container button {
            float: none;
            display: block;
            text-align: left;
            width: 100%;
            margin: 0;
            padding: 14px;
        }

        .search-container input[type=text] {
            border: 1px solid #ccc;
        }
    }
</style>
