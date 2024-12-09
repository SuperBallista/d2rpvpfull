<script>
  import { onMount } from "svelte";
  import {
    nickname,
    nicknames,
    fetchNicknames,
    mode,
    SecurityFetch
  } from "../store.js";
  let player;
  let playerscore;

  function handle_player_change(event) {
    player = validateInput(event.target.value, $nicknames);
  }

  function handle_playerscore_change(event) {
    playerscore = event.target.value;
  }

  function validateInput(value, options) {
    return options.includes(value) ? value : null;
  }

  onMount(async () => {
    fetchNicknames($mode);
  });


  async function submit_bonus_score() {
    const data = { player: player, playerScore: playerscore };

    try {
      const response = await SecurityFetch("/admin-score/submit/b_user", "POST", data);

      if (response && response.status === 200) {
        alert("점수 부여 완료");
      } else {
        alert(`에러 발생: ${response.status}`);
      }
    } catch (error) {
      alert("오류 발생 :", error);
    }
  }

  async function score_reset() {
    const userResponse = confirm(
      "모든 참가자 점수를 초기화합니다. 계속하시겠습니까?"
    );

    if (userResponse) {
      try {
        const response = await SecurityFetch("/admin-score/reset/b_user", "POST");

        if (response && response.status === 200) {
          alert("점수를 초기화하였습니다");
        } else {
          alert(`에러 발생: ${response.status}`);
        }
      } catch (error) {
        alert("오류 발생 :", error);
      }
    }
  }
</script>
<svelte:head>
    <title>babapk 관리자 페이지</title>
</svelte:head>

<div class="main_data">
  {#if $nickname === "admin"}
    <div class="left">
      직접 점수를 부여할 선수
      <input
        list="nicknames_list"
        bind:value={player}
        on:blur={handle_player_change}
        class="namewidth"
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
        class="scorewidth"
      />
      <button on:click={submit_bonus_score}>점수 부여하기</button>
      <br />
      <button on:click={score_reset}>모든 점수 초기화하기</button>
    </div>
  {:else}
    <div class="left">권한이 없습니다.</div>
  {/if}
</div>
