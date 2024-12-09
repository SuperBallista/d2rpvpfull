<script>
  import { nickname, key, clickformopen, SecurityFetch } from "../store.js";
  import { onMount } from "svelte";

  let eventData = [];
  let loading = true;
  let error = null;
  let showDetails = [];

  async function deleteandresetEvent(index) {
    try {
      const endpoint = "/event/m-user/cancel";
      const response = await SecurityFetch(endpoint, "DELETE", eventData[index]);

      if (response && response.ok) {
        alert("토너먼트 히스토리를 삭제하고 점수를 초기화하였습니다");
      }
    } catch (error) {
      alert("에러가 발생하였습니다: " + error.message);
    } finally {
      fetchData();
    }
  }

  async function approveEvent(index) {
    try {
      const endpoint = "/event/m-user/accept";
      const response = await SecurityFetch(endpoint, "POST", eventData[index]);

      if (response && response.status === 201) {
        alert("토너먼트 히스토리를 승인하였습니다");
      }
    } catch (error) {
      alert("에러가 발생하였습니다: " + error.message);
    } finally {
      fetchData();
    }
  }

  async function deleteEvent(index) {
    try {
      const endpoint = "/event/m-user/delete";
      const data = { eventname: eventData[index].eventname };
      const response = await SecurityFetch(endpoint, "DELETE", data);

      if (response && response.status === 200) {
        alert("토너먼트 히스토리를 삭제하였습니다");
      }
    } catch (error) {
      alert("에러가 발생하였습니다: " + error.message);
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

  function toggleDetails(index) {
    showDetails = [...showDetails]; // 배열 복사로 반응성 유지
    showDetails[index] = !showDetails[index];
  }

  function handleKeyDown(event, index) {
    if (event.key === "Enter" || event.key === " ") {
      toggleDetails(index);
    }
  }
</script>
<svelte:head>
    <title>mpk 토너먼트 기록하기</title>
</svelte:head>

<!-- UI 부분 -->
<div class="table-outline main_data">
  <div class="table-head">
    <div class="table-head_eventname table-contents_cell">대회명</div>
    <div class="table-head_member table-contents_cell">규모</div>
    <div class="table-head_allwinner table-contents_cell">우승자</div>
    <div class="table-head_ok table-contents_right">승인</div>
  </div>
  
  {#if loading}
    <p>로딩 중...</p>
  {:else if error}
    <p>Error: {error}</p>
  {:else}
    {#each eventData as event, index}
      <div class="table-contents-wrapper">
        <div class="table-contents" on:click={() => toggleDetails(index)} on:keydown={event => handleKeyDown(event, index)}>
          <div class="table-contents_eventname table-contents_cell">{event.eventname}</div>
          <div class="table-contents_member table-contents_cell">{#if event.numberteams === 24}정식전{:else}{event.numberteams}x{event.teamSize}{/if}</div>
          <div class="table-contents_allwinner table-contents_cell">{event.Championship1.replace("_m", "")}</div>

          {#if $nickname === "admin" || $nickname === "admin_m"}
            <div class="table-contents_ok table-contents_right">
              {#if event.ok === "대기"}
                <button on:click={() => approveEvent(index)}>승인</button>
                <button on:click={() => deleteEvent(index)}>삭제</button>
              {:else}
                <button on:click={() => deleteandresetEvent(index)}>삭제</button>
              {/if}
            </div>
          {:else}
            <div class="table-contents_ok table-contents_right">{event.ok}</div>
          {/if}
        </div>

        {#if showDetails[index]}
          <div class="table-contents_detail show">
            토너먼트 정보<br />
            주최자 : {event.Eventhost.replace("_m", "")}<br />
            우승 : {event.Championship1 ? event.Championship1.replace("_m", "") : ""}
            {event.Championship2 ? event.Championship2.replace("_m", "") : ""}
            {event.Championship3 ? event.Championship3.replace("_m", "") : ""}
            {event.Championship4 ? event.Championship4.replace("_m", "") : ""}<br />
            준우승 : {event.Runner_up1 ? event.Runner_up1.replace("_m", "") : ""}
            {event.Runner_up2 ? event.Runner_up2.replace("_m", "") : ""}
            {event.Runner_up3 ? event.Runner_up3.replace("_m", "") : ""}
            {event.Runner_up4 ? event.Runner_up4.replace("_m", "") : ""}<br />
            3위 : {event.Place3rd1 ? event.Place3rd1.replace("_m", "") : ""}
            {event.Place3rd2 ? event.Place3rd2.replace("_m", "") : ""}
            {event.Place3rd3 ? event.Place3rd3.replace("_m", "") : ""}
            {event.Place3rd4 ? event.Place3rd4.replace("_m", "") : ""}
          </div>
        {/if}
      </div>
    {/each}
  {/if}
</div>

{#if $nickname}
  <div class="fixed-button-div">
    <button on:click={() => clickformopen("newevent")}>등록<br />하기</button>
  </div>
{/if}

<style>
  .table-head_eventname, .table-contents_eventname { width: 30%; }
  .table-head_member, .table-contents_member { width: 15%; }
  .table-head_allwinner, .table-contents_allwinner { width: 25%; }
  .table-head_ok, .table-contents_ok { width: 35%; }
  .table-contents:hover { text-decoration: underline; }
  .table-contents_detail { display: none; }
  .table-contents_detail.show { display: block !important; }
</style>
