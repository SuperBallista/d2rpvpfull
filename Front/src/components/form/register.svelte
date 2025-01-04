<script lang="ts">
    import { SecurityFetch, form } from "../../store";
    import Terms from "./terms.svelte";
    import Privacy from "./privacy.svelte";

    let isValidEmail = true;
    let Open = "";

    let email = "";
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let reginickname = "";
  let regipw = "";
  let regipwcheck = "";
  let checked_nickname = false



  // 이메일 검증 함수
  function validateEmail() {
    isValidEmail = emailPattern.test(email); // 이메일이 패턴과 일치하는지 확인
  }


  function validateNickname(nickname:string) {
  // 닉네임 공백 체크
  if (!nickname || nickname.trim() === "") {
    return { isValid: false, message: "닉네임을 입력해주세요." };
  }

  // 정규식: 알파벳, 숫자, 밑줄(_)만 허용, 길이는 3~20자
  const nicknameRegex = /^[a-zA-Z가-힣]{3,20}$/;
  if (!nicknameRegex.test(nickname)) {
    return {
      isValid: false,
      message: "닉네임은 3~20자의 알파벳, 한글만 허용됩니다.",
    };
  }

  return { isValid: true, message: "닉네임이 유효합니다." };
}



  // 닉네임 검증 함수
  async function checkNickname() {

    const result = validateNickname(reginickname); // 닉네임 검증
  if (!result.isValid) {
    alert(result.message);
    return; // 검증 실패 시 종료
  }

  if (checked_nickname) {
    alert("계정을 이미 확인하였습니다");
  } else {
    const checkEndpoint = `/auth/check-nickname`;
    const data = { nickname: reginickname };

    try {
      const response = await SecurityFetch(checkEndpoint, "POST", data);
      if (response.status === 200) {
        alert("해당 계정은 사용 가능합니다");
        checked_nickname = true;
      } else if (response.status === 403)
      {
        alert("해당 계정은 사용이 불가능합니다");
      }
      
    } catch (error) {
      console.error("Error occurred while checking nickname:", error);
      alert(error);
    }
  }
}


// 회원 등록 함수
    async function register() {
    const payload = {
      nickname: reginickname,
      password: regipw,
      email: email,
    };

    try {
      const endpoint = `/auth/register`;
      const response = await SecurityFetch(endpoint, "POST",payload);
      if (!response.ok) {
        throw new Error("회원가입에 실패했습니다.");
      }

     if (response.status===201) {

      alert("회원가입이 성공적으로 완료되었습니다.");
      form.set("none")
    }
    } catch (error) {
      alert(error);
    }
  }





    </script>
    <h3 class="message-title">가입하기</h3>
    
    <div class="message-body">

     {#if (Open==="terms")}
     <div class="detail-container">
        <Terms />
     </div>
     <button class="simple-button" on:click={() => Open=""}>닫기</button>

{:else if (Open==="privacy")}
     <div class="detail-container">
        <Privacy />
     </div>
     <button class="simple-button" on:click={() => Open=""}>닫기</button>

     {:else}

 {#if (!checked_nickname)}   

 <button class="simple-button" on:click={() => Open="terms"}>이용약관</button>
 <button class="simple-button" on:click={() => Open="privacy"}>개인정보 정책</button>


 <input class="input-text" bind:value={reginickname} type="text" placeholder="닉네임">
 <button class="emphasis-button" on:click={checkNickname}>계정 확인</button>

{:else}

<div class="nickname-input">닉네임 :{reginickname}</div>

<input
type="text"
bind:value={email}
class="input-text {isValidEmail ? '' : 'invalid'}"
placeholder="이메일 입력"
on:input={validateEmail}
/>

 <input class="input-text" bind:value={regipw} type="password" placeholder="비밀번호">
 <input class="input-text" bind:value={regipwcheck} type="password" placeholder="암호확인"><br/>
 <button class="emphasis-button" on:click={register}>회원가입</button>
{/if}
    

     {/if}


</div>

<style>
    .nickname-input {
        color: #cfcfcf;
        font-size: 1.2rem;
        font-weight: bold;
    }


    .detail-container {
    text-align: left;
    padding: 1rem;
    border: 1px solid #cfcfcf;
    border-radius: 1rem;
    height: 40vh;
    width: 75%;
    overflow-y: auto; /* 세로 스크롤 활성화 */
    overflow-x: hidden; /* 가로 스크롤 비활성화 */
    margin: 0 auto;
}


</style>
