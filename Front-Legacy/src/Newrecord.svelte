<script>
  import { onMount } from "svelte";
  import { nicknames, fetchNicknames, nickname, mode, SecurityFetch } from "./store.js";

  let nicknameexceptme = [];
  let winner;

  // 페이지 로드 시 닉네임 목록을 가져오고 현재 사용자 제외
  onMount(() => {
    fetchNicknames($mode);
   nicknameexceptme = $mode ?
   $nicknames.filter(item => item !== $nickname.replace("_m","")) : $nicknames.filter(item => item !== $nickname);

  });

  // 입력 값이 닉네임 목록에 유효한지 확인
  function validateInput(value, options) {
    return options.includes(value) ? value : null;
  }

  // 승자 선택 핸들러
  function handle_winner_change(event) {
    winner = validateInput(event.target.value, nicknameexceptme);
  }

  // 기록 전송 함수
  async function submitrecord() {
   
    const data = $mode ? {winner: winner+"_m", mode: $mode} : { winner:winner, mode:$mode };
    try {
      const response = await SecurityFetch("/record/submit", "POST", data)
      if (response.ok) {
        alert("기록 전송 완료");
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
  승자 고르기
  <input
    list="nicknames_list"
    bind:value={winner}
    on:blur={handle_winner_change}
    class="namewidth"
    placeholder="승자를 선택하세요"
  />
  <datalist id="nicknames_list">
    {#each nicknameexceptme as option}
      <option value={option}>{option}</option>
    {/each}
  </datalist>

  <button on:click={submitrecord}>보내기</button>
</div>
