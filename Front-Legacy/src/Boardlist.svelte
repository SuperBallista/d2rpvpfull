<script>
  let word = null;
  let loading = true;
  let errormsg = null;
  let List_data = [];
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";
  import { formatDate, page, category, nickname, mode } from "./store.js";
  onMount(() => {
    fetchList($category);
  });

  function changepage(index) {
    page.set($page + index);
    fetchList($category);
  }

  const modepage = $mode? '/mpk' : '/babapk' ;

  // 검색 기능

  async function fetchSearch(category) {
    try {
      const url = `/board/search?data=${category}&find=${word}`;

      // GET 요청을 보냅니다.
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      let responsedata = await response.json();
      if (responsedata.length == 0) {
        List_data = [
          {
            post_id: "-",
            date: "-",
            title: "검색 결과가 없습니다",
            writter: "-",
            views: "-",
          },
        ];
      } else {
        List_data = responsedata;
        // 날짜 포맷팅 적용
        List_data = List_data.map((item) => ({
          ...item,
          date: formatDate(item.date),
        }));
      }
      loading = false;
    } catch (error) {
      console.error("Error:", error);
      errormsg = error;
    }
  }

  // 카테고리에 따라 보여주는 기능

  async function fetchList(category) {
    try {
      const url = `/board/list?data=${category}&page=${$page}`;

      // GET 요청을 보냅니다.
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      List_data = await response.json();
      loading = false;
      // 날짜 포맷팅 적용
      List_data = List_data.map((item) => ({
        ...item,
        date: formatDate(item.date),
      }));
      word = "";
    } catch (error) {
      console.error("Error:", error);
      errormsg = error;
    }
  }
</script>
<svelte:head>
    <title>D2RPvP 커뮤니티</title>
</svelte:head>
<div class="main_data flexbox_right">
  <select
    class="namewidth black"
    bind:value={$category}
    on:change={() => fetchList($category)}
  >
    <option value="all">모든 글 보기</option>
    <option value="free">자유 글 보기</option>
    <option value="trade">거래 글 보기</option>
    <option value="setting">공략 글 보기</option>
  </select>

  <input class="namewidth black" type="text" bind:value={word} /><button
    on:click={() => fetchSearch($category)}>검색</button
  >
</div>
{#if $nickname}
  <div class="right main_data">
    <Link to={`${modepage}/write`} class="button">작성하기</Link>
  </div>
{/if}

<div class="table-outline main_data">
  <div class="table-head">
    <div class="table-head_board_date table-contents_cell">날짜</div>
    <div class="table-head_board_title table-contents_cell">제목</div>
    <div class="table-head_board_writter table-contents_cell">작성자</div>
    <div class="table-head_board_views table-contents_right-cell">조회수</div>
  </div>
  {#if loading}
    <p>로딩 중...</p>
  {:else if errormsg}
    <p>Error: {errormsg}</p>
  {:else}
    {#each List_data as { post_id, date, title, writter, views }}
      <div class="table-contents-wrapper">
        <Link to="{modepage}/post/{post_id}">
          <div class="table-contents">
            <!-- 날짜 -->
            <div class="table-contents_date table-contents_cell">
              {#if date === formatDate(new Date())}new{:else}{date}{/if}
            </div>
            <!-- 제목 -->
            <div class="table-contents_title table-contents_cell fontBasic">
              {title}
            </div>
            <!-- 작성자 -->
            <div class="table-contents_writter table-contents_cell">
              {writter}
            </div>
            <!-- 조회수 -->
            <div class="table-contents_views table-contents_cell">
              {views}
            </div>
          </div></Link
        >
      </div>
    {/each}
  {/if}
  <div class="pagination">
    {#if $page != 1}
      <button on:click={() => changepage(-1)}>이전</button>
    {/if}
    {#if List_data.length === 20}
      <button on:click={() => changepage(1)}>다음</button>
    {/if}
  </div>
</div>

<style>
    .fontBasic{
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

    .table-contents:hover {
text-decoration: underline;

  }

  .table-head_board_date,
  .table-contents_date {
    width: 15%;
  }

  .table-head_board_title,
  .table-contents_title {
    width: 40%;
  }

  .table-head_board_writter,
  .table-contents_writter {
    width: 25%;
  }

  .table-head_board_views,
  .table-contents_views {
    width: 20%;
  }
  .right {
    text-align: right;
  }

  .flexbox_right {
    display: flex;
    justify-content: right;
  }
  .namewidth {
    margin: 10px;
  }
  .flexbox_right .black {
    background-color: #000;
  }
</style>
