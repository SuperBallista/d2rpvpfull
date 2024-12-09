<script>
  import { mode, clickformopen, nickname, SecurityFetch } from "./store.js";

  let pw = "";

  // 계정 삭제 요청 함수
  async function delete_account() {
    const pwdata = {
      nowpw: pw,
    };

    try {
      const endpoint = $mode ? "/auth/m-user/delete" : "/auth/b-user/delete";
      const response = await SecurityFetch(endpoint,"DELETE",pwdata);

      if (response.ok) {
        alert("계정 삭제 완료");
        clickformopen(null);
        nickname.set(null);
        jwtToken.set(null);
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
   계정을 삭제하시려면 암호를 입력해주세요
    <input class="namewidth" type="password" bind:value={pw} />
    <button on:click={() => delete_account()}>계정 삭제</button>
  </div>
  