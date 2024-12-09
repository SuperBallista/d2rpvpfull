<script>
  import { onMount } from "svelte";
  import {
    nickname,
    modify_postid,
    showNavbar,
    SecurityFetch,
    mode
  } from "./store.js";
  import { navigate } from "svelte-routing";
  import Quill from "quill";
  import "quill/dist/quill.snow.css";

  let title = "";
  let content = "";
  let quill;
  let category = "free";
  const modepage = $mode ? "/mpk" : "/babapk";

  // 이미지 업로드 핸들러
  async function imageHandler() {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return alert("파일이 선택되지 않았습니다.");

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        try {
          const imageUrl = await uploadImage(base64Image);
          if (imageUrl) {
            const range = quill.getSelection();
            quill.insertEmbed(range.index, "image", imageUrl);
          }
        } catch (error) {
          console.error("이미지 업로드 오류:", error);
        }
      };
      reader.readAsDataURL(file);
    };
  }

  // 이미지 업로드 함수
  async function uploadImage(base64Image) {
    const response = await SecurityFetch("/cloudinary/upload","POST",{ image: base64Image });

    if (!response.ok) throw new Error("이미지 업로드 실패");

    const data = await response.json();
    return data.url;
  }

  // 글 작성/수정 전송
  async function handleSubmit() {
    const data = {
      title,
      category,
      content,
      nickname: $nickname,
      postId: $modify_postid,
    };

    try {
      const response = await SecurityFetch("/board/write", "POST",data);
      if (response) {
        alert("글을 성공적으로 작성하였습니다");
        resetForm();
        navigate(`${modepage}/boardlist`);
      }
    } catch (error) {
      console.error("네트워크 오류:", error);
      alert(`네트워크 오류: ${error.message}`);
    }
  }


  // 수정할 포스트 데이터 불러오기
  async function loadModifyPostData() {
    if ($modify_postid !== "none") {
      try {
        const response = await fetch(`/board/post?post_id=${$modify_postid}`);
        const postData = await response.json();
        title = postData.title;
        content = postData.content;
        category = postData.category;
      } catch (error) {
        alert("게시물 로드 중 오류 발생");
      }
    }
  }

  // 에디터 초기화 및 포스트 데이터 로드
  onMount(async () => {
    await loadModifyPostData();
    showNavbar.set(false);

    quill = new Quill("#editor", {
      theme: "snow",
      placeholder: "Compose an epic...",
      modules: {
        toolbar: {
          container: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["image", "code-block"],
          ],
          handlers: { image: imageHandler },
        },
      },
    });

    if (content) quill.clipboard.dangerouslyPasteHTML(content);

    quill.on("text-change", () => {
      content = quill.root.innerHTML;
    });
  });

  // 폼 초기화 및 취소 처리
  function resetForm() {
    modify_postid.set("none");
    showNavbar.set(true);
  }

  function cancel() {
    resetForm();
    navigate(`${modepage}/boardlist`);
  }
</script>

<div class="table-outline main_data">
  <div class="table-head table-title">
    <input type="text" id="title" bind:value={title} />
  </div>
  <div class="table-contents-gray">
    <select class="namewidth" bind:value={category}>
      <option value="free">자유</option>
      <option value="trade">거래</option>
      <option value="setting">공략</option>
    </select>
  </div>
  <div class="table-contents-white">
    <div id="editor"></div>
  </div>

  <div class="form-group">
    <button on:click={handleSubmit}>작성하기</button>
    <button on:click={cancel}>취소하기</button>
  </div>
</div>

<style>
  #editor {
    height: 60vh;
  }
  #title {
    margin: 15px;
    width: 100%;
    background-color: inherit;
    color: inherit;
    border: none;
    font-size: 1.5rem;
    padding: 5px;
  }
  .table-contents-gray div {
    background-color: gray;
  }
  .table-contents-white div {
    background-color: white;
    color: black;
  }
</style>
