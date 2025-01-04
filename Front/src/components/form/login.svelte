<script lang="ts">
import { form, modeinput, SecurityFetch, mybabapk, mympk, myzpke } from "../../store";


let loginnickname = "";
  let loginpw = "";


// 계정 연동을 위한 구 계정 로그인
async function formprocess() {
  let logindata = { nickname: loginnickname, password: loginpw, mode: $modeinput };
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
    alert(data.nickname + " 계정을 연동하였습니다");
    } else {
      alert("로그인 실패 혹은 수정이 불가합니다"); // 에러 메시지 출력
    }
  } catch (error) {
    alert(error);
  }
}




</script>
<h3 class="message-title">{$modeinput} 로그인하여 캐릭터 연동</h3>

<div class="message-body">

<input class="input-text" bind:value={loginnickname} type="text" placeholder="닉네임">
<input class="input-text" bind:value={loginpw} type="password" placeholder="비밀번호">
<button class="emphasis-button block" on:click={() => formprocess()}>로그인</button>
    
</div>