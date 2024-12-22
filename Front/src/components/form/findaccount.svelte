<script lang="ts">
    import { form, mode, SecurityFetch } from "../../store";
    let isValidEmail = true; // 이메일 검증 상태

    let findnickname = "";
    let findemail = "";
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // 이메일 검증 함수
  function validateEmail() {
    isValidEmail = emailPattern.test(findemail); // 이메일이 패턴과 일치하는지 확인
  }
  async function handleSubmit() {

      const findpwdata = {
      findpw_nickname: findnickname,
      findpw_email: findemail,
    };

    try {
      const endpoint = "/reset-pw/" + $mode
      const response = await SecurityFetch(endpoint,"POST",findpwdata);

      if (response.ok) {
        alert("이메일을 확인하세요");
        form.set("none")
      } else {
        alert("에러 발생");
      }
    } catch (error) {
      alert(error);
    }



}
</script>

<h3 class="message-title">{$mode} 계정찾기</h3>
<div class="message-body">
    <input class="input-text" type="text" bind:value={findnickname} placeholder="닉네임">
    <input
    type="text" 
    bind:value={findemail}
    class="input-text {isValidEmail ? '' : 'invalid'}"
    placeholder="이메일 입력"
    on:input={validateEmail}
  />
      <button class="emphasis-button block" on:click={handleSubmit}>계정찾기</button>
</div>
    