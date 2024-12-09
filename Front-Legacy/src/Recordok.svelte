<script>
  import { onMount } from "svelte";
  import {SecurityFetch, mode} from "./store";
  let recordData = [];
  let loading = true;

  // 게임 데이터를 불러오는 함수
  async function fetchGameData() {

    const endpoint = $mode ? "/record/pending?mode=true" : "/record/pending?mode=false"; 

    try {
      const response = await SecurityFetch(endpoint, "GET");
      if (!response.ok) throw new Error(`오류 발생: ${response.status}`);
      recordData = await response.json();
      loading = false;
    } catch (error) {
      console.error("데이터 불러오기 오류:", error.message);
      alert("정보를 불러오는 중 오류가 발생하였습니다");
    }
  }

  // 레코드 승인/삭제 요청 함수
  async function handleRecord(action, orderNum) {
    const endpoint = action === "approve" ? "/record/approve" : "/record/delete";
    const data = { orderNum: orderNum, mode: $mode };

    try {
      const response = await SecurityFetch(endpoint,"POST",data);

      if (response.ok) {
        alert(`${action === "approve" ? "승인" : "삭제"} 완료`);
        fetchGameData();
      } else {
        throw new Error(`오류 발생: ${response.status}`);
      }
    } catch (error) {
      console.error(`${action === "approve" ? "승인" : "삭제"} 오류:`, error.message);
      alert(`오류 발생: ${error.message}`);
    }
  }

  // 페이지가 마운트될 때 게임 데이터 불러오기
  onMount(fetchGameData);
</script>

<table>
  <tr>
    <th class="record-table-date">날짜</th>
    <th class="record-table-loser">패자</th>
    <th class="record-table-score">점수</th>
    <th class="record-table-ok">승인</th>
  </tr>
  {#if loading}
    <tr><td colspan="4" class="text-center">로딩 중...</td></tr>
  {:else if recordData.length === 0}
    <tr><td colspan="4" class="text-center">기록이 없습니다</td></tr>
  {:else}
    {#each recordData as row}
      <tr>
        <td>{new Date(row.Date).toLocaleDateString()}</td>
        <td>{$mode? row.Loser.replace("_m","") : row.Loser}</td>
        <td>{row.LScore}</td>
        <td>
          <button on:click={() => handleRecord("approve", row.OrderNum)}>승인</button>
          <button on:click={() => handleRecord("delete", row.OrderNum)}>삭제</button>
        </td>
      </tr>
    {/each}
  {/if}
</table>

<style>
  table {
    width: 90%;
    margin-top: 20px;
  }
  .record-table-date {
    width: 15%;
  }
  .record-table-loser {
    width: 40%;
  }
  .record-table-score {
    width: 15%;
  }
  .record-table-ok {
    width: 20%;
  }
</style>
