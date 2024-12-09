<script>
import { onMount } from "svelte";
import { key } from "../store.js";
  import Clanrecord from "./Clanrecord.svelte";

let loading = true;
let clanRank = [];
let error = null;
let showDetails = [];

onMount(() => {
    const unsubscribe = key.subscribe((value) => {
      fetchClanData();
    });

    // 컴포넌트가 언마운트될 때 구독 해제
    return () => {
      unsubscribe();
    };
  });

  async function fetchClanData() {
    try {
      const response = await fetch("/clan/list");
      if (!response.ok) {
        throw new Error("연결 에러입니다");
      }
      clanRank = await response.json();
    } catch (err) {
      error = err;
    } finally {
      loading = false;
    }
  }

  function toggleDetails(index) {
    showDetails[index] = !showDetails[index];
    showDetails = [...showDetails]; // 배열을 업데이트하여 Svelte가 반응하도록 함
  }

  function handleKeyDown(event, index) {
    if (event.key === "Enter" || event.key === " ") {
      toggleDetails(index);
    }
  }





</script>
<svelte:head>
    <title>mpk 클랜전 기록</title>
</svelte:head>

<div class="table-outline main_data rank">
    <div class="table-head">
      <div class="table-head_rank table-contents_cell">순위</div>
      <div class="table-head_nickname table-contents_cell">클랜명</div>
      <div class="table-head_score table-contents_right-cell">점수</div>
      <div class="table-head_winrate table-contents_cell">승/무/패</div>
    </div>
{#if loading}
<p>Loading</p>    
{:else if error}
<p>Error : {error.message}</p>
{:else}

{#each clanRank as clan, index}

<div class="table-contents-wrapper">
    <div
    class="table-contents"
    on:click={() => toggleDetails(index)}
    on:keydown={handleKeyDown}
  >
  <div class="table-contents_rank table-contents_cell">
    {index+1}
</div>
          <div class="table-contents_nickname table-contents_cell">
            {clan.Name}
            </div>
          <div class="table-contents_score table-contents_right-cell">
            {clan.Score}
</div>
<div class="table-contents_winrate table-contents_cell">
{clan.wins} / {clan.draws} / {clan.loses}
</div>
</div>

{#if showDetails[index]}
<div class="table-contents_detail show">
{clan.member}
</div>
{/if}


</div>
{/each}
{/if}
</div>


<Clanrecord/>
<style>
    .table-head_rank,
    .table-contents_rank {
      width: 15%;
    }
  
    .table-head_nickname,
    .table-contents_nickname {
      width: 40%;
    }
  
    .table-head_winrate,
    .table-contents_winrate {
      width: 25%;
    }
  
    .table-head_score,
    .table-contents_score {
      width: 20%;
    }
    .table-contents:hover {
  text-decoration: underline;
  
    }
  
  </style>
  