<script lang="ts">
    import { onMount } from "svelte";
    import {SecurityFetch, mode} from "../../store";
    let recordData:any[];
    let loading = true;
  
    // 게임 데이터를 불러오는 함수
    async function fetchGameData() {
  
      const endpoint = $mode ? "/record/pending?mode=true" : "/record/pending?mode=false"; 
  
      try {
        const response = await SecurityFetch(endpoint, "GET");
        if (!response.ok) 
        {throw new Error(`오류 발생: ${response.status}`);}
        recordData = await response.json();
      } catch (error) {
        console.error("데이터 불러오기 오류:", error);
        alert("정보를 불러오는 중 오류가 발생하였습니다");
      } finally{
        loading = false;
      }
    }
  
    // 레코드 승인/삭제 요청 함수
    async function handleRecord(action:string, orderNum:number) {
      const endpoint = action === "approve" ? "/record/approve" : "/record/cancel";
      const data = { orderNum: orderNum, mode: $mode };
  
      try {
        const response = await SecurityFetch(endpoint,action==="approve"? "POST":"DELETE",data);
  
        if (response.ok) {
          alert(`${action === "approve" ? "승인" : "삭제"} 완료`);
          fetchGameData();
        } else {
          throw new Error(`오류 발생: ${response.status}`);
        }
      } catch (error) {
        console.error(`${action === "approve" ? "승인" : "삭제"} 오류:`, error);
        alert(`오류 발생: ${error}`);
      }
    }
  
// 페이지가 마운트될 때 게임 데이터 불러오기
onMount(async () => {
    await fetchGameData(); // fetchGameData 호출
});
  </script>


<h3 class="message-title">{$mode ? "밀리PK" : "정통바바"} 기록 승인하기</h3>
<div class="message-body">

<table class="temp-table">
    <thead>
    <tr>
      <th class="record-table-date">날짜</th>
      <th class="record-table-loser">패자</th>
      <th class="record-table-score">점수</th>
      <th class="record-table-ok">승인</th>
    </tr>
</thead>
<tbody>
    {#if loading}
      <tr><td colspan="4" class="text-center">로딩 중...</td></tr>
    {:else if recordData.length === 0}
      <tr><td colspan="4" class="text-center">기록이 없습니다</td></tr>
    {:else}
      {#each recordData as row}
        <tr>
          <td>{new Date(row.date).toLocaleDateString()}</td>
          <td>{$mode? row.loser.replace("_m","") : row.loser}</td>
          <td>{row.lScore}</td>
          <td>
            <button class="simple-button" on:click={() => handleRecord("approve", row.orderNum)}>승인</button>
            <button class="simple-button" on:click={() => handleRecord("delete", row.orderNum)}>삭제</button>
          </td>
        </tr>
      {/each}
    {/if}
</tbody>
  </table>
  </div>

  <style>

.temp-table{
  width: 100%;
  max-width: 100%; /* 테이블이 화면 너비를 초과하지 않도록 제한 */
  table-layout: fixed; /* 테이블 셀 크기를 고정 */
  overflow-x: auto; /* 가로 스크롤 허용 */
  font-size: 0.8rem;
}

tr td:first-child{
width: 30%;

}
tr td:nth-child(2){
  width: 40%;
  max-width: 40%;
  white-space: nowrap;
  overflow: scroll;
}
tr td:nth-child(3){
  width: 30%;
}
.simple-button{
  font-size: 0.7rem;
  padding: 3px
}


  </style>