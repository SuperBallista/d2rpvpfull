<script lang="ts">
    import { onMount } from "svelte";
    import {
      myaccount,
      modify_postid, SecurityFetch,
      mode, lang,
      myUnionAccount

    } from "../store";
    import { navigate } from "svelte-routing";
    import Quill from "quill";
    import "quill/dist/quill.snow.css";
  
    let title: string = "";
    let content: string = "";
    let quill: Quill;
    let category: "free" | "trade" | "setting" = "free";
    const modepage: string = "/" + $mode;
  
    // 이미지 업로드 핸들러
    async function imageHandler(): Promise<void> {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();
  
      input.onchange = async () => {
        const file = input.files ? input.files[0] : null;
        if (!file) return alert( $lang ? "파일이 선택되지 않았습니다." : "No File Selected.");
  
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Image = reader.result as string;
          try {
            const imageUrl = await uploadImage(base64Image);
            if (imageUrl) {
              const range = quill.getSelection();
              quill.insertEmbed(range?.index || 0, "image", imageUrl);
            }
          } catch (error) {
            console.error("Upload Error:", error);
          }
        };
        reader.readAsDataURL(file);
      };
    }
  
    // 이미지 업로드 함수
    async function uploadImage(base64Image: string): Promise<string> {
      const response = await SecurityFetch("/cloudinary/upload", "POST", { image: base64Image });
  
      if (!response.ok) throw new Error("Upload Error");
  
      const data = await response.json();
      return data.url;
    }
  
    // 글 작성/수정 전송
    async function handleSubmit(): Promise<void> {
      const data = {
        title,
        category,
        content,
        nickname: $myaccount,
        postId: $modify_postid,
        account: $myUnionAccount
      };
  
      try {
        const response = await SecurityFetch("/board/write", "POST", data);
        if (response.ok) {
          alert($lang ? "글을 성공적으로 작성하였습니다" : "Post Successed");
          resetForm();
          navigate(`${modepage}/boardlist`);
        }
      } catch (error) {
        console.error("네트워크 오류:", error);
        alert(`Network Error: ${(error as Error).message}`);
      }
    }
  
    // 수정할 포스트 데이터 불러오기
    async function loadModifyPostData(): Promise<void> {
      if ($modify_postid !== "none") {
        try {
          const response = await fetch(`/board/post?post_id=${$modify_postid}`);
          const postData = await response.json();
          title = postData.title;
          content = postData.content;
          category = postData.category;
        } catch (error) {
          alert($lang ? "게시물을 불러오는데 실패하였습니다" : "Loading post failed");
        }
      }
    }
  
    // 에디터 초기화 및 포스트 데이터 로드
    onMount(async () => {
      await loadModifyPostData();
  
      quill = new Quill("#editor", {
        theme: "snow",
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, false], class: "custom-header" }],
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
    function resetForm(): void {
      modify_postid.set("none");
    }
  
    function cancel(): void {
      resetForm();
      navigate(`${modepage}/boardlist`);
    }
  </script>
  
<div class="margin"></div>



<div class="table-outline main_data">
    <div class="table-head table-title">
      <input type="text" id="title" bind:value={title} />
    </div>
    <div class="table-contents-gray">
      <select class="namewidth" bind:value={category}>
        <option value="free">{$lang ? "자유" : "Free"}</option>
        <option value="trade">{$lang ? "거래" : "Trade"}</option>
        <option value="setting">{$lang ? "공략" : "Tips"}</option>
      </select>
    </div>
    <div class="table-contents-white">
      <div id="editor"></div>
    </div>
  
    <div class="form-group">
      <button class="emphasis-button" on:click={handleSubmit}>{$lang ? "작성하기" : "Post"}</button>
      <button class="simple-button" on:click={cancel}>{$lang ? "취소하기" : "Cancel"}</button>
    </div>
  </div>
  


<style>

.margin{
        height: 75px;
    }

    .table-outline {
  background-color: #4e4e4e;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px auto;
  max-width: 800px;
  font-family: "Arial", sans-serif;
}

.table-title input {
  box-sizing: border-box; /* padding과 border를 width에 포함 */
  width: 100%;
  padding: 10px;
  font-size: 18px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 15px;
  background-color: #4e4e4e;
  color: #ddd
}

.table-contents-gray select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #333;
  margin-bottom: 15px;
  background-color: #4e4e4e;
  color: #ddd
}

.table-contents-white {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

#editor {
  min-height: 200px;
  padding: 10px;
  font-size: 16px;
  color: #ddd;
}

.form-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>