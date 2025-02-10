<script lang="ts">
    import { onMount } from "svelte";
    import {SecurityFetch, lang, mode} from "../../store";
    import { showMessageBox } from "../../custom/customStore";
    let recordData:any[];
    let loading = true;
  
    // 게임 데이터를 불러오는 함수
    async function fetchGameData() {
  
      const endpoint = "/record/pending";
      const data = {mode: $mode} 
  
      try {
        const response = await SecurityFetch(endpoint, "POST", data);
        if (!response.ok) 
        {throw new Error(`오류 발생: ${response.status}`);}
        recordData = await response.json();
      } catch (error) {
        console.error("데이터 불러오기 오류:", error);
        showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
      } finally{
        loading = false;
      }
    }
    const ok = $lang ? "승인" : "Accept"
  const remove = $lang ? "삭제" : "Remove"

    // 레코드 승인/삭제 요청 함수
    async function handleRecord(action:string, orderNum:number) {
      const endpoint = action === "approve" ? "/record/approve" : "/record/cancel";
      const data = { orderNum: orderNum, mode: $mode };
  
      try {
        const response = await SecurityFetch(endpoint,action==="approve"? "POST":"DELETE",data);
        if (response.ok) {
          showMessageBox("success", $lang ? "요청 성공":"Success", `${action === "approve" ? ok : remove} 완료`);
          fetchGameData();
        } else {
          showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
        }
      } catch (error) {
        showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
      }
    }
  
// 페이지가 마운트될 때 게임 데이터 불러오기
onMount(async () => {
    await fetchGameData(); // fetchGameData 호출
});
  </script>


<h3 class="message-title">{$mode} {$lang ? "기록 승인하기" : "Record Accept"}</h3>
<div class="message-body">

<table class="temp-table">
    <thead>
    <tr>
      <th class="record-table-date">{$lang ? "날짜" : "Date"}</th>
      <th class="record-table-loser">{$lang ? "패자" : "Loser"}</th>
      <th class="record-table-ok">{$lang ? "승인" : "OK"}</th>
    </tr>
</thead>
<tbody>     
    {#if loading}
      <tr><td colspan="3" class="text-center">{$lang ? "로딩 중" : "Loading"}...</td></tr>
    {:else if recordData.length === 0}
      <tr><td colspan="3" class="text-center">{$lang ? "기록이 없습니다" : "No Data"}</td></tr>
    {:else}
      {#each recordData as row}
        <tr>
          <td>{new Date(row.date).toLocaleDateString()}</td>
          <td>{$mode? row.loser.replace("_m","") : row.loser}</td>
          <td>
            <button class="simple-button" on:click={() => handleRecord("approve", row.orderNum)}>{ok}</button>
            <button class="simple-button" on:click={() => handleRecord("delete", row.orderNum)}>{remove}</button>
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
}
tr td:nth-child(3){
  width: 30%;
}
.simple-button{
  font-size: 0.7rem;
  padding: 3px
}


  </style>