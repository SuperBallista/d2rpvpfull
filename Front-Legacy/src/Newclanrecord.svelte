<script>
  import { onMount } from "svelte";
  import { nicknames, fetchNicknames, nickname, mode, SecurityFetch } from "./store.js";

  let nicknameexceptme = [];
  let winner;
  let result = true;

  // 페이지 로드 시 닉네임 목록을 가져오고 현재 사용자 제외
  onMount(async () => {
   await fetchNicknames($mode);
    nicknameexceptme = $nicknames
      .filter((item) => item !== $nickname)
      .map((item) => item.replace(/_m$/, "")); // "_m"을 제거
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
    const data = { winner: winner + "_m", result: result };

    try {
      const response = await SecurityFetch("/clan/record", "POST",data);

      if (response.status===200) {
        alert("기록 전송 완료");
      } else if (response.status===406) {
        alert(`자신 또는 상대의 소속 클랜이 잘못되거나 없습니다`);
      }
    } catch (error) {
      console.error("오류 발생:", error);
      alert("오류 발생: " + error.message);
    }
  }

  function changeresult() {
    result = !result;
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
<input type="checkbox" on:click={() => changeresult()} />무승부<br/>

<button on:click={submitrecord}>보내기</button>
</div>
