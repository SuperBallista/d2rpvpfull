<script lang="ts">
    import { onMount } from "svelte";
    import { key, myaccount, SecurityFetch, mode, form } from "../store.js";
  
    let rankData: any[] = [];
    let loading = true;
    let error: any = null;
    let showDetails: boolean[] = [];
    let myclan:string = ""

  
    async function fetchData() {
      let bValidCount;
      let tiedRank = 1;
      let rank = 1;
      let endpoint = `/clan/${$mode}/list`;
      let fetchmyclanendpoint = `/clan/${$mode}/myclan`
  
      try {
        const response = await SecurityFetch(endpoint, "GET");
        if (!response.ok) {
          throw new Error("연결 에러입니다");
        }
        rankData = await response.json();
  
        rankData.sort((a, b) => b.TScore - a.TScore);
        bValidCount = rankData.length || 1;
  
        for (let i = 0; i < rankData.length; i++) {
            if (i > 0 && rankData[i].TScore === rankData[i - 1].TScore) {
              rankData[i].rank = tiedRank;
            } else {
              rankData[i].rank = rank;
              tiedRank = rank;
            }
            rank++;
        }

        if ($myaccount)
        {const resClan = await SecurityFetch(fetchmyclanendpoint, "POST");
        myclan = await resClan.json();}


      } catch (err) {
        error = err;
      } finally {
        loading = false;
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

   async function clanJoin(clanname:string){
    const data = {clanname: clanname}
    const endpoint = `/clan/${$mode}/join`
    try{
        const response = await SecurityFetch(endpoint, "PATCH", data)
        if (response.status===200)
    {alert("클랜에 가입하였습니다")
     fetchData();   
    }
    else
    {alert("오류 발생")}
    }
    catch (error)
    {
alert("오류 발생 :" + error)
    }

   }

  </script>
    
  <div class="table-outline">
    {#if loading}
      <p>로딩 중...</p>
    {:else if error}
      <p>Error: {error.message}</p>
    {:else}
      <table class="rank-table">
        <thead>
          <tr>
            <th>순위</th>
            <th>클랜</th>
            <th>점수</th>
            <th>인원</th>
          </tr>
        </thead>
        <tbody>
          {#each rankData as clan, index}
            <tr on:click={() => toggleDetails(index)}>
              <!-- 순위 -->
              <td>
                {clan.rank}
              </td>
              <!-- 닉네임 -->
              <td>{clan.name}</td>
              <!-- 점수 -->
              <td>{clan.TScore}</td>
              <!-- 점수 -->
              <td>{(clan.members).length}</td>
              <!-- 상세보기 -->
            </tr>
            {#if showDetails[index]}
              <tr>
                <td colspan="5" class="detail-row">
                  대전점수: {clan.BScore}<br />
                  대회점수: {clan.LScore}<br />
                  클랜원: {clan.members}
                  {#if myclan === "none"}
                  <button class="simple-button" on:click={() => clanJoin(clan.name)}>가입하기</button>
                  {/if}
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
      white-space: normal;
    }
    tr {
      cursor: pointer;
    }

    table tr td:first-child, table tr th:first-child {
  width: 15%; /* 첫 번째 열 */
}
table tr td:nth-child(2), table tr th:nth-child(2) {
  width: 40%; /* 두 번째 열 */
}
table tr td:nth-child(3), table tr th:nth-child(3) {
  width: 30%; /* 세 번째 열 */
}
table tr td:nth-child(4), table tr th:nth-child(4) {
  width: 15%; /* 네 번째 열 */
}

  </style>