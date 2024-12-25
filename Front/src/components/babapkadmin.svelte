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
    fetchClanList();
  });


  let playerclan:string
  let clan:string
  let clanlists:any[]
  let clanscore:number
  let newclan:string



async function fetchClanList(): Promise<void> {
  const endpoint = `/clan/${$mode}/list`;

  try {
    const response = await SecurityFetch(endpoint, "GET");
    if (response.status === 200) {
      clanlists = await response.json();

      // clanData에서 name 필드만 추출하여 배열 생성
    } else {
      console.error(`Error: Received status ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching clan list:", error);
  }
}


  async function submit_bonus_score() {
    const data = { player: player, playerScore: playerscore };

    try {
      const response = await SecurityFetch("/admin-score/babapk/submit", "POST", data);

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
        const response = await SecurityFetch("/admin-score/babapk/reset", "DELETE");

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



    // 클랜소속 초기화
    async function submit_clan_reset() {
      const data = { player: playerclan };
      try {
        const response = await SecurityFetch(`/clan/${$mode}/reset`, "POST", data);
        alert("해당 선수 클랜 리셋 완료");
      } catch (error) {
        alert("오류 발생 :" + error);
      }
    }
  
    async function createClan(name:string): Promise<void>
    {
       const endpoint = `/clan/${$mode}/create`
       const data = {name: name}
    try{
        const response = await SecurityFetch(endpoint, "POST", data)
        if (response.status===201)
    {
        alert("클랜 생성에 성공하였습니다")
    }
     else if (response.status===400)
     {
        alert("클랜 생성에 실패하였습니다")
     }
    }
    catch (error)
    {
        alert("클랜 생성에 실패하였습니다")
    }

}


    function handle_playerclan_change(event:any) {
      playerclan = validateInput(event.target.value, $nicknames);
    }
  
    function handle_clanscore_change(event:any) {
      clanscore = event.target.value;
    }
  
   async function submit_clan_score() {
    const data = { clan: clan, clanScore: clanscore };
      try {
        const response = await SecurityFetch(`/clan/${$mode}/score`, "POST", data);
        if (response.status===201)
        {alert(clan + " 클랜 점수 부여 완료")}
        else
        {alert("오류 발생")};
      } catch (error) {
        alert("오류 발생 :" + error);
      }
    
   }
  
   async function submit_clan_delete() {
    const data = {clan: clan};
    const userResponse = confirm(`${clan} 클랜을 삭제합니다. 계속하시겠습니까?`);
  
    if (userResponse) {
     try {
      const response = await SecurityFetch(`/clan/${$mode}/delete`, "DELETE", data);
      alert(`${clan} 클랜 삭제 완료`);
      fetchClanList();
    } catch (error) {
        alert("오류 발생 :" + error);
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

      <button class="emphasis-button" on:click={score_reset}>모든 점수 초기화하기</button>
      <br/>
      <br/>

           <div class="left">
          이 선수의 소속 클랜 초기화하기
          <input
          list="nicknames_list"
          bind:value={playerclan}
          on:blur={handle_playerclan_change}
          class="input-text name"
          placeholder="선수 선택"
        />
        <button class="simple-button" on:click={submit_clan_reset}>클랜초기화하기</button>
        <br/> <br/>
        클랜 점수 변경/삭제
        <select bind:value={clan} class="input-text name">
          <option value="none">클랜을 선택하세요</option>
          {#each clanlists as option}
            <option value={option.name}>{option.name}</option>
          {/each}
        </select>
        <input
          type="number"
          bind:value={clanscore}
          on:change={handle_clanscore_change}
          placeholder="점수"
          class="input-text score"
        />
        <button class="simple-button" on:click={() => submit_clan_score()}>점수 부여하기</button>
        <button class="emphasis-button" on:click={() => submit_clan_delete()}>이 클랜 삭제하기</button>
      </div></div>

        <br/><br/>
        <input type="text" class="input-text name" placeholder="클랜명 입력" bind:value={newclan}>
        <button class="simple-button" on:click={() => createClan(newclan)}>클랜 추가하기</button><br/>
  



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