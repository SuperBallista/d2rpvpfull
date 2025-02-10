<script lang="ts">
    import { showMessageBox } from "../../custom/customStore";


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
      newemail: newemail
    };

    try {
      const endpoint = `/userdata/change-email`
      const response = await SecurityFetch(endpoint, "POST",emaildata);
      
      if (response.status === 201) {
        showMessageBox("success", $lang? "변경 완료": "Success",$lang ? "이메일 변경 완료" : "E-mail Changed" )
        email.set(newemail)
        form.set("none")
    } else {
      showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
    }
    } catch (error) {
      console.error("오류 발생:", error);
      showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
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
