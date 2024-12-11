<script lang="ts">
    import {
      mode,
      form, SecurityFetch
    } from "../../store";
  
    let oldpw = "";
    let newpw = "";
    let checkpw = "";
  
  
    async function changepw() {
      if (newpw !== checkpw) {
        alert("암호 확인이 일치하지 않습니다. 다시 확인해주세요.");
        return;
      }
  
      const pwdata = {
        nowpw: oldpw,
        newpw: newpw,
      };
  
      try {
        const endpoint = $mode ? "/userdata/change-pw/m-user" : "/userdata/change-pw/b-user";
        const response = await SecurityFetch(endpoint,"POST",pwdata);
  
        if (response.ok) {
          alert("암호 변경 완료");
          form.set("none");
        } else {
          alert(`오류 발생: ${response.status}`);
        }
      } catch (error) {
        console.error("오류 발생:", error);
        alert("오류 발생: " + error);
      }
    }
  </script>



<h3 class="message-title">암호 변경</h3>

<div class="message-body">
  <input class="input-text" bind:value={oldpw} type="password" placeholder="현재암호">
<input class="input-text" bind:value={newpw} type="password" placeholder="새 암호">
<input class="input-text" bind:value={checkpw} type="password" placeholder="암호확인"><br/>
<button class="emphasis-button" on:click={() => changepw()}>변경하기</button>
    
</div>
<button class="message-button" on:click={() => form.set("myinfo")}>돌아가기</button>
