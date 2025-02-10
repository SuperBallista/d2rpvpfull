<script lang="ts">
    import { onMount } from "svelte";
    import { key, myaccount, SecurityFetch, mode, lang } from "../store.js";
    import { showMessageBox } from "../custom/customStore.js";
  
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
        console.log($myaccount, $mode, $lang)
        console.log(rankData, myclan)
      }
    }
  

    function toggleDetails(index: number) {
        showDetails[index] = !showDetails[index];
        showDetails = [...showDetails]; // 반응성 트리거
    }
  
    onMount(() => {
      const unsubscribe = key.subscribe(() => {
        fetchData();
      });
  
      return () => {
        unsubscribe();
      };
    });

   async function clanJoin(clanname:string){
    const data = {clanname: clanname}
    const endpoint = `/clan/${$mode}/join`
    const userResponse = await showMessageBox("confirm", $lang ? "가입 확인":"Confirm", $lang ? `${clanname} 클랜에 가입합니다. 계속하시겠습니까?` : "Are you sure you want to join the clan? Do you want to continue? :" + clanname)
    if (userResponse.success) {
    try{
        const response = await SecurityFetch(endpoint, "PATCH", data)
        if (response.status===200)
    {
      showMessageBox("success", $lang ? "클랜 가입 성공":"Joined Clan", $lang ? "클랜에 가입하였습니다" : "You joined clan")
     fetchData();   
    }
    else
    {    
     showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
  }
    }
    catch (error)
    {
      showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
    }
  }
   }

  </script>
    
  <div class="table-outline">
    {#if loading}
      <p>{$lang ? "로딩 중" : "Loading"}...</p>
    {:else if error}
      <p>Error: {error.message}</p>
    {:else}
      <table class="rank-table">
        <thead>
          <tr>
            <th>{$lang ? "순위" : "Rank"}</th>
            <th>{$lang ? "클랜" : "Clan"}</th>
            <th>{$lang ? "점수" : "Score"}</th>
            <th>{$lang ? "인원" : "Member"}</th>
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
              <td>{clan.TScore.toFixed(2)}</td>
              <!-- 점수 -->
              <td>{(clan.members).length}</td>
              <!-- 상세보기 -->
            </tr>
            {#if showDetails[index]}
              <tr>
                <td colspan="5" class="detail-row">
                  {$lang ? '대전점수' : 'Battle Score'}: {clan.BScore.toFixed(2)}<br />
                  {$lang ? '대회점수' : 'Event Score'}: {clan.LScore}<br />
                  {$lang ? '클랜원' : 'Members'}: {clan.members}
                  {#if myclan === "none"}
                  <button class="simple-button" on:click={() => clanJoin(clan.name)}>{$lang ? '가입하기' : 'Join'}</button>
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