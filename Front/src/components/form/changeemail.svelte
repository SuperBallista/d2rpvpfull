<script lang="ts">

import {
    mode,
    form, SecurityFetch
  } from "../../store";

  let pw = "";
  let newemail = "";

  // 이메일 변경 요청 함수
  async function changeemail() {
    const emaildata = {
      nowpw: pw,
      newemail: newemail,
    };

    try {
      const endpoint = `/userdata/${$mode}/change-email`
      const response = await SecurityFetch(endpoint, "POST",emaildata);
      const data = await response.json();
      
      if (typeof data.message === "string") {
        alert("이메일 변경 완료");
        form.set("none")
    } else {
        alert(`오류 발생: ${response.status}`);
      }
    } catch (error) {
      console.error("오류 발생:", error);
      alert("오류 발생: " + error);
    }
  }


</script>



<h3 class="message-title">이메일 변경</h3>

<div class="message-body">

<input class="input-text" bind:value={newemail} type="text" placeholder="새 이메일">
<input class="input-text" bind:value={pw} type="password" placeholder="비밀번호">
<br/>
<button class="emphasis-button" on:click={() => changeemail()}>변경하기</button>
    
</div>
<button class="message-button" on:click={() => form.set("myinfo")}>돌아가기</button>
