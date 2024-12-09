<script>
  import {
    clickformopen,
    mode,
    nickname,
    jwtToken,
    SecurityFetch
  } from "./store.js";

  let loginnickname = "";
  let loginpw = "";


// 로그인 프로세스 함수 (클라이언트 코드)
async function formprocess() {
  let logindata = { nickname: loginnickname, password: loginpw };
  try {
    const endpoint = $mode ? "/auth/m-user/login" : "/auth/b-user/login";
    const response = await SecurityFetch(endpoint,"POST",logindata);

    if (response.status === 200) {
      const data = await response.json();
      
      // JWT 토큰을 헤더에서 가져오기
      const jwtTokenFromHeader = data.accessToken;
      if (jwtTokenFromHeader) {
        jwtToken.set(jwtTokenFromHeader); // JWT 토큰 설정
      }
      nickname.set(data.username); // 서버에서 사용자 정보를 받아서 설정
      clickformopen(null);
    } else {
      alert("로그인 실패"); // 에러 메시지 출력
    }
  } catch (error) {
    alert(error);
  }
}
</script>

<div class="left">
  닉네임
  <input class="namewidth" type="text" bind:value={loginnickname} />
  암호
  <input class="namewidth" type="password" bind:value={loginpw} />
  <button class="posit1" on:click={() => formprocess()}>로그인</button>
  <button class="posit2" on:click={() => clickformopen("findpw")}
    >암호찾기</button
  >
</div>

<style>
  .posit1 {
    position: relative;
    top: -35px;
    left: 280px;
  }
  .posit2 {
    position: relative;
    left: -70px;
  }
</style>
