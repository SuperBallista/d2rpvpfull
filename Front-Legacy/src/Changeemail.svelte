<script>
  import {
    mode,
    clickformopen, SecurityFetch
  } from "./store.js";

  let pw = "";
  let newemail = "";

  // 이메일 변경 요청 함수
  async function changeemail() {
    const emaildata = {
      nowpw: pw,
      newemail: newemail,
    };

    try {
      const endpoint = $mode
        ? "/userdata/change-email/m-user"
        : "/userdata/change-email/b-user";
      const response = await SecurityFetch(endpoint, "POST",emaildata);
  
      if (response.ok) {
        alert("이메일 변경 완료");
        clickformopen(null);
      } else {
        alert(`오류 발생: ${response.status}`);
      }
    } catch (error) {
      console.error("오류 발생:", error);
      alert("오류 발생: " + error.message);
    }
  }
</script>


<div class="left">
  암호
  <input class="namewidth" type="password" bind:value={pw} />
  새 이메일
  <input class="namewidth" type="text" bind:value={newemail} />
  <button on:click={() => changeemail()}>이메일 변경</button>
</div>
