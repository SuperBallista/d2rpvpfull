<script lang="ts">

import {
    email,
    form, SecurityFetch, lang
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
      const endpoint = `/userdata/change-email`
      const response = await SecurityFetch(endpoint, "POST",emaildata);
      const data = await response.json();
      
      if (typeof data.message === "string") {
        alert($lang ? "이메일 변경 완료" : "E-mail Changed");
        email.set(newemail)
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



<h3 class="message-title">{$lang ? "이메일 변경" : "Change Your Email"}</h3>

<div class="message-body">

<input class="input-text" bind:value={newemail} type="text" placeholder={$lang ? "새 이메일" : "New E-mail"}>
<input class="input-text" bind:value={pw} type="password" placeholder={$lang ? "비밀번호" : "Password"}>
<br/>
<button class="emphasis-button" on:click={() => changeemail()}>{$lang ? "변경하기" : "Change"}</button>
    
</div>
<button class="message-button" on:click={() => form.set("myinfo")}>{$lang ? "돌아가기" : "Back"}</button>
