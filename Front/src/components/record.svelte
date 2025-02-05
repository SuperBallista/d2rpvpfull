<script lang="ts">
  import { onMount } from "svelte";
  import {
    nicknames,
    fetchNicknames,
    myaccount,
    key,
    mode,
    admin,
    lang,
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
  let newdata:boolean = false

  async function fetchData() {
    console.log($mode)
    const endpoint = "/record/data?mode="+ $mode;
    try {
      await fetchNicknames($mode);
      const response = await SecurityFetch(endpoint, "GET");
      if (!response.ok) throw new Error("연결 에러입니다");

      recordData = await response.json();
      filteredData = applyFilter(recordData);
      updatePaginatedData();
    } catch (error: unknown) {
      alert($lang ? "서버 오류가 발생하여 자료를 불러올 수 없습니다" : "Server Error");
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    const unsubscribe = key.subscribe(() => {
      fetchData();
      checkRecord();
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
    item.winner.replace("_m", "").replace("_z","") === filter || 
    item.loser.replace("_m", "").replace("_z","") === filter
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
        alert($lang ? "삭제 완료하였습니다" : "Remove Complete");
        fetchData();
      } else {
        alert(`오류 발생: ${response.status}`);
      }
    } catch (error: unknown) {
      alert(`Error : ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
    }
  }


  // 게임 데이터를 불러오는 함수
  async function checkRecord() {

const endpoint = "/record/pending";
const data = {mode: $mode} 
if ($myaccount) {
try {
  const response = await SecurityFetch(endpoint, "POST", data);
  if (!response.ok) 
  {throw new Error(`오류 발생: ${response.status}`);}
 const checkData:any[] = await response.json();
 
if (checkData.length===0)
{newdata = false}
else
{newdata = true}
 
} catch (error) {
  console.error("Error :", error);
}
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
    <p>{$lang ? "로딩 중" : "Loading"}...</p>
  {:else if error}
    <p>Error: {error}</p>
  {:else}
    <table class="data-table">
      <thead>
        <tr>
          <th>{$lang ? "번호" : "No."}</th>
          <th>{$lang ? "승자" : "Win"}</th>
          <th>{$lang ? "패자" : "Lose"}</th>
          <th>{$lang ? "날짜" : "Date"}</th>
          {#if $admin.includes($mode)}
            <th>{$lang ? "삭제" : "Set"}</th>
          {/if}
        </tr>
      </thead>
      <tbody>
        {#each paginatedData as { orderNum, winner, loser, date }}
          <tr>
            <td>{orderNum}</td>
            <td>{winner.replace("_m", "").replace("_z","")}</td>
            <td>{loser.replace("_m", "").replace("_z","")}</td>
            <td>{date}</td>
            {#if $admin.includes($mode)}
              <td>
                <button class="simple-button small" on:click={() => delete_row(orderNum)}>{$lang ? "삭제" : "Remove"}</button>
              </td>
            {/if}
          </tr>
        {/each}
      </tbody>
    </table>
    <div class="pagination">
      {#if currentPage > 1}
        <button class="simple-button" on:click={() => changePage(1)}>{$lang ? "처음" : "First"}</button>
        <button class="simple-button" on:click={() => changePage(currentPage - 1)}>{$lang ? "이전" : "Before"}</button>
      {/if}
      {#each visiblePages as page}
        <button class={page===currentPage? "emphasis-button" : "simple-button" } on:click={() => changePage(page)}>
          {page}
        </button>
      {/each}
      {#if currentPage < totalPages}
        <button class="simple-button" on:click={() => changePage(currentPage + 1)}>{$lang ? "다음" : "Next"}</button>
        <button class="simple-button" on:click={() => changePage(totalPages)}>{$lang ? "마지막" : "Last"}</button>
      {/if}
    </div>
  {/if}


  {#if $myaccount}
    <div class="fixed-button-div">
      <button class="simple-button" on:click={() => form.set("recordcreate")}>{$lang ? "기록하기" : "Record"}</button>
      <button class="simple-button" on:click={() => form.set("recordok")}>{$lang ? "승인하기" : "Accept"}
       {#if newdata}       
        <span class="badge">NEW</span>
      {/if}        
      </button>
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