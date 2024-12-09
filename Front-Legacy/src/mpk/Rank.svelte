<script>
  import { onMount } from "svelte";
  import { key, nickname, SecurityFetch, mode, clickformopen } from "../store.js";
  let rankData = [];
  let loading = true;
  let error = null;
  let showDetails = [];
  let myRank

  async function fetchData() {
    let bValidCount
let tiedRank = 1;
let rank = 1;

    try {
      const response = await fetch("/rank/m-user");
      if (!response.ok) {
        throw new Error("연결 에러입니다");
      }
      rankData = await response.json();

      rankData.sort((a, b) => b.TScore - a.TScore);
      bValidCount = rankData.length || 1;


      for (let i = 0; i < rankData.length; i++) {
  if (rankData[i].wins + rankData[i].loses != 0) {
    if (i > 0 && rankData[i].TScore === rankData[i - 1].TScore) {
      rankData[i].rank = tiedRank;
    } else {
      rankData[i].rank = rank;
      tiedRank = rank;
    }
    rank++;
  } else {
    rankData[i].rank = bValidCount;
  }
  if ($nickname === rankData[i].nickname)
  {myRank = rankData[i].rank}
}

    } catch (err) {
      error = err;
    } finally {
      loading = false;
    }
  }

  async function challengeRank(challengeNickname) {
const data = {nickname: challengeNickname, mode: $mode}
try{
const response = await SecurityFetch("/rank/challenge","POST",data);

if (response.status === 200)
{
  alert(`${challengeNickname.replace("_m","")}님에게 도전을 신청하였습니다`)
} else if (response.status===400)
{
  alert(`당신은 이미 도전 신청을 한 상태입니다`)
} else if (response.status===403)
{
alert(`${challengeNickname.replace("_m","")}님은 휴가중으로 도전을 받을 수 없는 상태입니다`)  
}
else if (response.status===404)
{alert(`서버 에러입니다`)}
}    
catch (err) {
  alert("서버 오류입니다")
}

  }



  // 컴포넌트가 마운트될 때 변수를 구독
  onMount(() => {
    const unsubscribe = key.subscribe((value) => {
      fetchData();
    });

    // 컴포넌트가 언마운트될 때 구독 해제
    return () => {
      unsubscribe();
    };
  });

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
    <title>mpk 랭킹</title>
</svelte:head>

<!-- <div class="main_data">
  <select
    class="namewidth center"
    bind:value={selectfilter}
    on:change={() => filterData()}
  >
    <option value="0">모든 선수 보기</option>
    <option value="1">전적이 있는 선수만 보기</option>
    <option value="10">전적 10 이상인 선수만 보기</option>
  </select>
</div> -->
<div class="table-outline main_data rank">
  <div class="table-head">
    <div class="table-head_rank table-contents_cell">등급</div>
    <div class="table-head_nickname table-contents_cell">닉네임</div>
    <div class="table-head_winrate table-contents_cell">클랜</div>
    <div class="table-head_score table-contents_right-cell">점수</div>
  </div>
  {#if loading}
    <p>로딩 중...</p>
  {:else if error}
    <p>Error: {error.message}</p>
  {:else}
    {#each rankData as user, index}
      <div class="table-contents-wrapper">
        <div
          class="table-contents"
          on:click={() => toggleDetails(index)}
          on:keydown={handleKeyDown}
        >
          <div class="table-contents_rank table-contents_cell">
            {#if user.rank / rankData.length <= 0.1}<img
                class="ranksize"
                src="/img/diamond.png"
                alt="10%"
              />
            {:else if user.rank / rankData.length <= 0.25}<img
                class="ranksize"
                src="/img/platinum.png"
                alt="25%"
              />
            {:else if user.rank / rankData.length <= 0.45}<img
                class="ranksize"
                src="/img/gold.png"
                alt="45%"
              />
            {:else if user.rank / rankData.length <= 0.7}<img
                class="ranksize"
                src="/img/silver.png"
                alt="70%"
              />
            {:else}<img class="ranksize" src="/img/bronze.png" alt="100%" />
            {/if}
          </div>
          <!-- 등급 (순위) -->
          <div class="table-contents_nickname table-contents_cell">
            {user.nickname.replace("_m", "")}
          </div>
          <!-- 닉네임 -->
          <div class="table-contents_winrate table-contents_cell">
            {user.clan==="none" ? "없음" : user.clan}
          </div>
          <!-- 클랜 -->
          <div class="table-contents_score table-contents_right-cell">
            {Math.round(user.TScore * 100) / 100}
          </div>
          <!-- 점수 (BScore + LScore) -->
        </div>
        {#if showDetails[index]}
          <div class="table-contents_detail show">
       대전점수 : {Math.round(user.BScore * 100) / 100} <br/>
       대회점수 : {user.LScore} <br/>
       순위 : {user.rank} <br/>
       Elo : {Math.round(user.Elo * 100) / 100}<br/>
       {user.wins} 승 / {user.loses} 패<br/>
       {#if Number(myRank) > Number(user.rank)}
       <button on:click={() => challengeRank(user.nickname)}>도전하기</button>{/if}
          </div>
        {/if}
      </div>
    {/each}
  {/if}


  {#if $nickname != null && $nickname != "admin_m"}
  <div class="fixed-button-div">
    <button on:click={() => clickformopen("challenge")}>도전<br />승인</button>
  </div>
{/if}


</div>

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
