<script lang="ts">
    import { onMount } from "svelte";
    import { formatDate, myaccount, modify_postid, mode, SecurityFetch } from "../store";
    import { Link, navigate } from "svelte-routing";

    // 변수 타입 정의
    let id: string = "";
    let List_data: { [key: string]: any } = {}; // 게시글 데이터 (key-value 객체로 처리)
    $: loading = true;
    let errormsg: string = "";
    let comment: { nickname: string; content: string; createdAt: string; commentId: string }[] = [];
    let comment_content: string = "";

    const modepage: string = "/" + $mode;

    // 게시물 가져오기
    async function fetchPost(id: string): Promise<void> {
    try {
        console.log(`Fetching post with ID: ${id}`);
        const response = await fetch(`/board/post?post_id=${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data); // JSON 데이터 확인
        List_data = { ...data };
        loading = false; // 로딩 상태 업데이트
        console.log("Loading state after fetch:", loading); // 로딩 상태 확인
    } catch (error) {
        console.error(`Error fetching post: ${error}`);
        loading = false;
        errormsg = `네트워크 오류: ${(error as Error).message}`;
    }
}


    // 댓글 가져오기
    async function fetchcomment(id: string): Promise<void> {
        try {
            const response = await fetch(`/board/comments?post_id=${id}`);
            comment = await response.json();
        } catch (error) {
            console.error("댓글 가져오기 오류:", error);
        }
    }

    // 게시물 ID 추출
    function getIdFromPathname(pathname: string): string | null {
        const match = pathname.match(/\/post\/(\d+)$/);
        return match ? match[1] : null;
    }

    // 페이지 로드 시 실행

    onMount(() => {
    const extractedId = getIdFromPathname(window.location.pathname);
    console.log("Extracted ID:", extractedId); // 디버깅 로그
    id = extractedId ?? "";
    if (id) {
        fetchPost(id);
        fetchcomment(id);
    } else {
        loading = false;
        errormsg = "잘못된 주소입니다";
    }
});
    // 댓글 작성
    async function add_comment(id: string): Promise<void> {
        const data = { post_id: id, content: comment_content, writter: $myaccount };
        try {
            const response = await SecurityFetch("/board/comment/add", "POST", data);
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
    async function delete_comment(post_id: string, comment_id: string): Promise<void> {
        const data = { comment_id };
        try {
            const response = await SecurityFetch("/board/comment/delete", "DELETE", data)
            if (response.ok) {
                alert("댓글을 삭제하였습니다");
                fetchcomment(post_id);
            }
        } catch (error) {
            console.error("댓글 삭제 오류:", error);
        }
    }

    // 게시물 수정
    function modify_post(): void {
        $modify_postid = id;
        navigate(`${modepage}/write`);
    }

    // 게시물 삭제
    async function delete_post(id: string): Promise<void> {
        const data = { post_id: id };
        try {
            const response = await SecurityFetch("/board/delete", "DELETE",data)
                        if (response.ok) {
                alert("글을 삭제하였습니다");
                navigate(`${modepage}/boardlist`);
            }
        } catch (error) {
            console.error("글 삭제 오류:", error);
        }
    }

    // HTML 태그 제거
    function stripTags(html: string): string {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || "";
    }
</script>

<div class="margin"></div>


{#if loading}
    <div class="text-center">Loading...</div>
{:else if errormsg}
    <div class="text-center">Error: {errormsg}</div>
{:else}
<!--데이터 렌더링-->
    <div class="table-outline main_data">
        <div class="table-head table-title fontBasic">{List_data.title || ""}</div>
        <div class="table-contents-wrapper">
            <div class="table-info-no-line flex">
                <div class="table-info-writter table-contents_cell">{List_data.nickname || ""}</div>
                <div class="table-info-date table-contents_cell">작성일 : {formatDate(List_data.createdAt) || ""}</div>
                <div class="table-info-date table-contents_cell">수정일 : {formatDate(List_data.updatedAt) || ""}</div>
                <div class="table-info-views table-contents_cell">조회수 : {List_data.views || ""}</div>
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
                    {#if List_data.nickname === $myaccount}
                        <button class="simple-button" on:click={modify_post}>수정하기</button>
                    {/if}
                    {#if $myaccount === "admin" || $myaccount === "admin_m" || List_data.writter === myaccount}
                        <button class="simple-button" on:click={() => delete_post(id)}>삭제하기</button>
                    {/if}
                    <Link class="simple-button" to={`${modepage}/boardlist`}>목록보기</Link>
                </div>
            </div>
        </div>
    </div>

    <table class="comment-table">
        <thead>
            <tr>
                <th>작성자</th>
                <th>내용</th>
                <th>작성일</th>
                <th>관리</th>
            </tr>
        </thead>
        <tbody>
            {#each comment as { nickname, content, createdAt, commentId }}
                <tr>
                    <td>{nickname}</td>
                    <td class="commentContent">{content}</td>
                    <td>{formatDate(createdAt)}</td>
                    <td>
                        {#if nickname === $myaccount || $myaccount === "admin" || $myaccount === "admin_m"}
                            <button class="simple-button small" on:click={() => delete_comment(id, commentId)}>삭제</button>
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>

    {#if $myaccount}
        <div class="table-contents-wrapper">
            <div class="table-contents-no-line">
                <div class="table-info-comment table-contents_cell">
                    <input class="input-text" type="text" bind:value={comment_content} />
                    <button class="simple-button small" on:click={() => add_comment(id)}>댓글 작성</button>
                </div>
            </div>
        </div>
    {/if}
{/if}

<style>
    .comment-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }
    .margin{
        height: 75px;
    }
    .small{
        padding: 3px;
    }
    .input-text{
        width: 50vw;
    }

    
    table tr td:first-child, table tr th:first-child {
  width: 20%; /* 첫 번째 열 */
}
table tr td:nth-child(2), table tr th:nth-child(2) {
  width: 50%; /* 두 번째 열 */
}
table tr td:nth-child(3), table tr th:nth-child(3) {
  width: 20%; /* 세 번째 열 */
}
table tr td:nth-child(4), table tr th:nth-child(4) {
  width: 15%; /* 네 번째 열 */
}

    .table-outline {
    background-color: #4e4e4e; /* 배경 색상 */
    border-radius: 8px; /* 모서리 둥글게 */
    padding: 20px; /* 내부 여백 */
    margin-bottom: 20px; /* 외부 여백 */
    font-family: 'Arial', sans-serif; /* 폰트 설정 */
    color: #ffffff; /* 글자 색상 */
}

.table-title {
    font-size: 24px; /* 제목 크기 */
    font-weight: bold; /* 제목 강조 */
    color: #ffffff; /* 제목 색상 */
    margin-bottom: 15px; /* 제목 아래 여백 */
    border-bottom: 2px solid #6b6b6b; /* 하단 구분선 */
    padding-bottom: 10px; /* 하단 여백 */
    white-space: nowrap; /* 텍스트 줄바꿈 방지 */
    overflow: hidden; /* 넘치는 내용 숨기기 */
    text-overflow: ellipsis; /* 넘치는 텍스트에 '...' 추가 */
}

.table-contents-wrapper {
    margin-bottom: 20px; /* 섹션 간 여백 */
}

.table-info-writter,
.table-info-date,
.table-info-views {
    font-size: 0.8rem; /* 폰트 크기 */
    color: #e0e0e0; /* 텍스트 색상 */
    margin-right: 5px; /* 항목 간 간격 */
    display: inline-block; /* 한 줄 정렬 */
}


.table-info-content {
    font-size: 1rem; /* 본문 크기 */
    text-align: left;
    line-height: 1.6; /* 줄 간격 */
    color: #ffffff; /* 본문 색상 */
    word-wrap: break-word; /* 텍스트 줄바꿈 처리 */
    margin-top: 15px; /* 본문 위 여백 */
}

.table-info-button {
    text-align: right; /* 버튼 정렬 */
}
.commentContent{
    white-space: pre-line;
    text-align: left;
}


</style>
