<script>
  import { onMount } from "svelte";
  import { key } from "../store.js";
  let rankData = [];
  let loading = true;
  let error = null;
  let showDetails = [];

  async function fetchData() {
    try {
      const response = await fetch("/rank/b-user");
      if (!response.ok) {
        throw new Error("연결 에러입니다");
      }
      rankData = await response.json();

      console.log(rankData);

      let bValidCount
      let lValidCount
      let rValidCount


// Tscore 계산
for (let i = 0; i < rankData.length; i++) {
  const DataCopyB = JSON.parse(JSON.stringify(rankData));
  const DataCopyL = JSON.parse(JSON.stringify(rankData));
  const DataCopyR = JSON.parse(JSON.stringify(rankData));


   bValidCount = DataCopyB.filter(item => item.Brank != "-").length || 1; // 나누기 0 방지
   lValidCount = DataCopyL.filter(item => item.Lrank != "-").length || 1; // 나누기 0 방지
   rValidCount = DataCopyR.filter(item => item.Rrank != "-").length || 1; // 나누기 0 방지

}      


// 대전점수를 기준으로 정렬하고 순위 매기기
rankData.sort((a, b) => b.BScore - a.BScore);
let tiedRank = 1;
let rank = 1;

for (let i = 0; i < rankData.length; i++) {
  if (rankData[i].wins + rankData[i].losses != 0) {
    if (i > 0 && rankData[i].BScore === rankData[i - 1].BScore) {
      rankData[i].Brank = tiedRank;
    } else {
      rankData[i].Brank = rank;
      tiedRank = rank;
    }
    rank++;
  } else {
    rankData[i].Brank = bValidCount;
  }
}

// 미니대회점수를 기준으로 정렬하고 순위 매기기
rankData.sort((a, b) => b.LScore - a.LScore);
tiedRank = 1;
rank = 1;

for (let i = 0; i < rankData.length; i++) {
  if (rankData[i].LScore != 0) {
    if (i > 0 && rankData[i].LScore === rankData[i - 1].LScore) {
      rankData[i].Lrank = tiedRank;
    } else {
      rankData[i].Lrank = rank;
      tiedRank = rank;
    }
    rank++;
  } else {
    rankData[i].Lrank = lValidCount;
  }
}

// 정규대회점수를 기준으로 정렬하고 순위 매기기
rankData.sort((a, b) => b.RScore - a.RScore);
tiedRank = 1;
rank = 1;

for (let i = 0; i < rankData.length; i++) {
  if (rankData[i].RScore != 0) {
    if (i > 0 && rankData[i].RScore === rankData[i - 1].RScore) {
      rankData[i].Rrank = tiedRank;
    } else {
      rankData[i].Rrank = rank;
      tiedRank = rank;
    }
    rank++;
  } else {
    rankData[i].Rrank = rValidCount;
  }
}

for (let i = 0; i < rankData.length; i++) {
rankData[i].Tscore = (Math.round((1 - (rankData[i].Brank / bValidCount)*0.4 - (rankData[i].Lrank / lValidCount)*0.3 - (rankData[i].Rrank / rValidCount)*0.3)*10000))/100;
}


// Tscore 기준으로 정렬
rankData.sort((a, b) => b.Tscore - a.Tscore);

// 최종 순위 매기기
for (let i = 0; i < rankData.length; i++) {
  rankData[i].Trank = i + 1;
}

console.log(rankData);


    } catch (err) {
      error = err;
    } finally {
      loading = false;
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
    <title>babapk 랭킹</title>
</svelte:head>

<div class="main_data">
</div>
<div class="table-outline main_data rank">
  <div class="table-head">
    <div class="table-head_rank table-contents_cell">등급</div>
    <div class="table-head_nickname table-contents_cell">닉네임</div>
    <div class="table-head_winrate table-contents_cell">승률</div>
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
            {#if user.Trank / rankData.length <= 0.1}<img
                class="ranksize"
                src="/img/diamond.png"
                alt="10%"
              />
            {:else if user.Trank / rankData.length <= 0.25}<img
                class="ranksize"
                src="/img/platinum.png"
                alt="25%"
              />
            {:else if user.Trank / rankData.length <= 0.45}<img
                class="ranksize"
                src="/img/gold.png"
                alt="45%"
              />
            {:else if user.Trank / rankData.length <= 0.7}<img
                class="ranksize"
                src="/img/silver.png"
                alt="70%"
              />
            {:else}<img class="ranksize" src="/img/bronze.png" alt="100%" />
            {/if}
          </div>
          <!-- 등급 (순위) -->
          <div class="table-contents_nickname table-contents_cell">
            {user.nickname}
          </div>
          <!-- 닉네임 -->
          <div class="table-contents_winrate table-contents_cell">
            {user.wins + user.losses == 0
              ? 0
              : Math.round((user.wins / (user.wins + user.losses )) * 10000) / 100}
          </div>
          <!-- 승률 (이긴 횟수) -->
          <div class="table-contents_score table-contents_right-cell">
            {user.Tscore}
          </div>
        </div>
        {#if showDetails[index]}
          <div class="table-contents_detail show">
            대전점수: {user.BScore} ({user.Brank}위)<br />
            미니대회점수: {user.LScore} ({user.Lrank}위)<br />
            정규대회점수: {user.RScore} ({user.Rrank}위)<br />
            전적: {user.wins + user.losses} <br />
            승수: {user.wins} <br />
            패수: {user.losses} <br />
          </div>
        {/if}
      </div>
    {/each}
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
