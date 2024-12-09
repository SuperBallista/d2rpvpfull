<script>
    import { onMount } from "svelte";
    import {SecurityFetch, mode} from "./store";
    let recordData = [];
    let loading = true;
  
    // 게임 데이터를 불러오는 함수
    async function fetchGameData() {
  
      const endpoint = $mode ? "/rank/challenge/m-user" : "/rank/challenge/b-user"; 
  
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
    async function handleRecord(action, challenger) {
      const endpoint = action === "win" ? "/record/challenge/win" : "/record/challenge/lose";
      const data = { challenger: challenger, mode: $mode };
  
      try {
        const response = await SecurityFetch(endpoint,"POST",data);
  
        if (response.ok) {
          alert(`${action === "win" ? "도전을 승인하였습니다, 결과는 대전 기록에서 입력해주세요." : "경기를 포기하여 자동 패배처리합니다"} `);
          fetchGameData();
        } else {
          throw new Error(`오류 발생: ${response.status}`);
        }
      } catch (error) {
        console.error(`${action === "win" ? "승인" : "삭제"} 오류:`, error.message);
        alert(`오류 발생: ${error.message}`);
      }
    }
  
    // 페이지가 마운트될 때 게임 데이터 불러오기
    onMount(fetchGameData);
  </script>
  
  <table>
    <tr>
      <th class="record-table-date">날짜</th>
      <th class="record-table-loser">도전자</th>
      <th class="record-table-score">결과</th>
    </tr>
    {#if loading}
      <tr><td colspan="4" class="text-center">로딩 중...</td></tr>
    {:else if recordData.length === 0}
      <tr><td colspan="4" class="text-center">기록이 없습니다</td></tr>
    {:else}
      {#each recordData as row}
        <tr>
          <td>{new Date(row.ChallengeDate).toLocaleDateString()}</td>
          <td>{$mode? row.Nickname.replace("_m","") : row.Nickname}</td>
          <td>
            <button on:click={() => handleRecord("win", row.Nickname)}>경기</button>
            <button on:click={() => handleRecord("lose", row.Nickname)}>기권</button>
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
  