<script lang="ts">
    import { onMount } from "svelte";
    import {
      myaccount,
      nicknames,
      mode,
      fetchNicknames,
    //   fetechClanList,
    //   clanlists,
      SecurityFetch
    } from "../store.js";
  
    let player:string;
    // let playerclan;
    let playerscore:number;
//     let clan = 'none';
//     let clanscore;
//   let newclan = ""
  
  
    function handle_player_change(event:any) {
      player = validateInput(event.target.value, $nicknames);
    }
  
    // function handle_playerclan_change(event:any) {
    //   playerclan = validateInput(event.target.value, $nicknames);
    // }
  
    // function handle_clanscore_change(event:any) {
    //   playerscore = event.target.value;
    // }
  
  
  
    function handle_playerscore_change(event:any) {
      playerscore = event.target.value;
    }
  
    function validateInput(value:string, options:string[]) {
      return options.includes(value) ? value : "";
    }
  
    onMount(() => {
      fetchNicknames($mode);
    //   fetechClanList();
    });
  
    // 점수 부여
    async function submit_bonus_score() {
      const data = { player: player, playerScore: playerscore };
      try {
        const response = await SecurityFetch("/admin-score/mpk/submit", "POST", data);

      if  (response.status===201) {
        alert("점수 부여 완료")
      }

      } catch (error) {
        alert("오류 발생");
      }
    }


  
    // 점수 초기화
    async function score_reset() {
      const userResponse = confirm(
        "모든 참가자 점수를 초기화합니다. 계속하시겠습니까?"
      );
  
      if (userResponse) {
        try {
         const response = await SecurityFetch("/admin-score/mpk/reset", "DELETE");
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
  
  
  
//    async function submit_clan_score() {
//     const data = { clan: clan, clanScore: clanscore };
//       try {
//         const response = await SecurityFetch("/admin_clan_score", "POST", data);
//         alert(clan ,"클랜 점수 부여 완료");
//       } catch (error) {
//         alert("오류 발생 :", error);
//       }
    
//    }
  
//    async function submit_clan_delete() {
//     const data = {clan: clan};
//     const userResponse = confirm(`${clan} 클랜을 삭제합니다. 계속하시겠습니까?`);
  
//     if (userResponse) {
//      try {
//       const response = await SecurityFetch("/admin_clan_delete", "DELETE", data);
//       alert(`${clan} 클랜 삭제 완료`);
//       fetechClanList();
//     } catch (error) {
//         alert("오류 발생 :", error);
//       }
//     }
//    }
  
//    async function submit_new_clan() {
//     const data = {clan: newclan};
//      try {
//       const response = await SecurityFetch("/admin_clan_create", "POST", data);
//         alert(`${newclan} 클랜 추가 완료`);
//         fetechClanList();
//       } catch (error) {
//         alert("오류 발생 :", error);
//       }
//      }
  
  
  </script>
  
  <div class="main_data">
    {#if $myaccount === "admin_m"}
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
          class="input-text score"
        />
        <button class="simple-button" on:click={submit_bonus_score}>점수 부여하기</button>
        <br />        <br />
        <br />

        <button class="emphasis-button" on:click={score_reset}>모든 점수 초기화하기</button>
        <br/> <br/>
        <!-- <div class="left">
          이 선수의 소속 클랜 초기화하기
          <input
          list="nicknames_list"
          bind:value={playerclan}
          on:blur={handle_playerclan_change}
          class="namewidth"
          placeholder="선수 선택"
        />
        <button on:click={submit_clan_reset}>클랜초기화하기</button>
        <br/> <br/>
        이 클랜에 점수 부여 / 삭제
        <select bind:value={clan} class="namewidth">
          <option value="none">클랜을 선택하세요</option>
          {#each $clanlists as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
        <input
          type="number"
          bind:value={clanscore}
          on:change={handle_clanscore_change}
          placeholder="점수"
          class="scorewidth"
        />
        <button on:click={submit_clan_score}>점수 부여하기</button><br/>
        <button on:click={submit_clan_delete}>이 클랜 삭제하기</button>
        </div>
        
        <br/><br/>
        <input type="text" class="namewidth" placeholder="클랜명 입력" bind:value={newclan}>
        <button on:click={submit_new_clan}>클랜 추가하기</button><br/> -->
  
  
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