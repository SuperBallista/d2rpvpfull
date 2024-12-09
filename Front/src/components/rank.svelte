<script lang="ts">
    import { onMount } from "svelte";
    import { key, myaccount, SecurityFetch, mode, form } from "../store.js";
  
    let rankData: any[] = [];
    let loading = true;
    let error: any = null;
    let myRank: number | null = null;
    let showDetails: boolean[] = [];
  
    async function fetchData() {
      let bValidCount;
      let tiedRank = 1;
      let rank = 1;
      let endpoint = $mode ? "/rank/m-user" : "/rank/b-user";
  
      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("연결 에러입니다");
        }
        rankData = await response.json();
  
        rankData.sort((a, b) => b.TScore - a.TScore);
        bValidCount = rankData.length || 1;
  
        for (let i = 0; i < rankData.length; i++) {
          if (rankData[i].wins + rankData[i].loses !== 0) {
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
          if ($myaccount === rankData[i].nickname) {
            myRank = rankData[i].rank;
          }
        }
      } catch (err) {
        error = err;
      } finally {
        loading = false;
      }
    }
  
    async function challengeRank(challengeNickname: string) {
      const data = { nickname: challengeNickname, mode: $mode };
      try {
        const response = await SecurityFetch("/rank/challenge", "POST", data);
  
        if (response.status === 200) {
          alert(`${challengeNickname.replace("_m", "")}님에게 도전을 신청하였습니다`);
        } else if (response.status === 400) {
          alert(`당신은 이미 도전 신청을 한 상태입니다`);
        } else if (response.status === 403) {
          alert(`${challengeNickname.replace("_m", "")}님은 휴가중으로 도전을 받을 수 없는 상태입니다`);
        } else if (response.status === 404) {
          alert(`서버 에러입니다`);
        }
      } catch (err) {
        alert("서버 오류입니다");
      }
    }
  
    function toggleDetails(index: number) {
        showDetails[index] = !showDetails[index];
        showDetails = [...showDetails]; // 반응성 트리거
    }
  
    onMount(() => {
      const unsubscribe = key.subscribe((value) => {
        fetchData();
      });
  
      return () => {
        unsubscribe();
      };
    });
  </script>
  
  <svelte:head>
    <title>mpk 랭킹</title>
  </svelte:head>
  
  <div class="table-outline">
    {#if loading}
      <p>로딩 중...</p>
    {:else if error}
      <p>Error: {error.message}</p>
    {:else}
      <table class="rank-table">
        <thead>
          <tr>
            <th>등급</th>
            <th>닉네임</th>
            <th>승률</th>
            <th>점수</th>
          </tr>
        </thead>
        <tbody>
          {#each rankData as user, index}
            <tr on:click={() => toggleDetails(index)}>
              <!-- 등급 -->
              <td>
                {#if user.rank / rankData.length <= 0.1}
                  <img class="ranksize" src="/img/diamond.png" alt="10%" />
                {:else if user.rank / rankData.length <= 0.25}
                  <img class="ranksize" src="/img/platinum.png" alt="25%" />
                {:else if user.rank / rankData.length <= 0.45}
                  <img class="ranksize" src="/img/gold.png" alt="45%" />
                {:else if user.rank / rankData.length <= 0.7}
                  <img class="ranksize" src="/img/silver.png" alt="70%" />
                {:else}
                  <img class="ranksize" src="/img/bronze.png" alt="100%" />
                {/if}
              </td>
              <!-- 닉네임 -->
              <td>{user.nickname.replace("_m", "")}</td>
              <!-- 승률 -->
              <td>{user.wins+user.losses > 0 ? (Math.round(10000*(user.wins/(user.wins+user.losses))))/100 : 0 }</td>
              <!-- 점수 -->
              <td>{Math.round(user.TScore * 100) / 100}</td>
              <!-- 상세보기 -->
            </tr>
            {#if showDetails[index]}
              <tr>
                <td colspan="5" class="detail-row">
                  대전점수: {Math.round(user.BScore * 100) / 100}<br />
                  대회점수: {user.LScore}<br />
                  순위: {user.rank}<br />
                  Elo: {Math.round(user.Elo * 100) / 100}<br />
                  {user.wins} 승 / {user.losses} 패<br />
                  <!-- {#if Number(myRank) > Number(user.rank)}
                    <button class="simple-button" on:click={() => challengeRank(user.nickname)}>
                      도전하기
                    </button>
                  {/if} -->
                </td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    {/if}
  
  </div>

  <style>

    .detail-row {
      text-align: left;
      padding-left: 10px;
    }
    tr {
      cursor: pointer;
    }
    .ranksize{
      width: 20px;
      height: 20px;
      border-radius: 15%;
      border: 1px solid #ffffff;
    }

    table tr td:first-child, table tr th:first-child {
  width: 10%; /* 첫 번째 열 */
}
table tr td:nth-child(2), table tr th:nth-child(2) {
  width: 35%; /* 두 번째 열 */
}
table tr td:nth-child(3), table tr th:nth-child(3) {
  width: 35%; /* 세 번째 열 */
}
table tr td:nth-child(4), table tr th:nth-child(4) {
  width: 20%; /* 네 번째 열 */
}

  </style>