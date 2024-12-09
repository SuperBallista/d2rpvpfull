<script>
  import {
    nickname,
    key,
    clickformopen,
    SecurityFetch
  } from "../store.js";

  import { onMount } from "svelte";

  let eventData = [];
  let loading = true;
  let error = null;
  let showDetails = [];


  async function deleteandresetEvent(index) {
    try {
      const response = await SecurityFetch("/event/b-user/cancel", "DELETE", eventData[index]);

      if (response.ok) {
        alert("토너먼트 히스토리를 삭제하고 점수를 초기화하였습니다");
      }
    } catch (error) {
      alert("에러가 발생하였습니다:", error);
    } finally {
      fetchData();
    }
  }

  async function approveEvent(index) {
    try {
      const response = await SecurityFetch("/event/b-user/accept", "POST", eventData[index]);

      if (response.status === 201) {
        alert("토너먼트 히스토리를 승인하였습니다");
      }
    } catch (error) {
      alert("에러가 발생하였습니다:", error);
    } finally {
      fetchData();
    }
  }

  async function deleteEvent(index) {
    try {
      const response = await SecurityFetch("/event/b-user/delete", "DELETE", eventData[index]);

      if (response.ok) {
        alert("토너먼트 히스토리를 삭제하였습니다");
      }
    } catch (error) {
      alert("에러가 발생하였습니다:", error);
    } finally {
      fetchData();
    }
  }

  async function fetchData() {
    try {
      const response = await fetch("/event/b-user/history");
      if (!response.ok) {
        throw new Error("연결 에러입니다");
      }
      eventData = await response.json();

      // eventData 변환
      eventData = eventData.map((event) => ({
        ...event,
        ok: event.accept === 1 ? "대기" : event.accept === 2 ? "승인" : event.ok,
      }));

      showDetails = new Array(eventData.length).fill(false); // showDetails 배열 초기화
    } catch (err) {
      error = err;
    } finally {
      loading = false;
    }
  }

  // 컴포넌트가 마운트될 때 데이터를 구독
  onMount(() => {
    const unsubscribe = key.subscribe(() => {
      fetchData();
    });

    return () => {
      unsubscribe();
    };
  });

  // 각 항목의 details 보임 여부를 추적하는 상태
  showDetails = eventData.map(() => false);

  // 클릭 핸들러 함수
  function toggleDetails(index) {
    showDetails = showDetails.map((show, i) => (i === index ? !show : show));
  }

  // 키보드 핸들러 함수
  function handleKeyDown(event, index) {
    if (event.key === "Enter" || event.key === " ") {
      toggleDetails(index);
    }
  }
</script>
<svelte:head>
    <title>babapk 토너먼트 기록하기</title>
</svelte:head>

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
    <p>Error: {error.message}</p>
  {:else}
    {#each eventData as { eventname, numberteams, Championship1, Championship2, Championship3, Championship4, Runner_up1, Runner_up2, Runner_up3, Runner_up4, Place3rd1, Place3rd2, Place3rd3, Place3rd4, ok, teamSize, Eventhost }, index}
      <div class="table-contents-wrapper">
        <div
          class="table-contents"
          on:click={() => toggleDetails(index)}
          on:keydown={handleKeyDown}
        >
          <div class="table-contents_eventname table-contents_cell">
            {eventname}
          </div>
          <div class="table-contents_member table-contents_cell">
            {#if numberteams === 24}정규전{:else}
              {String(numberteams) + "x" + String(teamSize)}{/if}
          </div>
          <div class="table-contents_allwinner table-contents_cell">
            {Championship1}
          </div>
          {#if $nickname === "admin" || $nickname === "admin_m"}
            <div class="table-contents_ok table-contents_right">
              {#if ok === "대기"}
                <button on:click={() => approveEvent(index)}>승인</button
                ><button on:click={() => deleteEvent(index)}>삭제</button
                >{:else}
                <button on:click={() => deleteandresetEvent(index)}>삭제</button
                >{/if}
            </div>{:else}
            <div class="table-contents_ok table-contents_right">{ok}</div>{/if}
        </div>
        {#if showDetails[index]}
          <div class="table-contents_detail {showDetails[index] ? 'show' : ''}">
            토너먼트 정보<br />
            주최자 : {Eventhost}<br />
            우승 : {Championship1 ? Championship1 : ""}
            {Championship2 ? Championship2 : ""}
            {Championship3 ? Championship3 : ""}
            {Championship4 ? Championship4 : ""}<br />
            준우승 : {Runner_up1 ? Runner_up1 : ""}
            {Runner_up2 ? Runner_up2 : ""}
            {Runner_up3 ? Runner_up3 : ""}
            {Runner_up4 ? Runner_up4 : ""}<br />
            3위 : {Place3rd1 ? Place3rd1 : ""}
            {Place3rd2 ? Place3rd2 : ""}
            {Place3rd3 ? Place3rd3 : ""}
            {Place3rd4 ? Place3rd4 : ""}
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
  .table-head_eventname,
  .table-contents_eventname {
    width: 30%;
  }

  .table-head_member,
  .table-contents_member {
    width: 15%;
  }

  .table-head_allwinner,
  .table-contents_allwinner {
    width: 25%;
  }

  .table-head_ok,
  .table-contents_ok {
    width: 35%;
  }
  .table-contents:hover {
text-decoration: underline;

  }

</style>
