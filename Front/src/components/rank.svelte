<script lang="ts">
    import { onMount } from "svelte";
    import { key, myaccount, SecurityFetch, mode, form, admin, lang } from "../store.js";
    import { showMessageBox } from "../custom/customStore.js";
  
    let rankData: any[] = [];
    let loading = true;
    let error: any = null;
    let myRank: number | null = null;
    let showDetails: boolean[] = [];
    let newdata:boolean = false
    let memo:string = ""
    let noMemo = $lang ? "기록하기" : "Input Memo"
  
    async function fetchData() {
      let bValidCount;
      let tiedRank = 1;
      let rank = 1;
      let endpoint = "/rank/" + $mode;
  
      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("연결 에러입니다");
        }
        rankData = await response.json();

        rankData = rankData.map((rank) => ({
          ...rank,
          memoModify: false
        }));

  
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
        const response = await SecurityFetch(`/rank/challenge`, "POST", data);
  
        if (response.status === 201) {
          showMessageBox("success", $lang? "도전 신청 성공": "Success", $lang ? `${challengeNickname.replace("_m", "")}님에게 도전을 신청하였습니다` : `You challenged to ${challengeNickname}`)
        } else if (response.status === 400) {
          showMessageBox("error", $lang ? "에러 발생" : "Error", $lang ? `당신은 이미 도전 신청을 한 상태입니다` : `You should cancel or finished your challenge first`)
        } else if (response.status === 403) {
          showMessageBox("error", $lang ? "에러 발생" : "Error", $lang ? `${challengeNickname.replace("_m", "")}님은 휴가중으로 도전을 받을 수 없는 상태입니다` : `You can't challenge to ${challengeNickname} now`)
        } else {
          showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
        }
      } catch (err) {
        showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
      }
    }
  
    function toggleDetails(index: number) {
        showDetails[index] = !showDetails[index];
        showDetails = [...showDetails]; // 반응성 트리거
    }
  
    onMount(() => {
      const unsubscribe = key.subscribe((value) => {
        fetchData();
        checkChallenge();
      });
  
      return () => {
        unsubscribe();
      };
    });

    // 게임 데이터를 불러오는 함수
    async function checkChallenge(): Promise<void> {
      const endpoint: string = `/rank/challenge/${$mode}/show`;
  if ($myaccount) {
      try {
        const response = await SecurityFetch(endpoint, "POST");
        if (!response.ok) throw new Error($lang ? `오류 발생: ${response.status}` : "Error: " + response.status);
       const data:any[] = await response.json();
       if (data.length===0)
       {newdata = false}
       else
       {newdata = true}

      } catch (error) {
        console.error("데이터 불러오기 오류:", (error as Error).message);
      }
    }
  }


  function modify_memo(index:number) {
      if ($admin.includes($mode))
  {
      for (let i = 0; i < rankData.length; i++)
      {rankData[i].memoModify = false}
      memo = rankData[index].memo
      rankData[index].memoModify = true
}
    }

    async function SaveMemo(index:number) {
     const data = {nickname: rankData[index].nickname, memo: memo, mode: $mode}
     if ($admin.includes($mode))
     {
     try{
      const response = await SecurityFetch("/rank/memo","PATCH",data);
      if (response.ok){
        showMessageBox("success",$lang? "수정 성공": "Success", $lang ? "메모 수정 완료하였습니다" : "Memo modified complete")
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
          finally{
            rankData[index].memoModify = false
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
            <th>{$lang ? '등급' : 'Tier'}</th>
            <th>{$lang ? '닉네임' : 'Nickname'}</th>
            <th>{$lang ? '승률' : 'WinRate'}</th>
            <th>{$lang ? '점수' : 'Score'}</th>
          </tr>
        </thead>
        <tbody>
          {#each rankData as user, index}
            <tr on:click={() => toggleDetails(index)}>
              <!-- 등급 -->
              <td>
                {#if $mode != "zpke"}
                {#if user.rank === 1}
                  <img class="ranksize" src="/img/diamond.png" alt="1st" />
                {:else if user.rank / rankData.length <= 0.1}
                  <img class="ranksize" src="/img/platinum.png" alt="10%" />
                {:else if user.rank / rankData.length <= 0.2}
                  <img class="ranksize" src="/img/gold.png" alt="30%" />
                {:else if user.rank / rankData.length <= 0.6}
                  <img class="ranksize" src="/img/silver.png" alt="60%" />
                {:else}
                  <img class="ranksize" src="/img/bronze.png" alt="100%" />
                {/if}
                {:else}
                {#if user.rank <= 3}
                  <img class="ranksize" src="/img/zpke-challenger.jpg" alt="Top3" />
                {:else if user.rank / rankData.length <= 0.25}
                  <img class="ranksize" src="/img/zpke-diamond.jpg" alt="25%" />
                {:else if user.rank / rankData.length <= 0.5}
                  <img class="ranksize" src="/img/zpke-gold.jpg" alt="50%" />
                {:else if user.rank / rankData.length <= 0.75}
                  <img class="ranksize" src="/img/zpke-silver.jpg" alt="75%" />
                {:else}
                  <img class="ranksize" src="/img/zpke-bronze.jpg" alt="100%" />
                {/if}
                {/if}
              </td>
              <!-- 닉네임 -->
              <td>{user.nickname.replace("_m", "").replace("_z","")}</td>
              <!-- 승률 -->
              <td>{user.wins+user.losses > 0 ? ((Math.round(10000*(user.wins/(user.wins+user.losses))))/100).toFixed(2) : "0.00" }%</td>
              <!-- 점수 -->
              <td>{(Math.round(user.TScore * 100) / 100).toFixed(2)}</td>
              <!-- 상세보기 -->
            </tr>
            {#if showDetails[index]}
              <tr>
                <td colspan="5" class="detail-row">
                  {$lang ? '대전점수' : 'Battle Score'}: {(Math.round(user.BScore * 100) / 100).toFixed(2)}<br />
                  {$lang ? '대회점수' : 'Event Score'}: {user.LScore}<br />
                  {$lang ? '순위' : "Rank"}: {user.rank}<br />
                  Elo: {(Math.round(user.Elo * 100) / 100).toFixed(2)}<br />
                  {user.wins} / {user.losses}<br />
                  {$lang ? "메모" : "Memo"} : 
                  {#if user.memoModify}
                  <input type="text" class="memo-input" bind:value={memo} on:keydown={(e) => {
                    if (e.key === "Enter") SaveMemo(index);}}>
                    <button class="simple-button" on:click={() => SaveMemo(index)}>작성</button>
                  {:else}
                  <span on:click={()=> modify_memo(index)} class={$admin.includes($mode) ? "modify" : "" }>{typeof user.memo === "string" ? user.memo : noMemo }</span>
                  {/if}
                  <br/>
                  {#if (Number(myRank) > Number(user.rank)) && ($mode != "babapk")}
                    <button class="simple-button" on:click={() => challengeRank(user.nickname)}>
                      {$lang ? "도전하기" : "Challenge"}
                    </button>
                  {/if}
                </td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    {/if}
  
  </div>

  
  {#if $myaccount && ($mode==="zpke" || $mode==="mpk") }
  <div class="fixed-button-div">
    <button class="simple-button" on:click={() => form.set("challenge")}>{$lang ? "도전승인" : "My challengers"}
      {#if newdata}       
      <span class="badge">NEW</span>
    {/if}     
    </button>
  </div>
{/if}


  <style>

    .detail-row {
      text-align: left;
      padding-left: 10px;
    }
    tr {
      cursor: pointer;
    }
    .ranksize{
      width: 30px;
      height: 30px;
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

.memo-input{
    border: none; /* 테두리 제거 */
  background: transparent; /* 배경 투명 */
  color: inherit; /* 부모 요소의 텍스트 색상 상속 */
  font-size: inherit; /* 기본 폰트 크기 */
  width: 60%; /* 셀 너비에 맞추기 */
  outline: none; /* 포커스 시 파란 테두리 제거 */
  padding: 0; /* 여백 제거 */
  }

  </style>