<script>
import { myaccount, form, mode, jwtToken, SecurityFetch } from "../../store";


let loginnickname = "";
  let loginpw = "";


// 로그인 프로세스 함수 (클라이언트 코드)
async function formprocess() {
  let logindata = { nickname: loginnickname, password: loginpw };
  try {
    const endpoint = "/auth/"+ $mode + "/login";
    const response = await SecurityFetch(endpoint,"POST",logindata);

    if (response.status === 200) {
      const data = await response.json();
      
      // JWT 토큰을 본문에서 가져오기
      const jwtTokenFromHeader = data.accessToken;
      if (jwtTokenFromHeader) {
        jwtToken.set(jwtTokenFromHeader); // JWT 토큰 설정
      }
      myaccount.set(data.username); // 서버에서 사용자 정보를 받아서 설정
      form.set("none");
    } else {
      alert("로그인 실패"); // 에러 메시지 출력
    }
  } catch (error) {
    alert(error);
  }
}




</script>
<h3 class="message-title">{$mode} 로그인하기</h3>

<div class="message-body">

<input class="input-text" bind:value={loginnickname} type="text" placeholder="닉네임">
<input class="input-text" bind:value={loginpw} type="password" placeholder="비밀번호">
<button class="emphasis-button block" on:click={() => formprocess()}>로그인</button>
    
</div>
<button class="message-button" on:click={() => form.set("findaccount")}>계정찾기</button>
<button class="message-button" on:click={() => form.set("register")}>회원가입</button>
