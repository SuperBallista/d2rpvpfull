<script lang="ts">
import {form, jwtToken, SecurityFetch, myUnionAccount, mybabapk, mympk, myzpke, myorigin, email } from "../../store";


let loginnickname = "";
  let loginpw = "";


// 로그인 프로세스 함수 (클라이언트 코드)
async function formprocess() {
  let logindata = { nickname: loginnickname, password: loginpw };
  try {
    const endpoint = "/auth/login";
    const response = await SecurityFetch(endpoint,"POST",logindata);

    if (response.status === 200) {
      const data = await response.json();
      
      // JWT 토큰을 본문에서 가져오기
      const jwtTokenFromHeader = data.accessToken;
      if (jwtTokenFromHeader) {
        jwtToken.set(jwtTokenFromHeader); // JWT 토큰 설정
      }
      myUnionAccount.set(data.username); // 서버에서 사용자 정보를 받아서 설정
      mybabapk.set(data.babapk || "");
      myzpke.set(data.zpke || "");
      mympk.set(data.mpk || "");
      myorigin.set(data.how || "");
      email.set(data.email || "");
      form.set("none");
    } else {
      alert("로그인 실패"); // 에러 메시지 출력
    }
  } catch (error) {
    alert(error);
  }
}




</script>
<h3 class="message-title">계정 로그인</h3>

<div class="message-body">

<input class="input-text" bind:value={loginnickname} type="text" placeholder="계정">
<input class="input-text" bind:value={loginpw} type="password" placeholder="비밀번호">
<button class="emphasis-button block" on:click={() => formprocess()}>로그인</button>
    
</div>
<button class="message-button" on:click={() => form.set("findaccount")}>계정찾기</button>
<button class="message-button" on:click={() => form.set("register")}>회원가입</button>
