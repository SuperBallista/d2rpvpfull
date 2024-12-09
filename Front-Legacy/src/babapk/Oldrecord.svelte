<script>
  import { onMount } from "svelte";
  import { nicknames, fetchNicknames, mode } from "../store.js";

  let recordData = [];
  let loading = true;
  let error = null;
  let showDetails = [];
  let currentPage = 1;
  const itemsPerPage = 10;
  let filter = "All";
  let filteredData = [];
  let paginatedData = [];

  $: totalPages = Math.ceil(filteredData.length / itemsPerPage);

  async function fetchData() {
    try {
      fetchNicknames($mode); // 닉네임을 가져옴
      const response = await fetch("/old-records/records/b-user");
      if (!response.ok) {
        throw new Error("연결 에러입니다");
      }
      recordData = await response.json();
      showDetails = new Array(recordData.length).fill(false); // showDetails 배열 초기화
      filteredData = applyFilter(recordData); // 데이터가 로드되면 초기 필터링
      updatePaginatedData(); // 페이지네이션 데이터 초기화
    } catch (err) {
      error = err;
    } finally {
      loading = false;
    }
  }

  function toggleDetails(index) {
    showDetails[index] = !showDetails[index];
    showDetails = [...showDetails]; // 배열을 업데이트하여 Svelte가 반응하도록 함
  }

  function handleKeyDown(event, index) {
    if (event.key === "Enter" || event.key === " ") {
      toggleDetails(index);
    }
  }

  function changePage(page) {
    currentPage = page;
    updatePaginatedData(); // 페이지 변경 시 페이지네이션 데이터 업데이트
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

  function validateInput(value, options) {
    return options.includes(value) ? value : "All";
  }

  function handleFilterChange(event) {
    filter = validateInput(event.target.value, $nicknames);
    currentPage = 1; // 필터 변경 시 페이지를 첫 페이지로 초기화
    filteredData = applyFilter(recordData);
    updatePaginatedData(); // 페이지네이션 데이터 초기화
  }

  function getLastMonth() {
    const date = new Date(); // 현재 날짜
    date.setMonth(date.getMonth() - 1); // 한 달 빼기

    const year = date.getFullYear(); // 연도
    const month = date.getMonth() + 1; // 월 (0부터 시작하므로 1을 더해줌)

    return { year, month };
  }

  const lastMonth = getLastMonth();

  let yearmonth = [];
  let lookingdata = [];
  let data = [];
  let selectedYearMonth = lastMonth; // 지난달을 기본값으로 설정

  // 두 번째 테이블 관련 변수
  let secondTableCurrentPage = 1;
  const secondTableItemsPerPage = 10;
  let secondTablePaginatedData = [];

  $: secondTableTotalPages = Math.ceil(
    lookingdata.length / secondTableItemsPerPage
  );

  function secondTableChangePage(page) {
    secondTableCurrentPage = page;
    updateSecondTablePaginatedData(); // 페이지 변경 시 페이지네이션 데이터 업데이트
  }

  function updateSecondTablePaginatedData() {
    const start = (secondTableCurrentPage - 1) * secondTableItemsPerPage;
    const end = start + secondTableItemsPerPage;
    secondTablePaginatedData = lookingdata.slice(start, end);
  }

  onMount(async () => {
    await loadoldrecord();
    fetchData();
  });

  async function loadoldrecord() {
    try {
      const response = await fetch("/loadoldrecord");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      yearmonth = result.yearmonth;
      data = result.data;
      filterData(selectedYearMonth); // 기본값으로 필터링
    } catch (error) {
      alert("DB 조회 실패: " + error.message);
    }
  }

  function filterData(ym) {
    selectedYearMonth = ym;
    lookingdata = data.filter(
      (item) => item.year === ym.year && item.month === ym.month
    );
    updateSecondTablePaginatedData(); // 필터링 후 페이지네이션 데이터 업데이트
  }

  function getVisiblePages(currentPage, totalPages) {
    const maxVisible = 5; // Maximum visible pages at once
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

  $: visiblePages = getVisiblePages(currentPage, totalPages);
  $: secondTableVisiblePages = getVisiblePages(
    secondTableCurrentPage,
    secondTableTotalPages
  );
</script>
<svelte:head>
    <title>babapk 지난 기록</title>
</svelte:head>

<!-- 두 번째 테이블 -->
<div class="main_data">
  <select
    class="namewidth center"
    on:change={(e) => filterData(yearmonth[e.target.selectedIndex])}
  >
    {#each yearmonth as { year, month }}
      <option
        value={year + "년" + month + "월"}
        selected={year === selectedYearMonth.year &&
          month === selectedYearMonth.month}
      >
        {year + "년" + month + "월"}
      </option>
    {/each}
  </select>
</div>
<div class="main_data table-outline">
  <div class="table-head">
    <div class="table-rank">순위</div>
    <div class="table-nickname">닉네임</div>
    <div class="table-tscore">총점</div>
  </div>
  {#each secondTablePaginatedData as { Nickname, tscore }, index}
    <div class="table-contents-wrapper">
      <div class="table-contents">
        <div class="table-rank">
          {index + 1 + (secondTableCurrentPage - 1) * secondTableItemsPerPage}
        </div>
        <div class="table-nickname">{Nickname}</div>
        <div class="table-tscore">{Math.round(tscore)}</div>
      </div>
    </div>
  {/each}
  <div class="pagination">
    {#if secondTableCurrentPage > 1}
      <button on:click={() => secondTableChangePage(1)}>First</button>
      <button on:click={() => secondTableChangePage(secondTableCurrentPage - 1)}
        >Previous</button
      >
    {/if}

    {#each secondTableVisiblePages as page}
      <button
        class:active={secondTableCurrentPage === page}
        on:click={() => secondTableChangePage(page)}
      >
        {page}
      </button>
    {/each}

    {#if secondTableCurrentPage < secondTableTotalPages}
      <button on:click={() => secondTableChangePage(secondTableCurrentPage + 1)}
        >Next</button
      >
      <button on:click={() => secondTableChangePage(secondTableTotalPages)}
        >Last</button
      >
    {/if}
  </div>
</div>

<!-- 첫 번째 테이블 -->
<br />
<br />
<br />

<div class="filter">
  <input
    list="nicknames_list"
    bind:value={filter}
    on:blur={handleFilterChange}
    class="namewidth center"
    placeholder="필터 선택"
  />
  <datalist id="nicknames_list">
    <option value="All">전체 보기</option>
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
    {#each paginatedData as { OrderNum, Winner, Loser, Date, WScore, LScore }, index (index)}
      <div class="table-contents-wrapper">
        <div
          class="table-contents"
          on:click={() =>
            toggleDetails(index + (currentPage - 1) * itemsPerPage)}
          on:keydown={(event) =>
            handleKeyDown(event, index + (currentPage - 1) * itemsPerPage)}
        >
          <div class="table-contents_no table-contents_cell">{OrderNum}</div>
          <div class="table-contents_winner table-contents_cell">{Winner}</div>
          <div class="table-contents_loser table-contents_cell">{Loser}</div>
          <div class="table-contents_date table-contents_right-cell">
            {Date}
          </div>
        </div>
        {#if showDetails[index + (currentPage - 1) * itemsPerPage]}
          <div
            class="table-contents_detail {showDetails[
              index + (currentPage - 1) * itemsPerPage
            ]
              ? 'show'
              : ''}"
          >
            승자 점수: {WScore} <br />
            패자 점수: {LScore}
          </div>
        {/if}
      </div>
    {/each}
    <div class="pagination">
      {#if currentPage > 1}
        <button on:click={() => changePage(1)}>First</button>
        <button on:click={() => changePage(currentPage - 1)}>Previous</button>
      {/if}

      {#each visiblePages as page}
        <button
          class:active={currentPage === page}
          on:click={() => changePage(page)}
        >
          {page}
        </button>
      {/each}

      {#if currentPage < totalPages}
        <button on:click={() => changePage(currentPage + 1)}>Next</button>
        <button on:click={() => changePage(totalPages)}>Last</button>
      {/if}
    </div>
  {/if}
</div>

<style>
  .table-rank {
    width: 25%;
  }
  .table-nickname {
    width: 45%;
  }
  .table-tscore {
    width: 30%;
  }

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
