<script lang="ts">
    import { showMessageBox } from "../../custom/customStore";
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

    if (response.status===204) {
      showMessageBox("success", $lang ? "삭제 완료" : "Success", $lang ? "계정 삭제 완료" : "Your Account Removed")
    } else {
      showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
    }
  } catch (error) {
    console.error("Error:", error);
    showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
  }
  finally{
    form.set("none");
      myaccount.set("");
      mybabapk.set("");
      mympk.set("");
      myzpke.set("");
      myUnionAccount.set("");
      email.set("");
      jwtToken.set("");
  }
}



</script>


<h3 class="message-title">{$lang ? "계정 삭제" : "Account Remove"}</h3>

<div class="message-body">

<input class="input-text" bind:value={pw} type="password" placeholder={$lang ? "비밀번호" : "Password"}>
<button class="emphasis-button block" on:click={() => delete_account()}>{$lang ? "계정삭제" : "Remove"}</button>
    
</div>