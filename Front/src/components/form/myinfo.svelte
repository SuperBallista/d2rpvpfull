<script lang="ts">
    import { onMount } from "svelte";
    import {
      myaccount,
      mode,
      form,
      SecurityFetch,
      jwtToken, email,
      myUnionAccount,
      mybabapk,
      mympk,
      myzpke
    } from "../../store";
  import { navigate } from "svelte-routing";
  
    let rscore = "Loading";
    let bscore = "Loading";
    let lscore = "Loading";
    let wins = "Loading";
    let loses = "Loading";
    // let clan = "Loading";
    // let clanwin = "Loading";
    // let clanlose = "Loading";
    // let clandraw = "Loading";
    let challenge = "";
    let challengeDate = "";
  
    async function fetchGameData() {
      const endpoint = `/userdata/info`;
  
      try {
        const response = await SecurityFetch(endpoint, "POST", {mode: $mode, nickname: $myaccount});
        if (response.ok) {
          const data = await response.json();
          if ($mode != "babapk") {
          //   email = data.email;
          //   lscore = data.lscore;
          //   clan = data.clan;
          //   clanwin = data.clanwin;
          //   clanlose = data.clanlose;
          //   clandraw = data.clandraw;
            challenge = data.challenge;
            challengeDate = data.challengeDate;
          } 
            bscore = data.bscore;
            lscore = data.lscore;
            // rscore = data.rscore;
            wins = data.countwin;
            loses = data.countlose;
        }
      } catch (error) {
        console.error("정보를 불러오는 중 오류가 발생하였습니다:", error);
        alert("정보를 불러오는 중 오류가 발생하였습니다");
      }
    }
  
    async function cancelChallenge() {
      const data = { mode: $mode, challenge: challenge };
  
      try {
        const response = await SecurityFetch("/userdata/challenge/cancel", "DELETE", data);
        if (response.status === 200) {
          alert("도전 중인 게임 정보를 삭제하였습니다");
        }
      } catch (error) {
        console.error("요청에 실패하였습니다", error);
        alert("요청에 실패하였습니다");
      }
    }
  
    async function CheckTimeOver() {
  const data = { mode: $mode, challenge: challenge };

  try {
    const response = await SecurityFetch("/record/challenge/check", "POST", data);

    // JSON 응답 처리
    const responseData = await response.json();

    if (response.status === 201) {
      alert("도전 기간에 상대가 응답하지 않아 자동 승리로 입력되었습니다");
    } else if (response.status === 400) {
      alert(responseData.message || "도전 중이 아니거나 응답 기간이 끝나지 않았습니다");
    } else {
      alert("알 수 없는 상태 코드: " + response.status);
    }
  } catch (error) {
    // 예상치 못한 네트워크 오류 처리
    console.error("요청에 실패하였습니다:", error);
    alert("요청 처리 중 오류가 발생했습니다. 네트워크 상태를 확인해주세요.");
  }
}

  
    onMount(() => {
      fetchGameData();
    });

    async function logout() {
    try{
 await SecurityFetch("/auth/logout", "POST")
  alert("로그아웃하였습니다")  
  navigate($mode === "babapk"? "/" : "/"+$mode)
  form.set("none")
  myaccount.set("")
  myUnionAccount.set("")
  mybabapk.set("")
  mympk.set("")
  myzpke.set("")
  jwtToken.set("")
  email.set("")
  }
    catch (error)
    {
      alert(error)
    }

      
    }


  </script>
  
  <h3 class="message-title">내 정보 확인</h3>

  <div class="message-body">

  <table class="info-table">
    <tbody>
      <tr>
        <td>캐릭터</td>
        <td>{$myaccount.replace("_m","").replace("_z","")}</td>
        <td><button class="simple-button" on:click={() => logout()}>로그아웃</button></td>
      </tr>
      <!-- <tr>
        <td>암호</td>
        <td>********</td>
        <td>
          <button class="simple-button" on:click={() => form.set("changepw")}>변경</button>
        </td>
      </tr> -->
      {#if $mode != "babapk"}
        <!-- <tr>
          <td>대회점수</td>
          <td>{lscore}</td>
          <td></td>
        </tr> -->
        <!-- <tr>
          <td>소속 클랜</td>
          <td>{clan}</td>
          <td>
            {#if clan === "none"}
              <button class="simple-button" on:click={() => form.set("clanjoin")}>클랜 가입</button>
            {/if}
          </td>
        </tr>
        <tr>
          <td>클랜전 승무패</td>
          <td>{clanwin}/{clandraw}/{clanlose}</td>
          <td></td>
        </tr> -->
        <tr> 
          <td>도전 신청</td>
          <td>{challenge ? challenge.replace("_m","") : ""}</td>
          <td>
            <button  class="simple-button {challenge===""? "hidden" : null}" on:click={() => cancelChallenge()}>도전 취소</button>
          </td>
        </tr>
        <tr>
          <td>도전 날짜</td>
          <td>{challengeDate || ""}</td>
          <td>
            <button class="simple-button {challenge==="" ? "hidden" : null}" on:click={() => CheckTimeOver()}>자동 승리</button>
          </td>
        </tr>
        {/if}
      <!-- {:else} -->
        <tr>
          <td>대전점수</td>
          <td>{bscore}</td>
          <td></td>
        </tr>
        <tr>
          <td>대회점수</td>
          <td>{lscore}</td>
          <td></td>
        </tr>
        <tr>
          <td>승/패</td>
          <td>{wins}/{loses}</td>
          <td></td>
        </tr>
      <!-- <tr>
        <td>탈퇴</td>
        <td></td>
        <td>
          <button class="simple-button" on:click={() => form.set("deleteaccount")}>탈퇴</button>
        </td>
      </tr> -->
    </tbody>
  </table>
  </div>

  <style>

.info-table{
  width: 100%;
  max-width: 100%; /* 테이블이 화면 너비를 초과하지 않도록 제한 */
  table-layout: fixed; /* 테이블 셀 크기를 고정 */
  overflow-x: auto; /* 가로 스크롤 허용 */
  font-size: 0.8rem;
}

tr td:first-child{
width: 30%;

}
tr td:nth-child(2){
  width: 40%;
  max-width: 40%;
  white-space: nowrap;
  overflow: scroll;
}
tr td:nth-child(3){
  width: 30%;
}
.simple-button{
  font-size: 0.7rem;
  padding: 3px
}
.hidden{
  display: none;
}
  </style>