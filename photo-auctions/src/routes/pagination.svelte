<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let totalPages = 1;
    export let activePage = 0;

    function switchPage(clickedPage){
        activePage = clickedPage
        dispatch('change', {
            clickedPage: clickedPage
        });
    }

    function isInRange(page){
        if ((page < 3) || (page >= totalPages - 3)) {
            return true;
        }

        return page > activePage - 3 && page < activePage + 3;
    }
</script>

<nav>
    <ul>
        {#each Array(totalPages) as ignoredVal, currentPage}
            <li class:active={currentPage === activePage} class="page mouse-pointer" on:click={() => switchPage(currentPage)}>{currentPage + 1}</li>
        {/each}
    </ul>
</nav>

<style>
    .mouse-pointer:hover {
        cursor: pointer;
    }

    ul {
        display: flex;
        flex-flow: wrap;
        justify-content: center;
        list-style-type: none;
        padding: 5px;
    }

    .page {
        padding: 0.5em 1em;
        border-left: 1px solid lightblue;
        border-top: 1px solid lightblue;
        border-bottom: 1px solid lightblue;
    }

    .page:last-of-type {
        border-right: 1px solid lightblue;
    }

    .page:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }

    .page.active {
        background-color: rgb(129, 200, 176);
    }

</style>