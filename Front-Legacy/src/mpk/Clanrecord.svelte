<script>
    import { onMount } from "svelte";
    import {
      nickname,
      key,
      clickformopen,
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
        const response = await fetch("/clan/record", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"  // httpOnly 쿠키를 포함하여 요청
        });
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
  
 
    async function delete_row(OrderNum) {
      const data = { OrderNumber: OrderNum };
  
      try {
        const response = await SecurityFetch("/clan/delete/record", "DELETE", data);
        if (response && response.status === 200) {
          alert("클랜전 기록 삭제 완료하였습니다");
          fetchData();
        } else {
          alert(`오류 발생: ${response.status}`);
        }
      } catch (error) {
        alert("오류 발생 :", error);
      }
    }
  </script>
  
  
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
      {#each paginatedData as { OrderNumber, winner, loser, gameDate, result, winnerClan, loserClan }, index}
        <div class={result==="무"? "table-contents-wrapper yellow" : "table-contents-wrapper"}>
          <div
            class="table-contents"
            on:click={() => toggleDetails(index)}
            on:keydown={(event) => handleKeyDown(event, index)}
          >
            <div class="table-contents_no table-contents_cell">{OrderNumber}</div>
            <div class="table-contents_winner table-contents_cell">{winner.replace("_m","")}</div>
            <div class="table-contents_loser table-contents_cell">{loser.replace("_m","")}</div>
            <div class="table-contents_date table-contents_right-cell">{gameDate}</div>
          </div>
          {#if showDetails[index]}
            <div class="table-contents_detail {showDetails[index] ? 'show' : ''}">
                {result==="무" ? `무승부 경기입니다. ${winnerClan}, ${loserClan}` : `${winnerClan} 승, ${loserClan} 패` }
                {#if $nickname==="admin_m"}
              <button on:click={() => delete_row(OrderNumber)}>삭제</button>
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
      <button on:click={() => clickformopen("newclanrecord")}>등록<br />하기</button>
      <button on:click={() => clickformopen("clanrecordok")}>승인<br />하기</button>
    </div>
  {/if}
  
  <style>
  
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

    .yellow {
color: yellow;        
    }
  </style>
  