<script>
  import {
    mode,
    clickformopen, SecurityFetch
  } from "./store.js";
  import { onMount } from "svelte";

  let oldpw = "";
  let newpw = "";
  let checkpw = "";

  onMount(() => {});

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
  <input class="namewidth" type="password" bind:value={oldpw} />
  새 암호
  <input class="namewidth" type="password" bind:value={newpw} />
  암호 확인
  <input class="namewidth" type="password" bind:value={checkpw} />
  <button on:click={() => changepw()}>암호 변경</button>
</div>
