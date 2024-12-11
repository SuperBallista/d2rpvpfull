<script lang="ts">
import { form } from "../store";
import Login from "./form/login.svelte";
import FindAccount from "./form/findaccount.svelte";
import { onMount, onDestroy } from "svelte";
import Register from "./form/register.svelte";
  import Myinfo from "./form/myinfo.svelte";
  import Changeemail from "./form/changeemail.svelte"
  import Changepw from "./form/changepw.svelte";
  import Deleteaccount from "./form/deleteaccount.svelte"
  import Recordcreate from "./form/recordcreate.svelte";
  import Recordok from "./form/recordok.svelte";
  import Newevent from "./form/Newevent.svelte";
  import Challenge from "./form/challenge.svelte";

function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      form.set("none");
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

{#if $form !== "none"}
<div class="message-container">
    <div class="message-box">
      <!-- 닫기 버튼 -->
      <button class="close-button" on:click={() => form.set("none")}>&times;</button>
      <!-- 조건부 렌더링 -->
  {#if $form === "login"}
    <Login />
  {:else if $form === "findaccount"}
    <FindAccount />
  {:else if $form === "register"}
    <Register />
  {:else if $form === "myinfo"}
  <Myinfo />
  {:else if $form === "changeemail"}
<Changeemail/>
{:else if  $form === "changepw"}
<Changepw/>
{:else if $form === "deleteaccount"}
<Deleteaccount/>
{:else if $form === "recordcreate"}
<Recordcreate/>
{:else if $form === "recordok"}
<Recordok/>
{:else if $form === "newevent"}
<Newevent/>
{:else if $form === "challenge"}
<Challenge/>
{/if}


    </div>
  </div>
{/if}

