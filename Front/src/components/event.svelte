<script lang="ts">
    import { myaccount, key, form, SecurityFetch } from "../store";
    import { onMount } from "svelte";
  
    let eventData:any[] = [];
    let loading = true;
    let error:any = null;
    let showDetails:boolean[] = [];
  
    async function deleteandresetEvent(index:number) {
      try {
        const endpoint = "/event/m-user/cancel";
        const response = await SecurityFetch(endpoint, "DELETE", eventData[index]);
  
        if (response && response.ok) {
          alert("토너먼트 히스토리를 삭제하고 점수를 초기화하였습니다");
        }
      } catch (error) {
        alert("에러가 발생하였습니다: " + error);
      } finally {
        fetchData();
      }
    }
  
    async function approveEvent(index:number) {
      try {
        const endpoint = "/event/m-user/accept";
        const response = await SecurityFetch(endpoint, "POST", eventData[index]);
  
        if (response && response.status === 201) {
          alert("토너먼트 히스토리를 승인하였습니다");
        }
      } catch (error) {
        alert("에러가 발생하였습니다: " + error);
      } finally {
        fetchData();
      }
    }
  
    async function deleteEvent(index:number) {
      try {
        const endpoint = "/event/m-user/delete";
        const data = { eventname: eventData[index].eventname };
        const response = await SecurityFetch(endpoint, "DELETE", data);
  
        if (response && response.status === 200) {
          alert("토너먼트 히스토리를 삭제하였습니다");
        }
      } catch (error) {
        alert("에러가 발생하였습니다: " + error);
      } finally {
        fetchData();
      }
    }
  
    async function fetchData() {
      try {
        const response = await fetch("/event/m-user/history");
        if (!response.ok) {
          throw new Error("연결 에러입니다");
        }
        eventData = await response.json();
  
        eventData = eventData.map((event) => ({
          ...event,
          ok: event.accept === 1 ? "대기" : event.accept === 2 ? "승인" : event.ok,
        }));
  
        showDetails = new Array(eventData.length).fill(false);
      } catch (err) {
        error = err;
      } finally {
        loading = false;
      }
    }
  
    onMount(() => {
      const unsubscribe = key.subscribe(() => {
        fetchData();
      });
  
      return () => {
        unsubscribe();
      };
    });
  
    function toggleDetails(index:number) {
      showDetails = [...showDetails]; // 배열 복사로 반응성 유지
      showDetails[index] = !showDetails[index];
    }
  </script>
  
  <svelte:head>
    <title>mpk 토너먼트 기록하기</title>
  </svelte:head>
  
  <!-- 테이블 UI -->
  <div class="table-container">
    {#if loading}
      <p>로딩 중...</p>
    {:else if error}
      <p>Error: {error}</p>
    {:else}
      <table>
        <thead>
          <tr>
            <th>대회명</th>
            <th>규모</th>
            <th>우승자</th>
            <th>승인</th>
          </tr>
        </thead>
        <tbody>
          {#each eventData as event, index}
            <tr on:click={() => toggleDetails(index)}>
              <td>{event.eventname}</td>
              <td>
                {#if event.numberteams === 24}
                  정식전
                {:else}
                  {event.numberteams}x{event.teamSize}
                {/if}
              </td>
              <td>{event.Championship1.replace("_m", "")}</td>
              <td>
                {#if $myaccount === "admin" || $myaccount === "admin_m"}
                  {#if event.ok === "대기"}
                    <button class="simple-button small" on:click={() => approveEvent(index)}>승인</button>
                    <button class="simple-button small" on:click={() => deleteEvent(index)}>삭제</button>
                  {:else}
                    <button class="simple-button small" on:click={() => deleteandresetEvent(index)}>삭제</button>
                  {/if}
                {:else}
                  {event.ok}
                {/if}
              </td>
            </tr>
            {#if showDetails[index]}
              <tr>
                <td colspan="4">
                  <div class="details">
                    <strong>토너먼트 정보</strong><br />
                    주최자: {event.Eventhost.replace("_m", "")}<br />
                    우승: {event.Championship1 ? event.Championship1.replace("_m", "") : ""}
                    {event.Championship2 ? event.Championship2.replace("_m", "") : ""}
                    {event.Championship3 ? event.Championship3.replace("_m", "") : ""}
                    {event.Championship4 ? event.Championship4.replace("_m", "") : ""}<br />
                    준우승: {event.Runner_up1 ? event.Runner_up1.replace("_m", "") : ""}
                    {event.Runner_up2 ? event.Runner_up2.replace("_m", "") : ""}
                    {event.Runner_up3 ? event.Runner_up3.replace("_m", "") : ""}
                    {event.Runner_up4 ? event.Runner_up4.replace("_m", "") : ""}<br />
                    3위: {event.Place3rd1 ? event.Place3rd1.replace("_m", "") : ""}
                    {event.Place3rd2 ? event.Place3rd2.replace("_m", "") : ""}
                    {event.Place3rd3 ? event.Place3rd3.replace("_m", "") : ""}
                    {event.Place3rd4 ? event.Place3rd4.replace("_m", "") : ""}
                  </div>
                </td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
  
  {#if $myaccount}
  <div class="fixed-button-div">
    <button class="simple-button" on:click={() => form.set("newevent")}>등록하기</button>
    </div>
  {/if}
  

  <style>
table tr td:first-child, table tr th:first-child {
  width: 35%; /* 첫 번째 열 */
  
}
table tr td:nth-child(2), table tr th:nth-child(2) {
  width: 15%; /* 두 번째 열 */
}
table tr td:nth-child(3), table tr th:nth-child(3) {
  width: 25%; /* 세 번째 열 */
}
table tr td:nth-child(4), table tr th:nth-child(4) {
  width: 30%; /* 네 번째 열 */
}

.small {
font-size: 0.7rem;
padding: 3px;
}

.details{
text-align: left;
}

  </style>