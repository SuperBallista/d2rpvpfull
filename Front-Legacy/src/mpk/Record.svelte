<script>
  import { onMount } from "svelte";
  import {
    nicknames,
    fetchNicknames,
    nickname,
    key,
    clickformopen,
    mode,
    SecurityFetch
  } from "../store.js";

  let recordData = [];
  let loading = true;
  let error = null;
  let showDetails = [];
  let currentPage = 1;
  const itemsPerPage = 10;
  let filter = "All";
  let filteredData = [];
  let paginatedData = [];

  // 데이터를 가져오는 함수
  async function fetchData() {
    try {
      await fetchNicknames($mode); // 닉네임을 가져옴
      const response = await SecurityFetch("/record/data?mode=true", "GET");
      if (!response.ok) throw new Error("연결 에러입니다");

      recordData = await response.json();
      showDetails = new Array(recordData.length).fill(false); // showDetails 배열 초기화
      filteredData = applyFilter(recordData); // 데이터가 로드되면 초기 필터링
      updatePaginatedData(); // 페이지네이션 데이터 초기화
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  onMount(async () => {
    const unsubscribe = key.subscribe((value) => {
      fetchData();
    });

    return () => {
      unsubscribe();
    };
  });

  function toggleDetails(index) {
    showDetails[index] = !showDetails[index];
    showDetails = [...showDetails];
  }

  function handleKeyDown(event, index) {
    if (event.key === "Enter" || event.key === " ") {
      toggleDetails(index);
    }
  }

  function changePage(page) {
    currentPage = page;
    updatePaginatedData();
  }

  function applyFilter(data) {
    if (filter === "All") {
      return data;
    }
    return data.filter(
      (item) => item.Winner === filter || item.Loser === filter
    );
  }

  function updatePaginatedData() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    paginatedData = filteredData.slice(start, end);
  }

  $: totalPages = Math.ceil(filteredData.length / itemsPerPage);

  function handleFilterChange(event) {
    filter = validateInput(event.target.value, $nicknames) || "All";
    currentPage = 1;
    filteredData = applyFilter(recordData);
    updatePaginatedData();
  }

  $: visiblePages = getVisiblePages(currentPage, totalPages);

  function getVisiblePages(currentPage, totalPages) {
    const maxVisible = 5;
    const pages = [];

    let start = Math.max(currentPage - Math.floor(maxVisible / 2), 1);
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - maxVisible + 1, 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  function validateInput(value, options) {
    return options.includes(value) ? value : null;
  }

  async function delete_row(OrderNum) {
    const data = { OrderNum: OrderNum, mode: $mode };

    try {
      const response = await SecurityFetch("/record/delete/m-user", "DELETE", data);
      if (response && response.status === 200) {
        alert("삭제 완료하였습니다");
        fetchData();
      } else {
        alert(`오류 발생: ${response.status}`);
      }
    } catch (error) {
      alert("오류 발생 :", error);
    }
  }
</script>
<svelte:head>
    <title>mpk 대전기록</title>
</svelte:head>
<div class="filter">
  <input
    list="nicknames_list"
    bind:value={filter}
    on:blur={handleFilterChange}
    class="namewidth center"
    placeholder="필터 선택"
  />
  <datalist id="nicknames_list">
    <option value="All">모두 보기</option>
    {#each $nicknames as option}
      <option value={option}>{option}</option>
    {/each}
  </datalist>
</div>

<div class="table-outline main_data">
  <div class="table-head">
    <div class="table-head_no table-contents_cell">번호</div>
    <div class="table-head_winner table-contents_cell">승자</div>
    <div class="table-head_loser table-contents_cell">패자</div>
    <div class="table-head_date table-contents_right-cell">날짜</div>
  </div>
  {#if loading}
    <p>로딩 중...</p>
  {:else if error}
    <p>Error: {error.message}</p>
  {:else}
    {#each paginatedData as { orderNum, winner, loser, date }, index}
      <div class="table-contents-wrapper">
        <div
          class="table-contents"
          on:click={() => toggleDetails(index)}
          on:keydown={(event) => handleKeyDown(event, index)}
        >
          <div class="table-contents_no table-contents_cell">{orderNum}</div>
          <div class="table-contents_winner table-contents_cell">{winner.replace("_m","")}</div>
          <div class="table-contents_loser table-contents_cell">{loser.replace("_m","")}</div>
          <div class="table-contents_date table-contents_right-cell">{date}</div>
        </div>
        {#if showDetails[index]}
          <div class="table-contents_detail {showDetails[index] ? 'show' : ''}">
            {#if $nickname==="admin_m"}
            <button on:click={() => delete_row(orderNum)}>삭제</button>
           {/if}
          </div>
        {/if}
      </div>
    {/each}
    <div class="pagination">
      {#if currentPage > 1}
        <button on:click={() => changePage(1)}>First</button>
        <button on:click={() => changePage(currentPage - 1)}>이전</button>
      {/if}

      {#each visiblePages as page}
        <button class:active={currentPage === page} on:click={() => changePage(page)}>
          {page}
        </button>
      {/each}
      {#if currentPage < totalPages}
        <button on:click={() => changePage(currentPage + 1)}>다음</button>
        <button on:click={() => changePage(totalPages)}>마지막</button>
      {/if}
    </div>
  {/if}
</div>

{#if $nickname != null && $nickname != "admin_m"}
  <div class="fixed-button-div">
    <button on:click={() => clickformopen("newrecord")}>등록<br />하기</button>
    <button on:click={() => clickformopen("recordok")}>승인<br />하기</button>
  </div>
{/if}

<style>
  .filter {
    margin-bottom: 20px;
    text-align: center;
  }

  .table-head_no,
  .table-contents_no {
    width: 10%;
  }

  .table-head_winner,
  .table-contents_winner {
    width: 35%;
  }

  .table-head_loser,
  .table-contents_loser {
    width: 35%;
  }

  .table-head_date,
  .table-contents_date {
    width: 20%;
  }

  .table-contents {
    border-top: 3px solid white;
    cursor: pointer; /* 클릭 가능한 커서 */
  }

  .table-contents_detail {
    display: none;
    text-align: left;
    padding: 10px;
    border-top: 3px solid white;
    background-color: #222d; /* 세부 정보 배경색 추가 */
  }

  .table-contents_detail.show {
    display: block;
  }

  .pagination {
    display: flex;
    justify-content: center;
    background-color: black;
  }

  .pagination button {
    margin: 0 5px;
    padding: 5px 10px;
    cursor: pointer;
    background-color: #555d;
  }

  .pagination button.active {
    font-weight: bold;
    background-color: #888d;
  }

  .table-contents:hover {
    text-decoration: underline;
  }
</style>
