<script lang="ts">
    import { onMount } from "svelte";
    import { SecurityFetch, mode, lang } from "../../store";
  
    interface Record {
      challengeDate: string; // 날짜 정보
      nickname: string; // 도전자 이름
    }
  
    let recordData: Record[] = []; // 기록 데이터
    let loading: boolean = true;
  
    // 게임 데이터를 불러오는 함수
    async function fetchGameData(): Promise<void> {
      const endpoint: string = `/rank/challenge/${$mode}/show`;
  
      try {
        const response = await SecurityFetch(endpoint, "POST");
        if (!response.ok) throw new Error(`오류 발생: ${response.status}`);
        recordData = await response.json();
      } catch (error) {
        console.error("데이터 불러오기 오류:", (error as Error).message);
        alert(error);
      }finally {
    // 로딩 상태를 항상 업데이트
    loading = false;
  }
    }
  

    // 레코드 승인/삭제 요청 함수
    async function handleRecord(action: "win" | "lose", challenger: string): Promise<void> {
      const endpoint: string = action === "win" ? "/record/challenge/win" : "/record/challenge/lose";
      const data = { challenger, mode: $mode };
  const win = $lang ? "도전을 승인하였습니다, 결과는 대전 기록에서 입력해주세요." : "You accepted challenge. You should input result on 'Records'"
  const giveUp = $lang ? "경기를 포기하여 자동 패배처리합니다" : "You give up games, your records add 1 lost game"
      try {
        const response = await SecurityFetch(endpoint, "POST", data);
  
        if (response.ok) {
          alert(
            action === "win"
              ? win : giveUp
          );
          fetchGameData();
        } else {
          throw new Error(`Error Code: ${response.status}`);
        }
      } catch (error) {
        console.error(`${action === "win" ? "승인" : "삭제"} 오류:`, (error as Error).message);
        alert(`오류 발생: ${(error as Error).message}`);
      }
    }
  
    // 페이지가 마운트될 때 게임 데이터 불러오기
    onMount(() => {
      fetchGameData();
    });
  </script>
  <h3 class="message-title">{$lang ? "도전 승인하기" : "Challenge Accept"}</h3>

  <div class="message-body">

  <table>
    <thead>
    <tr>
      <th class="record-table-date">{$lang ? "날짜" : "Date"}</th>
      <th class="record-table-loser">{$lang ? "도전자" : "Challenger"}</th>
      <th class="record-table-score">{$lang ? "결과" : "Result"}</th>
    </tr>
</thead>
    {#if loading}
    <tbody>
      <tr><td colspan="3" class="text-center">{$lang ? "로딩 중" : "Loading"}...</td></tr></tbody>
    {:else if recordData.length === 0}
    <tbody>
      <tr><td colspan="3" class="text-center">{$lang ? "기록이 없습니다" : "No Data"}</td></tr></tbody>
    {:else}
    <tbody>
      {#each recordData as row}
        <tr>
          <td>{new Date(row.challengeDate).toLocaleDateString()}</td>
          <td>{$mode ? row.nickname.replace("_m", "") : row.nickname}</td>
          <td>
            <button class="small simple-button" on:click={() => handleRecord("win", row.nickname)}>{$lang ? "경기" : "Play"}</button>
            <button class="small simple-button" on:click={() => handleRecord("lose", row.nickname)}>{$lang ? "포기" : "Give Up"}</button>
          </td>
        </tr>
      {/each}
      </tbody>
    {/if}
  </table>
  </div>
  <style>
table{
  width: 100%;
  max-width: 100%; /* 테이블이 화면 너비를 초과하지 않도록 제한 */
  table-layout: fixed; /* 테이블 셀 크기를 고정 */
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
 
  
    .text-center {
      text-align: center;
    }
  .small{
    padding: 3px;
      }
  </style>
  