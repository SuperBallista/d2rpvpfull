
<script lang="ts">
  import {lang} from "../store"
    interface Winner {
      season: string;
      first: string;
      second: string;
      third: string;
      details: string;
    }

    import { mode }  from "../store"
   
    let hide = $lang ? "이전 시즌 결과 숨기기" : "Hide Past Season"
    let show = $lang ? "이전 시즌 결과 보이기" : "Show Past Season"
    let babapkwinner = [
        {
      season: "2024.10-11 랭킹전",
      first: "마스터",
      second: "DTBar",
      third: "Jay",
      details:
        "비고뇌 정식전 : 1위 DTBAR 2위 Jay 3위 IRONKIM<br/>고뇌 정식전 : 1위 마스터 2위 DTBAR 3위 Jay<br/>2:2 정식전 : 1위 오찬물 수수깡수수 2위 DTBAR IRONKIM 3위 퓨리 마스터<br/>조드 정식전 : 1위 봐바 2위 DUKY 3위 Az",
    },
    {
      season: "2024.9 랭킹전",
      first: "DTbar",
      second: "Duky",
      third: "오찬물",
      details:
        "고뇌 정식전 : 1위 스티븐 2위 Jay 3위 오찬물<br/>비고뇌 정식전 : 1위 BallistaBB 2위 지존 3위 수수깡수수",
    },
    {
      season: "2024.8 랭킹전",
      first: "Duky",
      second: "마스터",
      third: "옥땅",
      details:
        "정식전 : 1위 IRONKIM 2위 배로나 3위 듀키",
    },
    {
      season: "2024.7 랭킹전",
      first: "Duky",
      second: "Jay",
      third: "바아바아",
      details:
        "플레이오프 : 1위 Jay 2위 옥례 3위 Duky<br/>3티어 정식전 : 1위 배로나 2위 오찬물 3위 duky<br/>고뇌 정규전 : 1위 바아바아 2위 오찬물 3위 Duky<br/>레어 정규전 : 1위 낑깡 2위 Ari 3위 su",
    },
  {
      season: "2024.6 랭킹전",
      first: "Head",
      second: "Jay",
      third: "Duky",
      details:
        "3티어 정식전 : 1위 Duky 2위 Jay 3위 IRONKIM<br/>고뇌 정규전 : 1위 Head 2위 jay 3위 봐바<br/>레어 정규전 : 1위 Jay 2위 지존 3위 스티븐",
    },
    {
      season: "2024.5 랭킹전",
      first: "Duky",
      second: "Head",
      third: "IRONKIM",
      details:
        "정식전 : 1위 줍줍 2위 Duky 3위 쭈니바바리안<br/>테마전 : 1위 금복이 2위 goyard 3위 IRONKIM",
    },
    {
      season: "2024.4 랭킹전",
      first: "Jay",
      second: "Duky",
      third: "줍줍",
      details:
        "정식전 : 1위 aerts 2위 Head 3위 jay<br/>테마전 : 아리앗옥례 & 오찬물 & Jay",
    },
    {
      season: "2024.3 랭킹전",
      first: "Duky",
      second: "BigMara",
      third: "팍씨",
      details:
        "정식전 : 1위 Joral_Sinsa 2위 Jak 3위 바바<br/>테마전 : 1위 Jay 2위 아이언킴 3위 오찬물 <br/> 테마전 : 1위 Jay 2위 아이언킴 3위 오찬물",
    },
    {
      season: "2024.2 랭킹전",
      first: "barbar",
      second: "오찬물",
      third: "Duky",
      details:
        "정식전 : 1위 오찬물 2위 BallistaBB 3위 GeonDal<br/>테마전 : 1위 옥례 2위 옥땅 3위 IRONKIM",
    },
    {
      season: "2024.1 랭킹전",
      first: "오찬물",
      second: "Duky",
      third: "Head",
      details: "정식전 : 1위 Duky 2위 Jay 3위 오찬물",
    },
  ]
  let mpkwinner =  [
    {
      season: "2024.11-12 랭킹전",
      first: "제트",
      second: "우리",
      third: "Hyeonmin",
      details: "정규대회 자유전 : 1위 Hyeonmin 2위 Mopalmo 3위 우리<br/>정규대회 FP2전 : 1위 BallistaBB 2위 Hyeonmin 3위 우리",
    },
    {
      season: "2024.10 랭킹전",
      first: "우리",
      second: "스티븐",
      third: "제트",
      details: "24. 10. 정규대회 인내전 : 1위 스티븐 2위 Hell 3위 Madon<br/>24. 10. 정규대회 비인내전 : 1위 우리 2위 파괴 3위 LoPala",
    },
    {
      season: "2024.9 랭킹전",
      first: "스티븐",
      second: "독재",
      third: "BallistaBB",
      details: "24. 9. 정규대회 : 1위 스티븐 2위 독재 3위 Art",
    },
    {
      season: "2024.8 랭킹전",
      first: "스티븐",
      second: "Art",
      third: "허경영",
      details: "-",
    },
    {
      season: "2024.7 랭킹전",
      first: "카니아",
      second: "BallistaBB",
      third: "Art",
      details: "-",
    },
    {
      season: "2024.6 랭킹전",
      first: "스티븐",
      second: "BallistaBB",
      third: "kissa",
      details: "-",
    },
    {
      season: "2024.5 랭킹전",
      first: "BallistaBB",
      second: "스티븐",
      third: "MAX",
      details: "-",
    },
    {
      season: "2024.2 랭킹전",
      first: "Jay",
      second: "제트",
      third: "MAX",
      details: "-",
    },
    {
      season: "2024.1 랭킹전",
      first: "Jay",
      second: "스티븐",
      third: "제트",
      details:
        "23.12 정기전 : 1위 Robe 2위 스티븐 3위 제트<br>23.11 정기전 : 1위 파괴 2위 스티븐 3위 Robe",
    }
  ]
  
  ;
  
    let babapkPastwinner = [
        {
      season: "2023.12 랭킹전",
      first: "Duky",
      second: "Jak",
      third: "아리",
      details: "정식전 : 1위 아리 2위 도라라 3위 Duky ",
    },
    {
      season: "2023.11 랭킹전",
      first: "Jak",
      second: "Duky",
      third: "오찬물",
      details:
        "정식전 : 1위 봐바 2위 도라라 3위 Art_ist <br/> 테마전 : 1위 잼재미 2위 Jak 3위 아리앗옥례",
    },
    {
      season: "2023.10 랭킹전",
      first: "오찬물",
      second: "ALO",
      third: "오찬물",
      details:
        "정식전 : 1위 봐바 2위 배로나 3위 잼재미<br/> 테마전 : 아리 & 오찬물 & 아리앗옥례",
    },
    {
      season: "2023.9 랭킹전",
      first: "오찬물",
      second: "Jak",
      third: "바바",
      details: "정식전 : 1위 오찬물 2위 봐바 3위 IRONKIM",
    },
    {
      season: "2023.8 랭킹전",
      first: "Duky",
      second: "Duky",
      third: "IRONKIM",
      details: "정식전 : 1위 Jak 2위 BB 3위 도적",
    },
    {
      season: "2023.7 랭킹전",
      first: "BB(통합우승)",
      second: "BB(고뇌우승)",
      third: "BB(비고뇌우승)",
      details: "정식전 : 1위 Duky 2위 묵선 3위 오찬물",
    },

    {
      season: "시즌 10",
      first: "ALO",
      second: "ADOOBA",
      third: "Duky",
      details: "정식전 10회 : 1위 도적 2위 ALO 3위 Jak",
    },
    {
      season: "시즌 9",
      first: "스티븐",
      second: "ADOOBA",
      third: "Duky",
      details: "정식전 9회 : 1위 Duky 2위 ADOOBA 3위 Jak",
    },
    {
      season: "시즌 8",
      first: "스티븐",
      second: "Duky",
      third: "ALO",
      details:
        "정식전 8회 : 1위 배로나 2위 Duky 3위 Art_ist<br/>테마전 8회 : 1위 GeonDal 2위 BallistaBB 3위 오찬물",
    },
    {
      season: "시즌 7",
      first: "봐바",
      second: "ALO",
      third: "도라라",
      details:
        "정식전 7회 : 1위 PABLO 2위 야토신 3위 DUTY<br/>테마전 7회 : 1위 ADOOBA & 스티븐 & 도라라 2위  3위 ",
    },
    {
      season: "시즌 6",
      first: "PABLO",
      second: "오찬물",
      third: "ADOOBA",
      details:
        "정식전 6회 : 1위 Joral_Sinsa 2위 GeonDal 3위 RFHH<br/>테마전 6회 : 1위 도적 & Jak 2위  3위 ",
    },
    {
      season: "시즌 5",
      first: "ADOOBA",
      second: "오찬물",
      third: "Joral_Sinsa",
      details:
        "정식전 5회 : 1위 ALO 2위 RFHH 3위 TOONGTANG<br/>테마전 5회 : 1위 돌아돌아 & 파멸 2위  3위 ",
    },
    {
      season: "시즌 4",
      first: "Joral_Sinsa",
      second: "오찬물",
      third: "ADOOBA",
      details:
        "정식전 4회 : 1위 파멸 2위 GG 3위 좀건들지마봐<br/>테마전 4회 : 1위 Az 2위 TOONGTANG 3위 행복한우빈이네",
    },
    {
      season: "시즌 3",
      first: "TOONGTANG",
      second: "Joral_Sinsa",
      third: "ALO",
      details:
        "정식전 3회 : 1위 Thanos 2위 MikeTyson 3위 Az<br/>테마전 3회 : 1위 GG 2위 돌아돌아 3위 TOONGTANG",
    },
    {
      season: "시즌 2",
      first: "TOONGTANG",
      second: "BABBARIAN",
      third: "Thanos",
      details:
        "정식전 2회 : 1위 TOONGTANG 2위 AlwaysReview 3위 Az<br/>테마전 2회 : 1위 BABBARIAN & Thanos 2위  3위 ",
    },
    {
      season: "시즌 1",
      first: "TOONGTANG",
      second: "Thanos",
      third: "AlwaysReview",
      details:
        "정식전 1회 : 1위 돌아돌아 2위 FBI멀더 3위 BallistaBB<br/>테마전 1회 : 1위 TOONGTANG 2위 BallistaBB 3위 PK",
    },
  ]
  
  let mpkPastWinner = [
    {
      season: "2023.10 랭킹전",
      first: "스티븐",
      second: "달빛",
      third: "스티븐",
      details:
        "정기전 : 1위 CASINO 2위 Queen 3위 드루<br/>23.7 정기전 : 1위 Edward 2위 스티븐 3위 모팔모",
    },
    {
      season: "2023.6 랭킹전",
      first: "스티븐",
      second: "BallistaBB",
      third: "yakuza",
      details: "정기전 : 1위 yakuza 2위 BallistaBB 3위 모팔모",
    },
    {
      season: "2023.5 랭킹전",
      first: "Robe",
      second: "달건",
      third: "Boss",
      details:
        "정기전 : 1위 달건 2위 Robe 3위 Joy<br/>테마전 : 1위 Robe 2위 Southbank 3위 Art_ist",
    }];

    let zpkewinner:Winner[] = []
    let zpkePastWinner:Winner[] = []

    
        let winners: Winner[] = []
        let Pastwinners: Winner[] = []
        

        if ($mode === "babapk")
        {winners = babapkwinner
        Pastwinners = babapkPastwinner
        }
        else if ($mode === "mpk")
        {winners = mpkwinner
         Pastwinners = mpkPastWinner          
        }
        else
        {
          winners = zpkewinner
          Pastwinners = zpkePastWinner
        }    


    let showDetails: boolean[] = Array(winners.length).fill(false);
    let showPastDetails: boolean[] = Array(Pastwinners.length).fill(false);
    let showPastWinner: boolean = false;
  
    function toggleDetails(index: number): void {
      showDetails = showDetails.map((val, i) => (i === index ? !val : val));
    }
  
    function togglePastDetails(index: number): void {
      showPastDetails = showPastDetails.map((val, i) => (i === index ? !val : val));
    }
  
    function togglePastwinners(): void {
      showPastWinner = !showPastWinner;
    }
  </script>



