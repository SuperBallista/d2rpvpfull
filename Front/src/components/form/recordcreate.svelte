<script lang="ts">
    import { onMount } from "svelte";
    import { nicknames, fetchNicknames, myaccount, mode, SecurityFetch, lang } from "../../store";
    import { showMessageBox } from "../../custom/customStore";
  
    let nicknameexceptme:any[] = [];
    let winner:string | null
  
    // 페이지 로드 시 닉네임 목록을 가져오고 현재 사용자 제외
    onMount(() => {
      fetchNicknames($mode);
     nicknameexceptme = $nicknames.filter(item => item !== $myaccount);
  
    });
  
    // 입력 값이 닉네임 목록에 유효한지 확인
    function validateInput(value:string, options:string[]) {
      return options.includes(value) ? value : null;
    }
  
// 승자 선택 핸들러
function handle_winner_change(event: Event): void {
  const target = event.target as HTMLInputElement; // event.target을 명확히 캐스팅
  const thevalue: string = target.value; // target.value는 항상 문자열로 추론됨

  if (typeof thevalue === "string") {
    winner = validateInput(thevalue, nicknameexceptme); // validateInput 호출
  }
}
      
  
    // 기록 전송 함수
    async function submitrecord() {
     
      let data = { winner:winner, mode:$mode }
      try {
        const response = await SecurityFetch("/record/submit", "POST", data)
        if (response.ok) {
         showMessageBox("success", $lang ? "전송 완료" : "Success", $lang ? "기록 전송 완료" : "Your record sended");
        } else {
          showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
        }
      } catch (error) {
        showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
      }
    }
  </script>

  <h3 class="message-title">{$mode} {$lang ? "기록 보내기" : "Send Record"}</h3>

  <div class="message-body">
  
  <input
    list="nicknames_list"
    bind:value={winner}
    on:blur={handle_winner_change}
    class="input-text"
    placeholder={$lang ? "승자를 선택하세요" : "Select Winner"}
  />
  <datalist id="nicknames_list">
    {#each nicknameexceptme as option}
      <option value={option}>{option}</option>
    {/each}
  </datalist>

  <button class="emphasis-button block" on:click={submitrecord}>{$lang ? "보내기" : "Send"}</button>

  </div>