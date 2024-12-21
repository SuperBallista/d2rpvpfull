<script lang="ts">
    import { onMount } from "svelte";
    import {
      nicknames,
      fetchNicknames,
      mode,
      myaccount,
      SecurityFetch, key
    } from "../../store";
  

    onMount(async () => {
      const currentUrl = window.location.href;
      mode.set(currentUrl.includes("/mpk"));
  
      fetchNicknames($mode);
    });
  
    let Championship1:string, Championship2:string, Championship3:string, Championship4:string;
    let Runner_up1:string, Runner_up2:string, Runner_up3:string, Runner_up4:string;
    let Place3rd1:string, Place3rd2:string, Place3rd3:string, Place3rd4:string;
    let teamSize:number, numberteams:number, eventname:string;
    $: Eventhost = $mode === true ? $myaccount.replace("_m","") : $myaccount;
  
    function validateInput(value:string, options:string[]) {
      return options.includes(value) ? value : "";
    }
  
    function checkForDuplicates() {
      if (teamSize < 2) Championship2 = Runner_up2 = Place3rd2 = "";
      if (teamSize < 3) Championship3 = Runner_up3 = Place3rd3 = "";
      if (teamSize < 4) Championship4 = Runner_up4 = Place3rd4 = "";
      if (numberteams < 4) Runner_up1 = Runner_up2 = Runner_up3 = Runner_up4 = "";
      if (numberteams < 8) Place3rd1 = Place3rd2 = Place3rd3 = Place3rd4 = "";
  
      const values = [
        Championship1, Championship2, Championship3, Championship4,
        Runner_up1, Runner_up2, Runner_up3, Runner_up4,
        Place3rd1, Place3rd2, Place3rd3, Place3rd4,
      ];
      const uniqueValues = new Set(values.filter(Boolean));
  
      return uniqueValues.size === values.filter(Boolean).length;
    }
  
    async function sendEvent() {
      if (!checkForDuplicates()) {
        alert("중복 기록된 선수가 있습니다");
        return;
      }
  
      const data = {
        Championship1, Championship2, Championship3, Championship4,
        Runner_up1, Runner_up2, Runner_up3, Runner_up4,
        Place3rd1, Place3rd2, Place3rd3, Place3rd4,
        eventname, numberteams, teamSize, Eventhost
      };
  
      try {
        const response = await SecurityFetch($mode ? "/event/m-user/submit" : "/event/b-user/submit", "POST", data);
  
        if (response.status===201)
  {        alert("대회 기록 전송 완료")}
  
      } catch (error) {
        console.error("오류 발생:", error);
        alert(`오류 발생: ${error}`);
      }
    }
  
    function HandleChampionship1(event:any) { Championship1 = validateInput(event.target.value, $nicknames); }
    function HandleChampionship2(event:any) { Championship2 = validateInput(event.target.value, $nicknames); }
    function HandleChampionship3(event:any) { Championship3 = validateInput(event.target.value, $nicknames); }
    function HandleChampionship4(event:any) { Championship4 = validateInput(event.target.value, $nicknames); }
    function HandleRunner_up1(event:any) { Runner_up1 = validateInput(event.target.value, $nicknames); }
    function HandleRunner_up2(event:any) { Runner_up2 = validateInput(event.target.value, $nicknames); }
    function HandleRunner_up3(event:any) { Runner_up3 = validateInput(event.target.value, $nicknames); }
    function HandleRunner_up4(event:any) { Runner_up4 = validateInput(event.target.value, $nicknames); }
    function HandlePlace3rd1(event:any) { Place3rd1 = validateInput(event.target.value, $nicknames); }
    function HandlePlace3rd2(event:any) { Place3rd2 = validateInput(event.target.value, $nicknames); }
    function HandlePlace3rd3(event:any) { Place3rd3 = validateInput(event.target.value, $nicknames); }
    function HandlePlace3rd4(event:any) { Place3rd4 = validateInput(event.target.value, $nicknames); }
    function Handleeventname(event:any) { eventname = event.target.value; }
    function Handlenumberteams(event:any) { numberteams = event.target.value; }
    function HandleteamSize(event:any) { teamSize = event.target.value; }
  </script>
  <h3 class="message-title">{$mode ? "밀리PK" : "정통바바"} 토너먼트 기록</h3>

  <div class="message-body">
    <input
      type="text"
      class="titlewidth input-text"
      bind:value={eventname}
      on:change={Handleeventname}
      placeholder="대회 이름"
    />
    <select
      bind:value={numberteams}
      on:change={Handlenumberteams}
      class="optionwidth input-text"
    >
      <option value="2">2팀(듀얼)</option>
      <option value="4">3-5팀(4강)</option>
      <option value="8">6-11팀(8강)</option>
      <option value="16">12팀 이상(16강)</option>
      <option value="24">정식전</option>
    </select>
    <select bind:value={teamSize} on:change={HandleteamSize} class="optionwidth input-text">
      <option value="1">1인 1팀</option>
      <option value="2">2인 1팀</option>
      <option value="3">3인 1팀</option>
      <option value="4">4인 1팀</option>
    </select>
    <br/>
    우승
    <input list="nicknames1" bind:value={Championship1} on:blur={HandleChampionship1} class="namewidth input-text" placeholder="선택하세요" />
    <datalist id="nicknames1">
      {#each $nicknames  as option}
        <option value={option}>{option}</option>
      {/each}
    </datalist>
    
    <input list="nicknames2" bind:value={Championship2} on:blur={HandleChampionship2} placeholder="선택하세요" class='namewidth input-text {teamSize < 2 ? "hidden" : null}' />
    <datalist id="nicknames2">
      {#each $nicknames  as option}
      <option value={option}>{option}</option>
      {/each}
    </datalist>
    
    <input list="nicknames3" bind:value={Championship3} on:blur={HandleChampionship3} class='namewidth input-text {teamSize < 3 ? "hidden" : null}' placeholder="선택하세요"/>
    <datalist id="nicknames3">
      {#each $nicknames  as option}
      <option value={option}>{option}</option>
      {/each}
    </datalist>
    
    <input list="nicknames4" bind:value={Championship4} on:blur={HandleChampionship4} class='namewidth input-text {teamSize < 4 ? "hidden" : null}' placeholder="선택하세요" />
    <datalist id="nicknames4">
      {#each $nicknames  as option}
      <option value={option}>{option}</option>
      {/each}
    </datalist>
    <br/>
   <span class={numberteams < 4 ? "hidden" : null}> 2위 </span>
    <input list="nicknames5" bind:value={Runner_up1} on:blur={HandleRunner_up1} class='namewidth input-text {numberteams < 4 ? "hidden" : null}' placeholder="선택하세요" />
    <datalist id="nicknames5">
      {#each $nicknames  as option}
      <option value={option}>{option}</option>
      {/each}
    </datalist>
    
    <input list="nicknames6" bind:value={Runner_up2} on:blur={HandleRunner_up2} class='namewidth input-text {numberteams < 4 || teamSize < 2 ? "hidden" : null}' placeholder="선택하세요" />
    <datalist id="nicknames6">
      {#each $nicknames  as option}
      <option value={option}>{option}</option>
      {/each}
    </datalist>
    
    <input list="nicknames7" bind:value={Runner_up3} on:blur={HandleRunner_up3} class='namewidth input-text {numberteams < 4 || teamSize < 3 ? "hidden" : null}' placeholder="선택하세요"/>
    <datalist id="nicknames7">
      {#each $nicknames  as option}
      <option value={option}>{option}</option>
      {/each}
    </datalist>
    
    <input list="nicknames8" bind:value={Runner_up4} on:blur={HandleRunner_up4} class='namewidth input-text {numberteams < 4 || teamSize < 4 ? "hidden" : null}' placeholder="선택하세요"/>
    <datalist id="nicknames8">
      {#each $nicknames  as option}
      <option value={option}>{option}</option>
      {/each}
    </datalist>
    <br/>

    <span class={numberteams < 8 ? "hidden" : null}>3위</span>
    <input list="nicknames9" bind:value={Place3rd1} on:blur={HandlePlace3rd1} class='namewidth input-text {numberteams < 8 ? "hidden" : null}' placeholder="선택하세요" />
    <datalist id="nicknames9">
      {#each $nicknames  as option}
      <option value={option}>{option}</option>
      {/each}
    </datalist>
    
    <input list="nicknames10" bind:value={Place3rd2} on:blur={HandlePlace3rd2} class='namewidth input-text {numberteams < 8 || teamSize < 2 ? "hidden" : null}' placeholder="선택하세요" />
    <datalist id="nicknames10">
      {#each $nicknames  as option}
      <option value={option}>{option}</option>
      {/each}
    </datalist>
    
    <input list="nicknames11" bind:value={Place3rd3} on:blur={HandlePlace3rd3} class='namewidth input-text {numberteams < 8 || teamSize < 3 ? "hidden" : null}'placeholder="선택하세요"/>
    <datalist id="nicknames11">
      {#each $nicknames  as option}
      <option value={option}>{option}</option>
      {/each}
    </datalist>
    
    <input list="nicknames12" bind:value={Place3rd4} on:blur={HandlePlace3rd4} class='namewidth input-text {numberteams < 8 || teamSize < 4 ? "hidden" : null}' placeholder="선택하세요" />
    <datalist id="nicknames12">
      {#each $nicknames  as option}
      <option value={option}>{option}</option>
      {/each}
    </datalist>
    <br/>
    <button class="emphasis-button" on:click={() => sendEvent()}>대회 기록 전송</button>
  </div>
  
  <style>
.namewidth{
width: 80px;
}
.titlewidth{
    width: 150px;
}
.optionwidth{
    width: 120px;
}
.hidden{
    display: none;
}
@media(max-width: 500px){
.message-body{
overflow: auto;
}
    
}


  </style>