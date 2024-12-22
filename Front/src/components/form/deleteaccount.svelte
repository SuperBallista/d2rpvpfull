<script lang="ts">
  import { mode, form, myaccount, SecurityFetch, jwtToken } from "../../store";

let pw = "";

// 계정 삭제 요청 함수
async function delete_account() {
  const pwdata = {
    nowpw: pw,
  };

  try {
    const endpoint = `/auth/${$mode}/delete`;
    const response = await SecurityFetch(endpoint,"DELETE",pwdata);

    if (response.status===200) {
      alert("계정 삭제 완료");
      form.set("none");
      myaccount.set("");
      jwtToken.set("");
    } else {
      alert(`오류 발생: ${response.status}`);
    }
  } catch (error) {
    console.error("오류 발생:", error);
    alert("오류 발생: " + error);
  }
}



</script>


<h3 class="message-title">{mode ? "밀리PK" : "정통바바"} 계정 삭제</h3>

<div class="message-body">

<input class="input-text" bind:value={pw} type="password" placeholder="비밀번호">
<button class="emphasis-button block" on:click={() => delete_account()}>계정삭제</button>
    
</div>