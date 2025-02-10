<script lang="ts">
    import { onMount } from "svelte";
    import {
      nicknames,
      fetchNicknames,
      mode,
      myaccount, lang,
      SecurityFetch, admin
    } from "../../store";
    import { showMessageBox } from "../../custom/customStore";
  

    onMount(async () => {
      fetchNicknames($mode);
    });
  
    let Championship1:string, Championship2:string, Championship3:string, Championship4:string;
    let Runner_up1:string, Runner_up2:string, Runner_up3:string, Runner_up4:string;
    let Place3rd1:string, Place3rd2:string, Place3rd3:string, Place3rd4:string;
    let teamSize:number = 1, numberteams:number, eventname:string;
    let adminhost = false
    $: Eventhost =  adminhost ? "admin" : $myaccount ;
  
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
        showMessageBox("alert", $lang ? "요청 오류": "Request Error",$lang ? "중복 기록된 선수가 있습니다" : "Do Not input one player twice" )
        return;
      }
  
      const data = {
        Championship1, Championship2, Championship3, Championship4,
        Runner_up1, Runner_up2, Runner_up3, Runner_up4,
        Place3rd1, Place3rd2, Place3rd3, Place3rd4,
        eventname, numberteams, teamSize, Eventhost, mode:$mode
      };
  
      try {
        const response = await SecurityFetch(`/event/submit`, "POST", data);
  
        if (response.status===201)
  { 
    showMessageBox("success", $lang ? "전송 완료" : "Success", $lang ? "기록 전송 완료" : "Event Result Saved");
  } else {
    showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
  }
  
      } catch (error) {
        showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
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
  <h3 class="message-title">{$mode} {$lang ? "토너먼트 기록" : "Event Results"}</h3>

  <div class="message-body">
    <input
      type="text"
      class="titlewidth input-text"
      bind:value={eventname}
      on:change={Handleeventname}
      placeholder={$lang ? "대회 이름" : "Title"}
    />
    <select
      bind:value={numberteams}
      on:change={Handlenumberteams}
      class="optionwidth input-text"
    >
      <option value="2">{$lang ? "2팀(듀얼)" : "Duel"}</option>
      <option value="4">{$lang ? "3-5팀(4강)" : "3-5 Teams"}</option>
      <option value="8">{$lang ? "6-11팀(8강)" : "6-11 Teams"}</option>
      <option value="16">{$lang ? "12팀 이상(16강)" : "More than 12 Teams"}</option>
      <option value="24">{$lang ? "정규전" : "Official"}</option>
    </select>
    <select bind:value={teamSize} on:change={HandleteamSize} class="optionwidth input-text">
      <option value="1">{$lang ? "1인 1팀" : "TeamSize 1"}</option>
      <option value="2">{$lang ? "2인 1팀" : "TeamSize 2"}</option>
      <option value="3">{$lang ? "3인 1팀" : "TeamSize 3"}</option>
      <option value="4">{$lang ? "4인 1팀" : "TeamSize 4"}</option>
    </select>
    <br/>
    {$lang ? "우승" : "1st"}
    <input list="nicknames1" bind:value={Championship1} on:blur={HandleChampionship1} class="namewidth input-text" placeholder={$lang ? "선택하세요" : "Select Player"} />
    <datalist id="nicknames1">
      {#each $nicknames  as option}
        <option value={option}>{option}</option>
      {/each}
    </datalist>
    
    <input list="nicknames2" bind:value={Championship2} on:blur={HandleChampionship2} placeholder={$lang ? "선택하세요" : "Select Player"} class='namewidth input-text {teamSize < 2 ? "hidden" : null}' />
    <datalist id="nicknames2">
      {#each $nicknames  as option}
      <option value={option}>{option}</option>
      {/each}
    </datalist>
    
    <input list="nicknames3" bind:value={Championship3} on:blur={HandleChampionship3} class='namewidth input-text {teamSize < 3 ? "hidden" : null}' placeholder={$lang ? "선택하세요" : "Select Player"}/>
    <datalist id="nicknames3">
      {#each $nicknames  as option}
      <option value={option}>{option}</option>
      {/each}
    </datalist>
    
    <input list="nicknames4" bind:value={Championship4} on:blur={HandleChampionship4} class='namewidth input-text {teamSize < 4 ? "hidden" : null}' placeholder={$lang ? "선택하세요" : "Select Player"} />
    <datalist id="nicknames4">
      {#each $nicknames  as option}
      <option value={option}>{option}</option>
      {/each}
    </datalist>
    <br/>
   <span class={numberteams < 4 ? "hidden" : null}> {$lang ? "2위" : "2nd"} </span>
    <input list="nicknames5" bind:value={Runner_up1} on:blur={HandleRunner_up1} class='namewidth input-text {numberteams < 4 ? "hidden" : null}' placeholder={$lang ? "선택하세요" : "Select Player"} />
    <datalist id="nicknames5">
      {#each $nicknames  as option}
      <option value={option}>{option}</option>
      {/each}
    </datalist>
    
    <input list="nicknames6" bind:value={Runner_up2} on:blur={HandleRunner_up2} class='namewidth input-text {numberteams < 4 || teamSize < 2 ? "hidden" : null}' placeholder={$lang ? "선택하세요" : "Select Player"} />
    <datalist id="nicknames6">
      {#each $nicknames  as option}
      <option value={option}>{option}</option>
      {/each}
    </datalist>
    
    <input list="nicknames7" bind:value={Runner_up3} on:blur={HandleRunner_up3} class='namewidth input-text {numberteams < 4 || teamSize < 3 ? "hidden" : null}' placeholder={$lang ? "선택하세요" : "Select Player"}/>
    <datalist id="nicknames7">
      {#each $nicknames  as option}
      <option value={option}>{option}</option>
      {/each}
    </datalist>
    
    <input list="nicknames8" bind:value={Runner_up4} on:blur={HandleRunner_up4} class='namewidth input-text {numberteams < 4 || teamSize < 4 ? "hidden" : null}' placeholder={$lang ? "선택하세요" : "Select Player"}/>
    <datalist id="nicknames8">
      {#each $nicknames  as option}
      <option value={option}>{option}</option>
      {/each}
    </datalist>
    <br/>

    <span class={numberteams < 8 ? "hidden" : null}>{$lang ? "3위" : "3rd"}</span>
    <input list="nicknames9" bind:value={Place3rd1} on:blur={HandlePlace3rd1} class='namewidth input-text {numberteams < 8 ? "hidden" : null}' placeholder={$lang ? "선택하세요" : "Select Player"} />
    <datalist id="nicknames9">
      {#each $nicknames  as option}
      <option value={option}>{option}</option>
      {/each}
    </datalist>
    
    <input list="nicknames10" bind:value={Place3rd2} on:blur={HandlePlace3rd2} class='namewidth input-text {numberteams < 8 || teamSize < 2 ? "hidden" : null}' placeholder={$lang ? "선택하세요" : "Select Player"} />
    <datalist id="nicknames10">
      {#each $nicknames  as option}
      <option value={option}>{option}</option>
      {/each}
    </datalist>
    
    <input list="nicknames11" bind:value={Place3rd3} on:blur={HandlePlace3rd3} class='namewidth input-text {numberteams < 8 || teamSize < 3 ? "hidden" : null}'placeholder={$lang ? "선택하세요" : "Select Player"}/>
    <datalist id="nicknames11">
      {#each $nicknames  as option}
      <option value={option}>{option}</option>
      {/each}
    </datalist>
    
    <input list="nicknames12" bind:value={Place3rd4} on:blur={HandlePlace3rd4} class='namewidth input-text {numberteams < 8 || teamSize < 4 ? "hidden" : null}' placeholder={$lang ? "선택하세요" : "Select Player"} />
    <datalist id="nicknames12">
      {#each $nicknames  as option}
      <option value={option}>{option}</option>
      {/each}
    </datalist>
    <br/>

      
{#if $admin.includes($mode)}
    <!-- 토글 스위치 -->
<div class="switch-container">
  <div class="toggle-switch {adminhost ? 'on' : ''}" on:click={() => {adminhost = !adminhost}}>
    <div class="slider"></div>
  </div>
  <div class="slider-label">{adminhost ? "운영진 주최" : "개인 주최"}</div>
  </div>
  <br/>
{/if} 


    <button class="emphasis-button" on:click={() => sendEvent()}>{$lang ? "기록 전송" : "Send Result"}</button>
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


  /* 토글 스위치 컨테이너 */
  .toggle-switch {
    position: relative;
    width: 50px;
    height: 25px;
    background-color: #f5f5f5;
    border-radius: 25px;
    cursor: pointer;
    transition: background-color 0.4s;
  }

  /* 슬라이더 핸들 */
  .slider {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 19px;
    height: 19px;
    background-color: #3b3b3b;
    border-radius: 50%;
    transition: transform 0.4s;
  }

  /* 활성화 상태 (ON) */
  .toggle-switch.on {
    background-color: #4e4e4e;
  }

  .toggle-switch.on .slider {
    transform: translateX(25px);
  }
  .slider-label{
    color:#f5f5f5;
    font-size: 19px;
    width: 135px;
    text-align: center;
    height: 25px;
    margin: auto 5px;
  }
  .switch-container{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }


  </style>