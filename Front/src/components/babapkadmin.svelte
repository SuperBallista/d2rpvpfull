<script lang="ts">
  import { onMount } from "svelte";
  import {
    myaccount,
    nicknames,
    fetchNicknames,
    mode,
    SecurityFetch
  } from "../store.js";
  let player:string;
  let playerscore:number;

  function handle_player_change(event:any) {
    player = validateInput(event.target.value, $nicknames);
  }

  function handle_playerscore_change(event:any) {
    playerscore = event.target.value;
  }

  function validateInput(value:string, options:string[]) {
    return options.includes(value) ? value : "";
  }

  onMount(async () => {
    fetchNicknames($mode);
  });


  async function submit_bonus_score() {
    const data = { player: player, playerScore: playerscore };

    try {
      const response = await SecurityFetch("/admin-score/b_user/submit", "POST", data);

      if (response && response.status === 201) {
        alert("점수 부여 완료");
      } else {
        alert(`에러 발생: ${response.status}`);
      }
    } catch (error) {
      alert("오류 발생");
    }
  }

  async function score_reset() {
    const userResponse = confirm(
      "모든 참가자 점수를 초기화합니다. 계속하시겠습니까?"
    );

    if (userResponse) {
      try {
        const response = await SecurityFetch("/admin-score/b_user/reset", "DELETE");

        if (response && response.status === 200) {
          alert("점수를 초기화하였습니다");
        } else {
          alert(`에러 발생: ${response.status}`);
        }
      } catch (error) {
        alert("오류 발생");
      }
    }
  }
</script>

<div class="main_data">
  {#if $myaccount === "admin"}
    <div class="left">
      직접 점수를 부여할 선수
      <input
        list="nicknames_list"
        bind:value={player}
        on:blur={handle_player_change}
        class="input-text name"
        placeholder="선수 선택"
      />
      <datalist id="nicknames_list">
        {#each $nicknames as option}
          <option value={option}>{option}</option>
        {/each}
      </datalist>
      <input
        type="number"
        bind:value={playerscore}
        on:change={handle_playerscore_change}
        placeholder="점수"
        class="score input-text"
      />
      <button class="simple-button" on:click={submit_bonus_score}>점수 부여하기</button>
      <br />        <br />
      <br />

      <button class="emphasis-button" on:click={score_reset}>모든 점수 초기화하기</button>
    </div>
  {:else}
    <div class="left">권한이 없습니다.</div>
  {/if}
</div>

<style>
    .name{
  width: 140px;
}
.score{
  width: 80px;
}
</style>