<script lang="ts">
    import { showMessageBox } from "../../custom/customStore";
import {form, jwtToken, SecurityFetch, myUnionAccount, mybabapk, mympk, myzpke, myorigin, email, admin, lang } from "../../store";


let loginnickname = "";
  let loginpw = "";


// 로그인 프로세스 함수 (클라이언트 코드)
async function formprocess() {
  let logindata = { nickname: loginnickname, password: loginpw };
  try {
    const endpoint = "/auth/login";
    const response = await SecurityFetch(endpoint,"POST",logindata);

    if (response.status === 200) {
      showMessageBox("success", $lang ? "로그인 성공":"Success", $lang ? "로그인에 성공하였습니다" :"Login Success")
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
      admin.set(data.admin)
    } else {
      showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
    }
  } catch (error) {
    showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
  }
}




</script>
<h3 class="message-title">{$lang ? "계정 로그인" : "Sign Up"}</h3>

<div class="message-body">

<input class="input-text" bind:value={loginnickname} type="text" placeholder={$lang ? "계정" : "Account"}>
<input class="input-text" bind:value={loginpw} type="password" placeholder={$lang ? "암호" : "Password"}>
<button class="emphasis-button block" on:click={() => formprocess()}>{$lang ? "로그인" : "Sign Up"}</button>
    
</div>
<button class="message-button" on:click={() => form.set("findaccount")}>{$lang ? "계정찾기" : "Find Account"}</button>
<button class="message-button" on:click={() => form.set("register")}>{$lang ? "가입하기" : "Register"}</button>
