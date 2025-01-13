<script lang="ts">
import { form, mode, modeinput, SecurityFetch, mybabapk, mympk, myzpke, lang } from "../../store";


let loginnickname = "";
  let loginpw = "";


// 계정 연동을 위한 구 계정 로그인
async function formprocess() {
  let logindata = { nickname: loginnickname, password: loginpw, mode: $modeinput || $mode };
  try {
    const endpoint = "/connect/login";
    const response = await SecurityFetch(endpoint,"POST",logindata);

    if (response.status === 201) {
      const data = await response.json();
      
      if ($modeinput === "babapk")
    {mybabapk.set(data.nickname)}
    else if ($modeinput === "mpk")
    {mympk.set(data.nickname)}
    else if ($modeinput === "zpke")
    {myzpke.set(data.nickname)}
      form.set("none");
    alert(data.nickname + ($lang ?  " 계정을 연동하였습니다" : "Connected"));
    } else {
      alert($lang ? "로그인 실패 혹은 수정이 불가합니다" : "Connecting Failed"); // 에러 메시지 출력
    }
  } catch (error) {
    alert(error);
  }
}




</script>
<h3 class="message-title">{$modeinput} {$lang ? "로그인하여 캐릭터 연동" : "Connect Legacy Character"}</h3>

<div class="message-body">

<input class="input-text" bind:value={loginnickname} type="text" placeholder={$lang ? "닉네임" : "Nickname"}>
<input class="input-text" bind:value={loginpw} type="password" placeholder={$lang ? "비밀번호" : "Password"}>
<button class="emphasis-button block" on:click={() => formprocess()}>{$lang ? "로그인" : "Connect"}</button>
    
</div>