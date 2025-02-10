<script lang="ts">
    import { showMessageBox } from "../../custom/customStore";
    import {
      lang,
      form, SecurityFetch
    } from "../../store";
  
    let oldpw = "";
    let newpw = "";
    let checkpw = "";
  
  
    async function changepw() {
      if (newpw !== checkpw) {
        showMessageBox("alert",$lang ? "암호 오류" : "Password Error", $lang ? "암호 확인이 일치하지 않습니다. 다시 확인해주세요.": "Check Password please")
        return;
      }
  
      const pwdata = {
        nowpw: oldpw,
        newpw: newpw,
      };
  
      try {
        const endpoint = `/userdata/change-pw`;
        const response = await SecurityFetch(endpoint,"POST",pwdata);
  
        if (response.status === 201) {
          showMessageBox("success", $lang ? "변경 완료":"Success", $lang ? "암호 변경 완료" : "Your Password Changed")
          form.set("none");
        }
        else {
          showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
        }
      } catch (error) {
        console.error("Error:", error);
        showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
      }
    }
  </script>



<h3 class="message-title">암호 변경</h3>

<div class="message-body">
  <input class="input-text" bind:value={oldpw} type="password" placeholder={$lang ? "현재암호" : "Old Password"}>
<input class="input-text" bind:value={newpw} type="password" placeholder={$lang ? "새 암호" : "New Password"}>
<input class="input-text" bind:value={checkpw} type="password" placeholder={$lang ? "암호확인" : "Input New Password Again"}><br/>
<button class="emphasis-button" on:click={() => changepw()}>{$lang ? "변경하기" : "Change"}</button>
</div>
<button class="message-button" on:click={() => form.set("myinfo")}>{$lang ? "돌아가기" : "Back"}</button>
