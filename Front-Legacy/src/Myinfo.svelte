<script>
  import { onMount } from "svelte";
  import {
    nickname,
    mode,
    clickformopen,
    SecurityFetch
  } from "./store.js";
  import Challenge from "./Challenge.svelte";

  let email = "Loading";
  let rscore = "Loading";
  let bscore = "Loading";
  let lscore = "Loading";
  let wins = "Loading";
  let loses = "Loading";
  let clan = "Loading";
  let clanwin = "Loading";
  let clanlose = "Loading";
let clandraw = "Loading";
let challenge = null;
let challengeDate = null;

  // 사용자 정보가 저장된 세션 데이터를 가져오는 함수
  async function fetchGameData() {
    const fetchData = async () => {
      const endpoint = $mode ? "/userdata/info/m-user" : "/userdata/info/b-user";
      const response = await SecurityFetch(endpoint,"GET")
      return response;
    };

    try {
      let response = await fetchData();

      if (response.ok) {
        const data = await response.json();

        if ($mode) {
          email = data.email;
          lscore = data.lscore;
          clan = data.clan;
          clanwin = data.clanwin;
          clanlose = data.clanlose;
          clandraw = data.clandraw;
          challenge = data.Challenge;
          challengeDate = data.ChallengeDate;
        } else {
        email = data.email;
        bscore = data.bscore;
        lscore = data.lscore;
        rscore = data.rscore;
        wins = data.countwin;
        loses = data.countlose;
      } }
    } catch (error) {
      console.error("정보를 불러오는 중 오류가 발생하였습니다:", error);
      alert("정보를 불러오는 중 오류가 발생하였습니다");
    }
  }


  async function cancelChallenge() {
    const data = {mode: $mode, challenge: challenge}

    try{
    const response = await SecurityFetch("/userdata/challenge/cancel","DELETE",data);
    if (response.status===200)
{alert("도전 중인 게임 정보를 삭제하였습니다")}

  }
catch (error) {
console.error("요청에 실패하였습니다", error);
alert("요청에 실패하였습니다");
}

  }


  async function CheckTimeOver() {
    const data = {mode: $mode, challenge: challenge}

    try{
    const response = await SecurityFetch("/userdata/challenge/check","DELETE",data);
    if (response.status===200)
{alert("도전 기간에 상대가 응답하지 않아 자동 승리로 입력되었습니다")

} else if (response.status===400)
{
alert("도전 중이 아니거나 응답 기간이 끝나지 않았습니다")
}

  }
catch (error) {
console.error("요청에 실패하였습니다", error);
alert("요청에 실패하였습니다");
}

  }





  onMount(() => {
    fetchGameData();
  });
</script>

<div class="outline">
  <div class="info-flexbox">
    <div class="info-name">닉네임</div>
    <div class="info-data">
      {$mode ? $nickname.replace("_m", "") : $nickname}
    </div>
  </div>
  <div class="info-flexbox">
    <div class="info-name-data">{email}</div>
  </div>
  <div class="info-flexbox">
    <div class="info-name">
      <button on:click={() => clickformopen("changepw")}>암호 변경</button>
    </div>
    <div class="info-data">
      <button on:click={() => clickformopen("changeemail")}>이메일 변경</button>
    </div>
  </div>{#if $mode} <div class="info-flexbox">
    <div class="info-name">대회점수</div>
    <div class="info-data">{lscore}</div>
  </div>
  <div class="info-flexbox">
    <div class="info-name">소속클랜</div>
    <div class="info-data">{clan}</div>
  </div>
  {#if clan==="none"} 
  <div class="info-data">
   <button on:click={() => clickformopen("clanjoin")}>클랜가입</button>
 </div>
 {/if}
  <div class="info-flexbox">
    <div class="info-name">클랜전승무패</div>
    <div class="info-data">{clanwin}/{clandraw}/{clanlose}</div>
  </div>
  <div class="info-flexbox">
    <div class="info-name">도전 신청</div>
    <div class="info-data">{challenge ? challenge.replace("_m","") : ""}</div>
  </div>
  <div class="info-flexbox">
    <div class="info-name">도전 날짜</div>
    <div class="info-data">{challengeDate ? challengeDate : ""}</div>
  </div>
  <div class="info-flexbox">
    <div class="info-name"> <button on:click={() => cancelChallenge()}>도전 취소</button></div>
    <div class="info-data"> <button on:click={() => CheckTimeOver()}>자동 승리</button></div>
  </div>


  {:else}
     
   <div class="info-flexbox">
    <div class="info-name">대전점수</div>
    <div class="info-data">{bscore}</div>
  </div>
  <div class="info-flexbox">
    <div class="info-name">미니대회점수</div>
    <div class="info-data">{lscore}</div>
  </div>
  <div class="info-flexbox">
    <div class="info-name">정규대회점수</div>
    <div class="info-data">{rscore}</div>
  </div>
  <div class="info-flexbox">
    <div class="info-name">승/패</div>
    <div class="info-data">{wins}/{loses}</div>
  </div>
{/if}

  <div class="info-data">
    <button on:click={() => clickformopen("deleteaccount")}>계정 탈퇴</button>
  </div>
</div>

<style>
  .outline {
    margin-top: 20px;
  }
  .info-flexbox {
    display: flex;
  }
  .info-name {
    width: 300px;
    text-align: center;
    font-size: 20px;
  }
  .info-data {
    width: 300px;
    text-align: center;
    font-size: 20px;
  }
  .info-name-data {
    text-align: center;
    width: 600px;
    font-size: 20px;
  }
</style>
