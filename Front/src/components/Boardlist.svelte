<script lang="ts">
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";
    import { formatDate, page, category, myaccount, mode } from "../store";
  
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
  
    onMount(() => {
      fetchList($category);
    });
  
    function changepage(index: number): void {
      page.set($page + index);
      fetchList($category);
    }
  
    const modepage: string = $mode ? '/mpk' : '/babapk';
  
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
              title: "검색 결과가 없습니다",
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
        const response = await fetch(url);
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const responsedata: Post[] = await response.json();
        List_data = responsedata.map((item) => ({
          ...item,
          date: formatDate(item.date),
        }));
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
  <Link to={`${modepage}/write`} class="simple-button">작성하기</Link>
</div>
{/if}

    <select
      class="input-text"
      bind:value={$category}
      on:change={() => fetchList($category)}
    >
      <option value="all">모든 글 보기</option>
      <option value="free">자유 글 보기</option>
      <option value="trade">거래 글 보기</option>
      <option value="setting">공략 글 보기</option>
    </select>
  
    <input class="input-text" type="text" bind:value={word} />
    <button class="simple-button small" on:click={() => fetchSearch($category)}>검색</button>
  
  
  <!-- 테이블 구조 -->
  <table>
    <thead>
      <tr>
        <th class="table-head_board_date">날짜</th>
        <th class="table-head_board_title">제목</th>
        <th class="table-head_board_writter">작성자</th>
        <th class="table-head_board_views">조회수</th>
      </tr>
    </thead>
    <tbody>
      {#if loading}
        <tr>
          <td colspan="4">로딩 중...</td>
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
      <button class="simple-button" on:click={() => changepage(-1)}>이전</button>
    {/if}
    {#if List_data.length === 20}
      <button class="simple-button" on:click={() => changepage(1)}>다음</button>
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
  