<div class="table-outline main_data">
    <table>
      <thead>
        <tr>
          <th>{$lang ? "시즌 이름" : "Season Name"}</th>
          <th>{$lang ? "1위" : "1st"}</th>
          <th>{$lang ? "2위" : "2nd"}</th>
          <th>{$lang ? "3위" : "3rd"}</th>
        </tr>
      </thead>
      <tbody>
        {#each winners as { season, first, second, third, details }, index}
          <tr on:click={() => toggleDetails(index)} class="table-row">
            <td>{season}</td>
            <td>{first}</td>
            <td>{second}</td>
            <td>{third}</td>
          </tr>
          {#if showDetails[index]}
            <tr class="details-row">
              <td colspan="4" class="details">{@html details}</td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  
    <div class="toggle-wrapper">
      <button class="simple-button" on:click={togglePastwinners}>
        {showPastWinner ? hide : show}
      </button>
    </div>
  
    {#if showPastWinner}
      <table>
        <thead>
          <tr>
            <th>{$lang ? "시즌 이름" : "Season Name"}</th>
            <th>{$lang ? "1위" : "1st"}</th>
            <th>{$lang ? "2위" : "2nd"}</th>
            <th>{$lang ? "3위" : "3rd"}</th>
          </tr>
        </thead>
        <tbody>
          {#each Pastwinners as { season, first, second, third, details }, index}
            <tr on:click={() => togglePastDetails(index)} class="table-row">
              <td>{season}</td>
              <td>{first}</td>
              <td>{second}</td>
              <td>{third}</td>
            </tr>
            {#if showPastDetails[index]}
              <tr class="details-row">
                <td colspan="4" class="details">{@html details}</td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    {/if}
  </div>

  <style>
table tr td:first-child, table tr th:first-child {
  width: 30%; /* 첫 번째 열 */
  
}
table tr td:nth-child(2), table tr th:nth-child(2) {
  width: 20%; /* 두 번째 열 */
}
table tr td:nth-child(3), table tr th:nth-child(3) {
  width: 20%; /* 세 번째 열 */
}
table tr td:nth-child(4), table tr th:nth-child(4) {
  width: 20%; /* 네 번째 열 */
}


  </style>