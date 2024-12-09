<script>
  import { mode, clickformopen, SecurityFetch } from "./store.js";
  import { onMount } from "svelte";

  let findnickname = "";
  let findemail = "";

  onMount(async () => {
  });

  async function findpw() {

    const findpwdata = {
      findpw_nickname: findnickname,
      findpw_email: findemail,
    };

    try {
      const endpoint = $mode ? "/reset-pw/m-user" : "/reset-pw/b-user";
      const response = await SecurityFetch(endpoint,"POST",findpwdata);

      if (response.ok) {
        alert("이메일을 확인하세요");
        clickformopen(null);
      } else {
        alert("에러 발생");
      }
    } catch (error) {
      alert("오류 발생 :", error);
    }
  }
</script>

<div class="left">
  닉네임
  <input class="namewidth" type="text" bind:value={findnickname} />
  이메일
  <input class="namewidth" type="text" bind:value={findemail} />
  <button on:click={() => findpw()}>암호찾기</button>
</div>
