<script lang="ts">
  import { form, myaccount, SecurityFetch, jwtToken, mybabapk, mympk, myUnionAccount, myzpke, email, lang} from "../../store";

let pw = "";

// 계정 삭제 요청 함수
async function delete_account() {
  const pwdata = {
    nowpw: pw,
  };

  try {
    const endpoint = `/auth/delete`;
    const response = await SecurityFetch(endpoint,"DELETE",pwdata);

    if (response.status===200) {
      alert($lang ? "계정 삭제 완료" : "Your Account Removed");
      form.set("none");
      myaccount.set("");
      mybabapk.set("");
      mympk.set("");
      myzpke.set("");
      myUnionAccount.set("");
      email.set("");
      jwtToken.set("");
    } else {
      alert(`Error Code: ${response.status}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error: " + error);
  }
}



</script>


<h3 class="message-title">{$lang ? "계정 삭제" : "Account Remove"}</h3>

<div class="message-body">

<input class="input-text" bind:value={pw} type="password" placeholder={$lang ? "비밀번호" : "Password"}>
<button class="emphasis-button block" on:click={() => delete_account()}>{$lang ? "계정삭제" : "Remove"}</button>
    
</div>