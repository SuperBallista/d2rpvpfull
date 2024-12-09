<script>
  import { onMount } from "svelte";
  import {
    nicknames,
    fetchNicknames,
    mode,
    nickname,
    SecurityFetch
  } from "./store.js";

  onMount(async () => {
    const currentUrl = window.location.href;
    mode.set(currentUrl.includes("/mpk"));

    fetchNicknames($mode);
  });

  let Championship1, Championship2, Championship3, Championship4;
  let Runner_up1, Runner_up2, Runner_up3, Runner_up4;
  let Place3rd1, Place3rd2, Place3rd3, Place3rd4;
  let teamSize, numberteams, eventname;
  $: Eventhost = $nickname === "admin_m" ? "admin" : $nickname;

  function validateInput(value, options) {
    return options.includes(value) ? value : null;
  }

  function checkForDuplicates() {
    if (teamSize < 2) Championship2 = Runner_up2 = Place3rd2 = null;
    if (teamSize < 3) Championship3 = Runner_up3 = Place3rd3 = null;
    if (teamSize < 4) Championship4 = Runner_up4 = Place3rd4 = null;
    if (numberteams < 4) Runner_up1 = Runner_up2 = Runner_up3 = Runner_up4 = null;
    if (numberteams < 8) Place3rd1 = Place3rd2 = Place3rd3 = Place3rd4 = null;

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
      alert(`오류 발생: ${error.message}`);
    }
  }

  function HandleChampionship1(event) { Championship1 = validateInput(event.target.value, $nicknames); }
  function HandleChampionship2(event) { Championship2 = validateInput(event.target.value, $nicknames); }
  function HandleChampionship3(event) { Championship3 = validateInput(event.target.value, $nicknames); }
  function HandleChampionship4(event) { Championship4 = validateInput(event.target.value, $nicknames); }
  function HandleRunner_up1(event) { Runner_up1 = validateInput(event.target.value, $nicknames); }
  function HandleRunner_up2(event) { Runner_up2 = validateInput(event.target.value, $nicknames); }
  function HandleRunner_up3(event) { Runner_up3 = validateInput(event.target.value, $nicknames); }
  function HandleRunner_up4(event) { Runner_up4 = validateInput(event.target.value, $nicknames); }
  function HandlePlace3rd1(event) { Place3rd1 = validateInput(event.target.value, $nicknames); }
  function HandlePlace3rd2(event) { Place3rd2 = validateInput(event.target.value, $nicknames); }
  function HandlePlace3rd3(event) { Place3rd3 = validateInput(event.target.value, $nicknames); }
  function HandlePlace3rd4(event) { Place3rd4 = validateInput(event.target.value, $nicknames); }
  function Handleeventname(event) { eventname = event.target.value; }
  function Handlenumberteams(event) { numberteams = event.target.value; }
  function HandleteamSize(event) { teamSize = event.target.value; }
</script>

<div class="left">
  <input
    type="text"
    class="namewidth"
    bind:value={eventname}
    on:change={Handleeventname}
    placeholder="대회 이름"
  />
  <select
    bind:value={numberteams}
    on:change={Handlenumberteams}
    class="namewidth"
  >
    <option value="2">2팀(듀얼)</option>
    <option value="4">3-5팀(4강)</option>
    <option value="8">6-11팀(8강)</option>
    <option value="16">12팀 이상(16강)</option>
    <option value="24">정식전</option>
  </select>
  <select bind:value={teamSize} on:change={HandleteamSize} class="namewidth">
    <option value="1">1인 1팀</option>
    <option value="2">2인 1팀</option>
    <option value="3">3인 1팀</option>
    <option value="4">4인 1팀</option>
  </select>
  우승자
  <input list="nicknames1" bind:value={Championship1} on:blur={HandleChampionship1} class="namewidth" placeholder="선택하세요" />
  <datalist id="nicknames1">
    {#each $nicknames  as option}
      <option value={option} />
    {/each}
  </datalist>
  
  <input list="nicknames2" bind:value={Championship2} on:blur={HandleChampionship2} class="namewidth" placeholder="선택하세요" disabled={teamSize < 2} />
  <datalist id="nicknames2">
    {#each $nicknames  as option}
      <option value={option} />
    {/each}
  </datalist>
  
  <input list="nicknames3" bind:value={Championship3} on:blur={HandleChampionship3} class="namewidth" placeholder="선택하세요" disabled={teamSize < 3} />
  <datalist id="nicknames3">
    {#each $nicknames  as option}
      <option value={option} />
    {/each}
  </datalist>
  
  <input list="nicknames4" bind:value={Championship4} on:blur={HandleChampionship4} class="namewidth" placeholder="선택하세요" disabled={teamSize < 4} />
  <datalist id="nicknames4">
    {#each $nicknames  as option}
      <option value={option} />
    {/each}
  </datalist>
  
  준우승
  <input list="nicknames5" bind:value={Runner_up1} on:blur={HandleRunner_up1} class="namewidth" placeholder="선택하세요" disabled={numberteams < 4} />
  <datalist id="nicknames5">
    {#each $nicknames  as option}
      <option value={option} />
    {/each}
  </datalist>
  
  <input list="nicknames6" bind:value={Runner_up2} on:blur={HandleRunner_up2} class="namewidth" placeholder="선택하세요" disabled={numberteams < 4 || teamSize < 2} />
  <datalist id="nicknames6">
    {#each $nicknames  as option}
      <option value={option} />
    {/each}
  </datalist>
  
  <input list="nicknames7" bind:value={Runner_up3} on:blur={HandleRunner_up3} class="namewidth" placeholder="선택하세요" disabled={numberteams < 4 || teamSize < 3} />
  <datalist id="nicknames7">
    {#each $nicknames  as option}
      <option value={option} />
    {/each}
  </datalist>
  
  <input list="nicknames8" bind:value={Runner_up4} on:blur={HandleRunner_up4} class="namewidth" placeholder="선택하세요" disabled={numberteams < 4 || teamSize < 4} />
  <datalist id="nicknames8">
    {#each $nicknames  as option}
      <option value={option} />
    {/each}
  </datalist>
  
  3위
  <input list="nicknames9" bind:value={Place3rd1} on:blur={HandlePlace3rd1} class="namewidth" placeholder="선택하세요" disabled={numberteams < 8} />
  <datalist id="nicknames9">
    {#each $nicknames  as option}
      <option value={option} />
    {/each}
  </datalist>
  
  <input list="nicknames10" bind:value={Place3rd2} on:blur={HandlePlace3rd2} class="namewidth" placeholder="선택하세요" disabled={numberteams < 8 || teamSize < 2} />
  <datalist id="nicknames10">
    {#each $nicknames  as option}
      <option value={option} />
    {/each}
  </datalist>
  
  <input list="nicknames11" bind:value={Place3rd3} on:blur={HandlePlace3rd3} class="namewidth" placeholder="선택하세요" disabled={numberteams < 8 || teamSize < 3} />
  <datalist id="nicknames11">
    {#each $nicknames  as option}
      <option value={option} />
    {/each}
  </datalist>
  
  <input list="nicknames12" bind:value={Place3rd4} on:blur={HandlePlace3rd4} class="namewidth" placeholder="선택하세요" disabled={numberteams < 8 || teamSize < 4} />
  <datalist id="nicknames12">
    {#each $nicknames  as option}
      <option value={option} />
    {/each}
  </datalist>
  
  <button on:click={() => sendEvent()}>대회 기록 전송</button>
</div>
