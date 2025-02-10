<script lang="ts">
    import { onMount } from "svelte";
    import { formatDate, myaccount, modify_postid, mode, SecurityFetch, admin, myUnionAccount, lang } from "../store";
    import { Link, navigate } from "svelte-routing";
    import { showMessageBox } from "../custom/customStore";

    // 변수 타입 정의
    let id: string = "";
    let List_data: { [key: string]: any } = {}; // 게시글 데이터 (key-value 객체로 처리)
    $: loading = true;
    let errormsg: string = "";
    let comment: { nickname: string; content: string; createdAt: string; commentId: string, account: string }[] = [];
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
    id = extractedId ?? "";
    if (id) {
        fetchPost(id);
        fetchcomment(id);
    } else {
        loading = false;
        errormsg = $lang ? "잘못된 주소입니다" : "Not Found";
    }
});
    // 댓글 작성
    async function add_comment(id: string): Promise<void> {
        const data = { post_id: id, content: comment_content, writter: $myaccount, account: $myUnionAccount };
        try {
            const response = await SecurityFetch("/board/comment/add", "POST", data);
            if (response.ok) {
                showMessageBox("success",$lang? "댓글 등록" : "Success", $lang ? "댓글을 등록하였습니다" : "Comment added")
                comment_content = ""; // 댓글 내용 초기화
                fetchcomment(id);
            }
            else {
                showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
            }
        } catch (error) {
            showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
        }
    }

    // 댓글 삭제
    async function delete_comment(post_id: string, comment_id: string): Promise<void> {

        const userResponse = await showMessageBox("confirm",$lang ? "댓글 삭제": "Delete Confirm", $lang ? "댓글을 삭제하시겠습니까? 삭제시 복원이 불가합니다" : "Do you really want to delete this comment?")
        
        if (userResponse.success) {

        const data = { comment_id: comment_id };
        try {
            const response = await SecurityFetch("/board/comment/delete", "DELETE", data)
            if (response.ok) {
                showMessageBox("success",$lang ? "댓글 삭제" : "Remove Completed", $lang ? "댓글을 삭제하였습니다" : "Your Comment removed.")
                fetchcomment(post_id);
            }
            else{
                showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
            }
        } catch (error) {
            showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
        }
    }
    }

    // 게시물 수정
    function modify_post(): void {
        $modify_postid = id;
        navigate(`${modepage}/write`);
    }

    // 게시물 삭제
    async function delete_post(id: string): Promise<void> {

      const userResponse = await showMessageBox("confirm", $lang ? "삭제 확인" : "Delete Confirm", $lang ? "글을 삭제하시겠습니까? 삭제시 복원이 불가합니다" : "Do you really want to delete this post?")
        if (userResponse.success) {

        const data = { post_id: id};

        try {
            const response = await SecurityFetch("/board/delete", "DELETE",data)
                        if (response.ok) {
                            showMessageBox("success", $lang ? "삭제 성공":"Success", $lang ? "글을 삭제하였습니다" : "Your post removed")
                navigate(`${modepage}/boardlist`);
            }
            else
            {
                showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
            }
        } catch (error) {
            showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
        }
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
    <div class="text-center">{$lang ? "로딩 중" : "Loading"}...</div>
{:else if errormsg}
    <div class="text-center">{errormsg}</div>
{:else}
<!--데이터 렌더링-->
    <div class="table-outline main_data">
        <div class="table-head table-title fontBasic">{List_data.title || ""}</div>
        <div class="table-contents-wrapper">
            <div class="table-info-no-line flex">
                <div class="table-info-writter table-contents_cell">{List_data.nickname || ""}</div>
                <div class="table-info-date table-contents_cell">{$lang ? "작성일" : "WrittenAt"} : {formatDate(List_data.createdAt) || ""}</div>
                <div class="table-info-date table-contents_cell">{$lang ? "수정일" : "ModifiedAt"} : {formatDate(List_data.updatedAt) || ""}</div>
                <div class="table-info-views table-contents_cell">{$lang ? "조회수" : "Views"} : {List_data.views || ""}</div>
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
                        <button class="simple-button" on:click={modify_post}>{$lang ? "수정하기" : "Modify"}</button>
                    {/if}
                    {#if $admin.includes($mode) || List_data.nickname === $myaccount}
                        <button class="simple-button" on:click={() => delete_post(id)}>{$lang ? "삭제하기" : "Delete"}</button>
                    {/if}
                    <Link class="simple-button" to={`${modepage}/boardlist`}>{$lang ? "목록보기" : "List"}</Link>
                </div>
            </div>
        </div>
    </div>

    <table class="comment-table">
        <thead>
            <tr>
                <th>{$lang ? "작성자" : "Writter"}</th>
                <th>{$lang ? "내용" : "Content"}</th>
                <th>{$lang ? "작성일" : "WrittedAt"}</th>
                <th>{$lang ? "관리" : "Delete"}</th>
            </tr>
        </thead>
        <tbody>
            {#each comment as { nickname, content, createdAt, commentId}}
                <tr>
                    <td>{nickname}</td>
                    <td class="commentContent">{content}</td>
                    <td>{formatDate(createdAt)}</td>
                    <td>
                        {#if nickname === $myaccount || $admin.includes($mode) }
                            <button class="simple-button small" on:click={() => delete_comment(id, commentId)}>{$lang ? "삭제" : "Delete"}</button>
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
                    <button class="simple-button small" on:click={() => add_comment(id)}>{$lang ? "댓글 작성" : "Add Comment"}</button>
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
