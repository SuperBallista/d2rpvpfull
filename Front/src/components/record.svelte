<script lang="ts">
    import { onMount } from "svelte";
    import {
      nicknames,
      fetchNicknames,
      myaccount,
      key,
      mode,
      SecurityFetch, form
    } from "../store.js";
  
    let recordData: any[] = [];
    let loading = true;
    let error = null;
    let currentPage = 1;
    const itemsPerPage = 10;
    let filter = "All";
    let filteredData: any[] = [];
    let paginatedData: any[] = [];
  
    async function fetchData() {
      const endpoint = $mode ? "/record/data?mode=true" : "/record/data?mode=false";
      try {
        await fetchNicknames($mode);
        const response = await SecurityFetch(endpoint, "GET");
        if (!response.ok) throw new Error("연결 에러입니다");
  
        recordData = await response.json();
        filteredData = applyFilter(recordData);
        updatePaginatedData();
      } catch (error: unknown) {
        alert("서버 오류가 발생하여 자료를 불러올 수 없습니다");
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
  
    function changePage(page: number) {
      currentPage = page;
      updatePaginatedData();
    }
  
    // 필터링 시 `_m` 제거 후 비교
    function applyFilter(data: any[]) {
  if (filter === "All") return data;

  return data.filter((item: any) => 
    item.winner && item.loser && // 속성이 정의된 경우에만 필터링
    (
      item.winner.replace("_m", "") === filter || 
      item.loser.replace("_m", "") === filter
    )
  );
}
    function updatePaginatedData() {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      paginatedData = filteredData.slice(start, end);
    }
  
    $: totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
    function handleFilterChange(event: Event) {
      const target = event.target as HTMLInputElement;
      filter = validateInput(target.value, $nicknames) || "All";
      currentPage = 1;
      filteredData = applyFilter(recordData);
      updatePaginatedData();
    }
  
    $: visiblePages = getVisiblePages(currentPage, totalPages);
  
    function getVisiblePages(currentPage: number, totalPages: number) {
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
  
    function validateInput(value: string, options: string[]): string | null {
      return options.includes(value) ? value : "All";
    }
  
    async function delete_row(OrderNum: number) {
      const data = { OrderNum: OrderNum, mode: $mode };
      try {
        const response = await SecurityFetch("/record/delete", "DELETE", data);
        if (response.status === 200) {
          alert("삭제 완료하였습니다");
          fetchData();
        } else {
          alert(`오류 발생: ${response.status}`);
        }
      } catch (error: unknown) {
        alert(`오류 발생: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
      }
    }
  </script>
  
  <div class="filter">
    <input
      list="nicknames_filter"
      bind:value={filter}
      on:blur={handleFilterChange}
      class="input-text"
      placeholder="필터 선택"
    />
    <datalist id="nicknames_filter">
        <option value="All">모두 보기</option>
        {#each $nicknames.map((n: string) => n.replace("_m", "")) as option}
          <option value={option}>{option}</option>
        {/each}
      </datalist>  </div>
  
  <div class="table-outline">
    {#if loading}
      <p>로딩 중...</p>
    {:else if error}
      <p>Error: {error}</p>
    {:else}
      <table class="data-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>승자</th>
            <th>패자</th>
            <th>날짜</th>
            {#if $myaccount === "admin_m" || $myaccount === "admin"}
              <th>관리</th>
            {/if}
          </tr>
        </thead>
        <tbody>
          {#each paginatedData as { orderNum, winner, loser, date }}
            <tr>
              <td>{orderNum}</td>
              <td>{winner.replace("_m", "")}</td>
              <td>{loser.replace("_m", "")}</td>
              <td>{date}</td>
              {#if $myaccount === "admin_m" || $myaccount === "admin"}
                <td>
                  <button class="simple-button small" on:click={() => delete_row(orderNum)}>삭제</button>
                </td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
      <div class="pagination">
        {#if currentPage > 1}
          <button class="simple-button" on:click={() => changePage(1)}>처음</button>
          <button class="simple-button" on:click={() => changePage(currentPage - 1)}>이전</button>
        {/if}
        {#each visiblePages as page}
          <button class={page===currentPage? "emphasis-button" : "simple-button" } on:click={() => changePage(page)}>
            {page}
          </button>
        {/each}
        {#if currentPage < totalPages}
          <button class="simple-button" on:click={() => changePage(currentPage + 1)}>다음</button>
          <button class="simple-button" on:click={() => changePage(totalPages)}>마지막</button>
        {/if}
      </div>
    {/if}


    {#if $myaccount != "" && $myaccount != "admin_m" && $myaccount != "admin"}
      <div class="fixed-button-div">
        <button class="simple-button" on:click={() => form.set("recordcreate")}>기록하기</button>
        <button class="simple-button" on:click={() => form.set("recordok")}>승인하기</button>
      </div>
    {/if}

  </div>
  

  <style>
table tr td:first-child, table tr th:first-child {
  width: 10%; /* 첫 번째 열 */
}
table tr td:nth-child(2), table tr th:nth-child(2) {
  width: 30%; /* 두 번째 열 */
}
table tr td:nth-child(3), table tr th:nth-child(3) {
  width: 30%; /* 세 번째 열 */
}
table tr td:nth-child(4), table tr th:nth-child(4) {
  width: 20%; /* 네 번째 열 */
}
table tr td:nth-child(5), table tr th:nth-child(5) {
  width: 10%; /* 다섯 번째 열 */
}

.filter{
width: 200px;    
}

.small {
font-size: 0.7rem;
padding: 3px;
}

</style>