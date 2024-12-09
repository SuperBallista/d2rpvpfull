<script>
  import { onMount } from "svelte";
  import { formatDate, nickname, modify_postid, mode, SecurityFetch } from "./store.js";
  import { Link, navigate } from "svelte-routing";

  let id;
  let List_data = [];
  let loading = true;
  let errormsg = null;
  let comment = [];
  let comment_content = "";

  const modepage = $mode ? '/mpk' : '/babapk';

  // 게시물 가져오기
  async function fetchPost(id) {
    try {
      const response = await fetch(`/post?post_id=${id}`);
      const data = await response.json();
      List_data = data || [];
      loading = false;
    } catch (error) {
      loading = false;
      errormsg = `네트워크 오류: ${error.message}`;
    }
  }

  // 댓글 가져오기
  async function fetchcomment(id) {
    try {
      const response = await fetch(`/board/comments?post_id=${id}`);
      comment = await response.json();
    } catch (error) {
      console.error("댓글 가져오기 오류:", error);
    }
  }

  // 게시물 ID 추출
  function getIdFromPathname(pathname) {
    const match = pathname.match(/\/post\/(\d+)$/);
    return match ? match[1] : null;
  }

  // 페이지 로드 시 실행
  onMount(() => {
    id = getIdFromPathname(window.location.pathname);
    if (id) {
      fetchPost(id);
      fetchcomment(id);
    } else {
      loading = false;
      errormsg = "잘못된 주소입니다";
    }
  });

  // 댓글 작성
  async function add_comment(id) {
    const data = { post_id: id, content: comment_content, writter: $nickname };
    try {
      const response = await SecurityFetch("/board/comment/add","POST",data);
      if (response.ok) {
        alert("댓글을 등록하였습니다");
        comment_content = ""; // 댓글 내용 초기화
        fetchcomment(id);
      }
    } catch (error) {
      console.error("댓글 작성 오류:", error);
    }
  }

  // 댓글 삭제
  async function delete_comment(post_id, comment_id) {
    const data = { comment_id };
    try {
      const response = await fetch("/board/comment/delete","DELETE", data)
      if (response.ok) {
        alert("댓글을 삭제하였습니다");
        fetchcomment(post_id);
      }
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
    }
  }

  // 게시물 수정
  function modify_post() {
    $modify_postid = id;
    navigate(`${modepage}/write`);
  }

  // 게시물 삭제
  async function delete_post(id) {
    const data = { post_id: id };
    try {
      const response = await fetch("/board/delete","DELETE",data);
      if (response.ok) {
        alert("글을 삭제하였습니다");
        navigate(`${modepage}/boardlist`);
      }
    } catch (error) {
      console.error("글 삭제 오류:", error);
    }
  }

  function stripTags(html) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || "";
    }

</script>
<svelte:head>
    <title>{List_data.title}</title>
    <meta name="author" content={List_data.writter} />
    <meta
      name="description"
      content={stripTags(List_data.content)}
    />

    <meta property="og:title" content={List_data.title} />

    <meta name="twitter:title" content={List_data.title} />
    <meta
      name="twitter:description"
      content={stripTags(List_data.content)}
    />
    <meta name="twitter:image" content="/favicon.png" />
    <meta name="twitter:url" content="https://d2rpvp.org" />
    <meta name="twitter:creator" content={List_data.writter} />

</svelte:head>

{#if loading}
  <div class="text-center">Loading...</div>
{:else if errormsg}
  <div class="text-center">Error: {errormsg}</div>
{:else}
  <div class="table-outline main_data">
    <div class="table-head table-title fontBasic">{List_data.title}</div>
    <div class="table-contents-wrapper">
      <div class="table-contents-no-line flex">
        <div class="table-info-writter table-contents_cell">{List_data.writter}</div>
        <div class="table-info-date table-contents_cell">작성일 : {formatDate(List_data.date)}</div>
        <div class="table-info-date table-contents_cell">수정일 : {formatDate(List_data.updated)}</div>
        <div class="table-info-views table-contents_cell">조회수 : {List_data.views}</div>
      </div>
    </div>
    <div class="table-contents-wrapper">
      <div class="table-contents-no-line">
        <div class="table-info-content fontBasic">{@html List_data.content}</div>
      </div>
    </div>
    <div class="table-contents-wrapper">
      <div class="table-contents-no-line">
        <div class="table-info-button">
          {#if List_data.writter === $nickname}
            <button on:click={modify_post}>수정하기</button>
          {/if}
          {#if $nickname === "admin" || $nickname === "admin_m" || List_data.writter === $nickname}
            <button on:click={() => delete_post(id)}>삭제하기</button>
          {/if}
          <Link class="button" to={`${modepage}/boardlist`}>목록보기</Link>
        </div>
      </div>
    </div>
  </div>

  <div class="table-outline main_data">
    <div class="table-head table-title">댓글</div>
    {#each comment as { writter, content, date, comment_id }}
      <div class="table-contents-wrapper">
        <div class="table-contents-no-line flex">
          <div class="table-info-commentwritter table-contents_cell">{writter}</div>
          <div class="table-info-commentdate table-contents_cell">{formatDate(date)}</div>
        </div>
        <div class="table-contents-no-line">
          <div class="table-info-comment table-contents_cell">
            {content}
            {#if writter === $nickname || $nickname === "admin" || $nickname === "admin_m"}
              <button on:click={() => delete_comment(id, comment_id)}>삭제</button>
            {/if}
          </div>
        </div>
      </div>
    {/each}
    {#if $nickname}
      <div class="table-contents-wrapper">
        <div class="table-contents-no-line">
          <div class="table-info-comment table-contents_cell">
            <input class="comment_input" type="text" bind:value={comment_content} />
            <button on:click={() => add_comment(id)}>댓글 작성</button>
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .comment_input {
    width: 75%;
    border: none;
    background-color: inherit;
    color: rgb(233, 233, 233);
    font-family: inherit;
    font-size: 1.5rem;
  }

  .table-title {
    padding: 10px;
  }

  .table-info-content,
  .table-info-comment {
    height: auto;
    text-align: left;
    padding: 5px 15px;
    font-size: 1.5rem;
    line-height: 2rem;
  }

  .flex {
    display: flex;
    font-size: 1rem;
  }

  .table-info-commentwritter {
    width: 25%;
    text-align: left;
  }

  .table-info-commentdate {
    width: 20%;
    text-align: right;
  }

  .table-contents-wrapper {
    border-top: 2px white solid;
  }

  .table-info-button {
    text-align: right;
  }
  .fontBasic{
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

</style>
