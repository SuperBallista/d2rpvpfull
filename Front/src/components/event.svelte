<script lang="ts">
    import { showMessageBox } from "../custom/customStore";
    import { myaccount, key, form, SecurityFetch, mode, admin, lang } from "../store";
    import { onMount } from "svelte";
  
    let eventData:any[] = [];
    let loading = true;
    let error:any = null;
    let showDetails:boolean[] = [];
    let memotext:string
    let noMemo = $lang ? "기록하기" : "Input memo"

    let wait = $lang ? "대기" : "Waiting"
    let Accept = $lang ? "승인" : "Accepted"
    
     function modify_memo(index:number) {
      if ($admin.includes($mode))
  {
      for (let i = 0; i < eventData.length; i++)
      {eventData[i].modify = false}
      memotext = eventData[index].memo
      eventData[index].modify = true
}
    }

    async function SaveMemo(index:number) {
     const data = {eventname: eventData[index].eventname, memotext: memotext, mode: $mode}
     if ($admin.includes($mode))
     {
     try{
      const response = await SecurityFetch("/event/memo","PATCH",data);
      if (response.status===200){
        
        showMessageBox("success", $lang? "메모 수정 완료":"Modified Completed",$lang ? "메모 수정을 완료했습니다":"This Memo Modified Completed.")

        fetchData();
      }
      else{
        showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
      }
    }
      catch (error)
      {
        showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
      }
          finally{
            eventData[index].modify = false
     }      
    }
  }

    async function deleteandresetEvent(index:number) {
      const data = {event: eventData[index], mode: $mode}
      try {
        const endpoint = `/event/cancel`;
        const response = await SecurityFetch(endpoint, "DELETE", data);
  
        if (response && response.status===200) {
          showMessageBox("success","토너먼트 히스토리 삭제", "토너먼트 히스토리를 삭제하고 점수를 초기화하였습니다")
        }
        else
        {
          showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
        }
      } catch (error) {
        showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
      } finally {
        fetchData();
      }
    }
  
    async function approveEvent(index:number) {
      const data = {event: eventData[index], mode: $mode }
      try {
        const endpoint = `/event/accept`;
        const response = await SecurityFetch(endpoint, "POST", data);
  
        if (response && response.status === 201) {
          showMessageBox("success","토너먼트 히스토리 승인", "토너먼트 히스토리를 승인하였습니다")
        }
        else{
          showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
        }
      } catch (error) {
        showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
      } finally {
        fetchData();
      }
    }
  
    async function deleteEvent(index:number) {
      try {
        const endpoint = `/event/delete`;
        const data = { event: eventData[index].eventname, mode: $mode };
        const response = await SecurityFetch(endpoint, "DELETE", data);

        if (response && response.status === 200) {
          showMessageBox("success","토너먼트 히스토리 삭제", "토너먼트 히스토리를 삭제하였습니다")
        }
        else {
          showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
        }
      } catch (error) {
        showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
      } finally {
        fetchData();
      }
    }
  
    async function fetchData() {
      try {
        const response = await SecurityFetch(`/event/history?mode=${$mode}`,"GET");
        if (!response.ok) {
          throw new Error("연결 에러입니다");
        }
        eventData = await response.json();
  
        eventData = eventData.map((event) => ({
          ...event,
          ok: event.accept === 1 ? wait : event.accept === 2 ? Accept : event.ok,
          modify: false
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
  
  <!-- 테이블 UI -->
  <div class="table-container">
    {#if loading}
      <p>{$lang ? "로딩 중" : "Loading"}...</p>
    {:else if error}
      <p>Error: {error}</p>
    {:else}
      <table>
        <thead>
          <tr>
            <th>{$lang ? "대회명" : "Title"}</th>
            <th>{$lang ? "규모" : "Size"}</th>
            <th>{$lang ? "우승자" : "Winner"}</th>
            <th>{$lang ? "승인" : "Accept"}</th>
          </tr>
        </thead>
        <tbody>
          {#each eventData as event, index}
            <tr on:click={() => toggleDetails(index)}>
              <td>{event.eventname}</td>
              <td>
                {#if event.numberteams === 24}
                  {$lang ? "정규전" : "Official"}
                {:else}
                  {event.numberteams}x{event.teamSize}
                {/if}
              </td>
              <td>{event.Championship1.replace("_m", "").replace("_z","")}</td>
              <td>
                {#if $admin.includes($mode)}
                  {#if event.ok === wait}
                    <button class="simple-button small" on:click={() => approveEvent(index)}>{$lang ? "승인" : "Accept"}</button>
                    <button class="simple-button small" on:click={() => deleteEvent(index)}>{$lang ? "삭제" : "Remove"}</button>
                  {:else}
                    <button class="simple-button small" on:click={() => deleteandresetEvent(index)}>{$lang ? "취소" : "Cancel"}</button>
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
                    <strong>{$lang ? "토너먼트 정보" : "Event Info"}</strong><br />
                    {$lang ? "주최자" : "Host"}: {event.Eventhost.replace("_m", "").replace("_z", "")}<br />
                    {$lang ? "우승" : "1st"}: {event.Championship1 ? event.Championship1.replace("_m", "").replace("_z", "") : ""}
                    {event.Championship2 ? event.Championship2.replace("_m", "").replace("_z", "") : ""}
                    {event.Championship3 ? event.Championship3.replace("_m", "").replace("_z", "") : ""}
                    {event.Championship4 ? event.Championship4.replace("_m", "").replace("_z", "") : ""}<br />
                    {$lang ? "준우승" : "2nd"}: {event.Runner_up1 ? event.Runner_up1.replace("_m", "").replace("_z", "") : ""}
                    {event.Runner_up2 ? event.Runner_up2.replace("_m", "").replace("_z", "") : ""}
                    {event.Runner_up3 ? event.Runner_up3.replace("_m", "").replace("_z", "") : ""}
                    {event.Runner_up4 ? event.Runner_up4.replace("_m", "").replace("_z", "") : ""}<br />
                    {$lang ? "3위" : "3rd"}: {event.Place3rd1 ? event.Place3rd1.replace("_m", "").replace("_z", "") : ""}
                    {event.Place3rd2 ? event.Place3rd2.replace("_m", "").replace("_z", "") : ""}
                    {event.Place3rd3 ? event.Place3rd3.replace("_m", "").replace("_z", "") : ""}
                    {event.Place3rd4 ? event.Place3rd4.replace("_m", "").replace("_z", "") : ""}<br/>
                    {$lang ? "메모" : "Memo"}: {#if event.modify}<input type="text" bind:value={memotext} class="memo-input" on:keydown={(e) => {
                      if (e.key === "Enter") SaveMemo(index);
                    }}/><button class="simple-button" on:click={() => SaveMemo(index)}>{$lang ? "작성":"Ok"}</button>
                    {:else}<span on:click={()=> modify_memo(index)} class={$admin.includes($mode) ? "modify" : "" }>{typeof event.memo === "string" ? event.memo : noMemo }</span>{/if}
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
    <button class="simple-button" on:click={() => form.set("newevent")}>{$lang ? "기록하기" : "Record"}</button>
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
  width: 20%; /* 세 번째 열 */
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

.modify{
  cursor: pointer;
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