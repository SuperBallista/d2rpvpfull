<script lang="ts">
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";
    import { formatDate, page, category, myaccount, mode, SecurityFetch, lang } from "../store";
  
    interface Post {
      post_id: string;
      date: string;
      title: string;
      writter: string;
      views: number;
    }
  
    let word: string | null = null;
    let loading: boolean = true;
    let errormsg: string | null = null;
    let List_data: Post[] = [];
    let next:boolean
  
    onMount(() => {
      fetchList($category);
    });
  
    function changepage(index: number): void {
      page.set($page + index);
      fetchList($category);
    }
  
    const modepage: string = "/" + $mode;
  
    // 검색 기능
    async function fetchSearch(category: string): Promise<void> {
      try {
        const url = `/board/search?data=${category}&find=${word}`;
        const response = await fetch(url);
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const responsedata: Post[] = await response.json();
        if (responsedata.length === 0) {
          List_data = [
            {
              post_id: "-",
              date: "-",
              title: $lang ? "검색 결과가 없습니다" : "No Data",
              writter: "-",
              views: 0,
            },
          ];
        } else {
          List_data = responsedata.map((item) => ({
            ...item,
            date: formatDate(item.date),
          }));
        }
        loading = false;
      } catch (error) {
        console.error("Error:", error);
        errormsg = error instanceof Error ? error.message : String(error);
      }
    }
  
    // 카테고리에 따라 보여주는 기능
    async function fetchList(category: string): Promise<void> {
      try {
        const url = `/board/list?data=${category}&page=${$page}`;
        const response = await SecurityFetch(url,"GET");
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const responsedata: Post[] = await response.json();

        List_data = responsedata.map((item) => ({
          ...item,
          date: formatDate(item.date),
        }));

        if (List_data.length===21)
        {List_data.pop
          next = true
        }
        else {
          next = false
        }

        loading = false;
        word = "";
      } catch (error) {
        console.error("Error:", error);
        errormsg = error instanceof Error ? error.message : String(error);
      }
    }
  </script>
  
  {#if $myaccount}
  <div class="fixed-button-div">
  <Link to={`${modepage}/write`} class="simple-button">{$lang ? "작성하기" : "Write"}</Link>
</div>
{/if}

    <select
      class="input-text"
      bind:value={$category}
      on:change={() => fetchList($category)}
    >
      <option value="all">{$lang ? "모든 글 보기" : "Show All Posts"}</option>
      <option value="free">{$lang ? "자유 글 보기" : "Show Free Posts"}</option>
      <option value="trade">{$lang ? "거래 글 보기" : "Show Trade Posts"}</option>
      <option value="setting">{$lang ? "공략 글 보기" : "Show Guide Posts"}</option>
    </select>
  
    <input class="input-text" type="text" bind:value={word} />
    <button class="simple-button small" on:click={() => fetchSearch($category)}>{$lang ? "검색" : "Search"}</button>
  
  
  <!-- 테이블 구조 -->
  <table>
    <thead>
      <tr>
        <th class="table-head_board_date">{$lang ? "날짜":"Date"}</th>
        <th class="table-head_board_title">{$lang ? "제목":"Title"}</th>
        <th class="table-head_board_writter">{$lang ? "작성자":"Writter"}</th>
        <th class="table-head_board_views">{$lang ? "조회수":"Views"}</th>
      </tr>
    </thead>
    <tbody>
      {#if loading}
        <tr>
          <td colspan="4">{$lang ? "로딩 중" : "Loading"}...</td>
        </tr>
      {:else if errormsg}
        <tr>
          <td colspan="4">Error: {errormsg}</td>
        </tr>
      {:else}
        {#each List_data as { post_id, date, title, writter, views }}
          <tr>
            <td>{#if date === formatDate(String(new Date()))}new{:else}{date}{/if}</td>
            <td>
              <Link to="{modepage}/post/{post_id}" class="fontBasic">{title}</Link>
            </td>
            <td>{writter}</td>
            <td>{views}</td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
  
  <div class="pagination">
    {#if $page != 1}
      <button class="simple-button" on:click={() => changepage(-1)}>{$lang ? "이전":"before"}</button>
    {/if}
    {#if next === true}
      <button class="simple-button" on:click={() => changepage(1)}>{$lang ? "다음" : "Next"}</button>
    {/if}
  </div>
  
  <style>
    table {
      width: 100%;
    }
  
  
    table tr td:first-child, table tr th:first-child {
  width: 15%; /* 첫 번째 열 */
}
table tr td:nth-child(2), table tr th:nth-child(2) {
  width: 40%; /* 두 번째 열 */
  
}
table tr td:nth-child(3), table tr th:nth-child(3) {
  width: 25%; /* 세 번째 열 */
}
table tr td:nth-child(4), table tr th:nth-child(4) {
  width: 20%; /* 네 번째 열 */
}

    .input-text {
      width: 130px;
    }
  
  
    .pagination {
      margin-top: 10px;
      text-align: center;
    }
    .small {
      padding: 5px;
    }
  </style>
  