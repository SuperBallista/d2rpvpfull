<script>
  import { onMount, onDestroy } from "svelte";
  import LginForm from "./LginForm.svelte";
  import Register from "./Register.svelte";
  import Findpw from "./Findpw.svelte";
  import Myinfo from "./Myinfo.svelte";
  import Changepw from "./Changepw.svelte";
  import Changeemail from "./Changeemail.svelte";
  import Newrecord from "./Newrecord.svelte";
  import Recordok from "./Recordok.svelte";
  import Newevent from "./Newevent.svelte";
  import Calendartext from "./Calendartext.svelte";
  import DeleteAccount from "./DeleteAccount.svelte";
  import Clanjoin from "./Clanjoin.svelte";
  import Newclanrecord from "./Newclanrecord.svelte";
  import Clanrecordok from "./Clanrecordok.svelte";
  import Challenge from "./Challenge.svelte";

  import { clickformopen, formopen, key } from "./store.js";

  function updatekey() {
    key.update((n) => n + 1);
  }
  
  function closeform() {
    clickformopen(null);
    updatekey();
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      closeform();
    }
  }

  onMount(() => {
    // 컴포넌트가 마운트되었을 때 esc 키를 처리하는 이벤트 리스너 추가
    window.addEventListener("keydown", handleKeydown);
  });

  onDestroy(() => {
    // 컴포넌트가 언마운트되었을 때 이벤트 리스너 제거
    window.removeEventListener("keydown", handleKeydown);
  });
</script>

{#if $formopen}
  <div class="form">
    <div class="form-title">
      <div class="outbutton" on:click={() => closeform()}>
        <i class="fa-solid fa-circle-xmark"></i>
      </div>
    </div>
    <div class="form-container">
      {#if $formopen === "login"}
        <LginForm />
      {:else if $formopen === "register"}
        <Register />
      {:else if $formopen === "findpw"}
        <Findpw />
      {:else if $formopen === "myinfo"}
        <Myinfo />
      {:else if $formopen === "changepw"}
        <Changepw />
        {:else if $formopen === "challenge"}
        <Challenge/>
      {:else if $formopen === "changeemail"}
        <Changeemail />
      {:else if $formopen === "newrecord"}
        <Newrecord />
      {:else if $formopen === "recordok"}
        <Recordok />
      {:else if $formopen === "newevent"}
        <Newevent />
      {:else if $formopen === "calendartext"}
        <Calendartext />
      {:else if $formopen === "deleteaccount"}
        <DeleteAccount />
      {:else if $formopen === "clanjoin"}
      <Clanjoin/>
      {:else if $formopen === "newclanrecord"}
      <Newclanrecord/>
      {:else if $formopen === "clanrecordok"}
      <Clanrecordok/>
      {/if}
    </div>
  </div>
{/if}

<style>
  .form {
    margin: auto;
    width: 360px;
    background-color: #444;
    padding: 10px;
    border-radius: 15px;
    border: white 2px solid;
  }
  .form-title {
    display: flex;
    justify-content: flex-end;
  }
  .outbutton {
    font-size: 1.25rem;
    cursor: pointer;
  }
  .outbutton:hover {
    color: yellow;
    border-color: yellow;
  }
  .form-container {
    padding: 5px;
  }
</style>
