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
      myzpke,
      admin, lang

    } from "../../store";
  import { navigate } from "svelte-routing";
    import { showMessageBox } from "../../custom/customStore";
  
    let bscore = "Loading";
    let lscore = "Loading";
    let wins = "Loading";
    let loses = "Loading";
    let challenge = "";
    let challengeDate = "";
  
    async function fetchGameData() {
      const endpoint = `/userdata/info`;
  
      try {
        const response = await SecurityFetch(endpoint, "POST", {mode: $mode, nickname: $myaccount});
        if (response.ok) {
          const data = await response.json();
          if ($mode != "babapk") {
            challenge = data.challenge;
            challengeDate = data.challengeDate;
          } 
            bscore = data.bscore;
            lscore = data.lscore;
            wins = data.countwin;
            loses = data.countlose;
        }
      } catch (error) {
        showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
      }
    }
  
    async function cancelChallenge() {
      const data = { mode: $mode, challenge: challenge };
  
      try {
        const response = await SecurityFetch("/userdata/challenge/cancel", "DELETE", data);
        if (response.status === 200) {
          showMessageBox("success", $lang ? "삭제 성공": "Success", $lang ? "도전 중인 게임 정보를 삭제하였습니다" : "You cancel challenge")
        }
        else {
          showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
        }
      } catch (error) {
        showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
      }
    }
  
    async function CheckTimeOver() {
  const data = { mode: $mode, challenge: challenge };

  try {
    const response = await SecurityFetch("/record/challenge/check", "POST", data);

    // JSON 응답 처리
    const responseData = await response.json();

    const msg = $lang ? "도전 중이 아니거나 응답 기간이 끝나지 않았습니다" : "You didn't challenge game or it is still within the period."
    
    if (response.status === 201) {
      showMessageBox("alert",$lang ? "기권 승리":"Wins", $lang ? "도전 기간에 상대가 응답하지 않아 자동 승리로 입력되었습니다" : "You win because your Opposite give up the match");
    } else if (response.status === 400) {
      showMessageBox("alert", $lang ? "잘못된 요청": "Request Error", responseData.message || msg)
      } else {
        showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
      }
  } catch (error) {
    // 예상치 못한 네트워크 오류 처리
    showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
  }
}

  
    onMount(() => {
      fetchGameData();
    });

    async function logout() {
    try{
const response = await SecurityFetch("/auth/logout", "POST")
 if (response.status===200)
 {
 showMessageBox("success", $lang? "로그아웃" : "LogOut", $lang ? "로그아웃하였습니다" : "Logout success" )  
 navigate($mode === "babapk"? "/" : "/"+$mode)
  form.set("none")
  myaccount.set("")
  myUnionAccount.set("")
  mybabapk.set("")
  mympk.set("")
  myzpke.set("")
  jwtToken.set("")
  email.set("")
  admin.set([])
  }
  else {
    showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
  }}
    catch (error)
    {
      showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
    }

      
    }


  </script>
  
  <h3 class="message-title">{$lang ? "내 정보 확인" : "My Pages"}</h3>

  <div class="message-body">

  <table class="info-table">
    <tbody>
      <tr>
        <td>{$lang ? "캐릭터" : "Character"}</td>
        <td>{$myaccount.replace("_m","").replace("_z","")}</td>
        <td><button class="simple-button" on:click={() => logout()}>{$lang ? "로그아웃" : "Leave"}</button></td>
      </tr>
      {#if $mode != "babapk"}
        <tr> 
          <td>{$lang ? "도전 신청" : "Challenge"}</td>
          <td>{challenge ? challenge.replace("_m","") : ""}</td>
          <td>
            <button  class="simple-button {challenge===""? "hidden" : null}" on:click={() => cancelChallenge()}>{$lang ? "도전 취소" : "Cancel"}</button>
          </td>
        </tr>
        <tr>
          <td>{$lang ? "도전 날짜" : "Challenge Date"}</td>
          <td>{challengeDate || ""}</td>
          <td>
            <button class="simple-button {challenge==="" ? "hidden" : null}" on:click={() => CheckTimeOver()}>{$lang ? "자동 승리" : "Check Date"}</button>
          </td>
        </tr>
        {/if}
      <!-- {:else} -->
        <tr>
          <td>{$lang ? "대전 점수" : "Battle Score"}</td>
          <td>{bscore}</td>
          <td></td>
        </tr>
        <tr>
          <td>{$lang ? "대회 점수" : "Event Score"}</td>
          <td>{lscore}</td>
          <td></td>
        </tr>
        <tr>
          <td>{$lang ? "승/패" : "Win/Lose"}</td>
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
  font-size: 0.8rem;
}

tr td:first-child{
width: 30%;

}
tr td:nth-child(2){
  width: 40%;
  max-width: 40%;
  white-space: nowrap;
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