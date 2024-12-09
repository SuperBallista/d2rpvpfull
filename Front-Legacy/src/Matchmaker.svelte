<script>
  import { onMount } from "svelte";
  import { nicknames, fetchNicknames, mode } from "./store.js";

  function combineGroups(groupedNicknames, teamSize) {
  // 합쳐진 그룹을 저장할 배열
  let combinedGroups = [];
  
  // 임시로 그룹을 저장할 배열
  let tempGroup = [];

  // groupedNicknames를 순회하면서 그룹을 결합
  groupedNicknames.forEach(group => {
    // group이 배열이면 각 요소를 tempGroup에 추가
    if (Array.isArray(group)) {
      tempGroup.push(...group);
    } else {
      tempGroup.push(group);
    }
    
    // tempGroup의 길이가 teamSize와 같으면 combinedGroups에 추가
    while (tempGroup.length >= teamSize) {
      combinedGroups.push(tempGroup.splice(0, teamSize).join(' & '));
    }
  });

  // 남은 요소가 있으면 combinedGroups에 추가
  if (tempGroup.length > 0) {
    combinedGroups.push(tempGroup.join(' & '));
  }

  return combinedGroups;
}




  // onMount 훅을 통해 컴포넌트가 마운트될 때 nicknames를 가져옵니다.
  onMount(async () => {
    await fetchNicknames($mode);
  });

  let rounds = [];
  let joined_member = 8;
  let teamSize = 1;
  let teamNumber;
  let pre_game;
  let main_game;
  let memberNickname = Array(joined_member).fill(""); // 초기화
  let memberResults = Array(joined_member).fill(0); // 각 참가자의 성적을 저장할 배열
  let show = false;
  let groupedNicknames = [];
  let hasDuplicates = false; // 중복 여부 확인 변수
  let objectsArray = [];
  let clicked = false;
  const main_game_player = [];
  const pre_game_player = [];
  let filteredNicknames = []; // 필터링된 닉네임 저장

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function handle_memberNickname(event, index) {
    memberNickname[index] = event.target.value;
    filterNicknames(event.target.value); // 입력 시 필터 적용
  }

  function handle_joined_member(event) {
    joined_member = Number(event.target.value);
    memberNickname = Array(joined_member).fill(""); // joined_member 변경 시 배열 초기화
    memberResults = Array(joined_member).fill(0); // 성적 배열도 초기화
  }

  function input_number() {
    if (joined_member % teamSize === 0) {
      teamNumber = Number(joined_member / teamSize);
      pre_game = 2 * (teamNumber - (2 ** Math.floor(Math.log2(teamNumber), 0)));
      main_game = teamNumber - pre_game;
      show = true;
    } else {
      alert("전체 인원이 팀 인원으로 나누어 떨어지지 않습니다");
    }
  }


  function checkForDuplicates() {
    const counts = {};
    hasDuplicates = false;
    for (const name of memberNickname) {
      if (counts[name]) {
        hasDuplicates = true;
        break;
      }
      counts[name] = 1;
    }
  }

  async function updateObjectsArray() {
    checkForDuplicates();
    if (hasDuplicates) {
      alert('중복 입력된 선수가 있습니다');
    } else {
      clicked = true;
      if (teamSize == 1) {
        try {
          const rankendpoint = $mode ? '/rank/m-user' : '/rank/b-user';
          const response = await fetch(rankendpoint);
          if (response.status === 200) {
            const data = await response.json(); // 데이터를 JSON으로 파싱
            const nicknamelist = data.nicknamelist;
            const rank = data.rank;

            for (let i = 0; i < teamNumber; i++) {
              for (let ii = 0; ii < nicknamelist.length; ii++) {
                if (memberNickname[i] === nicknamelist[ii]) {
                  memberResults[i] = rank[ii];
                }
              }
            }
          }

          objectsArray = Array.from({ length: joined_member }, (_, index) => ({
            nickname: memberNickname[index],
            result: memberResults[index],
            order: Math.random()
          }));

          objectsArray.sort((a, b) => a.result - b.result);
          for (let i = 0; i < main_game; i++) {
            main_game_player.push(objectsArray[i].nickname);
          }
          for (let i = main_game; i < main_game + pre_game; i++) {
            pre_game_player.push(objectsArray[i].nickname);
          }
          rounds = generateRounds();
        } catch (error) {
          alert("성적을 불러오지 못했습니다", error);
        }
      } else {
        objectsArray = Array.from({ length: joined_member }, (_, index) => ({
          nickname: memberNickname[index],
          result: memberResults[index],
          order: Math.random()
        }));

        rounds =  updateGroupedNicknames();
        console.log(rounds)

      }
    }
  }
  function createGameArray(n) {
    // n이 홀수인 경우에는 Math.floor를 사용하여 내림을 합니다.
    const numberOfItems = Math.floor(n / 2);
    // 배열을 생성하고 "n강 경기"를 numberOfItems 만큼 채웁니다.
    const gameArray = Array(numberOfItems).fill(`${n}강 경기`);
    return gameArray;
}


  function updateGroupedNicknames() {
    groupedNicknames = division(shuffleArray(objectsArray.map(obj => obj.nickname)), teamSize);
console.log(teamSize)
    groupedNicknames = combineGroups(groupedNicknames,teamSize);

    rounds.push(groupedNicknames)

    for (let n = teamNumber; n >= 4; n /= 2)
{
  rounds.push(createGameArray(n)) 
}
rounds.push(["결승 경기"])

    return rounds
  }

  const division = (nicknamearray, teamSize) => {
    const length = nicknamearray.length;
    const divide = Math.floor(length / teamSize) - 1;
    const newArray = [];

    for (let i = 0; i <= divide; i++) {
      // nicknamearray 0부터 teamSize 잘라 새 nicknamearray에 넣기
      newArray.push(nicknamearray.splice(0, teamSize));
    }

    return newArray;
  };

  function generateRounds() {
    const pre_matches_group = division(pre_game_player, 2);
    main_game_player.push(...pre_matches_group);
    let playorder = shuffleArray([...main_game_player]);
    playorder = playorder.map(group =>
      Array.isArray(group) ? `${group[0]} vs ${group[1]}` : group
    );

    rounds.push(playorder);
for (let n = playorder.length; n >= 4; n /= 2)
{
 rounds.push(createGameArray(n)) 
}
rounds.push(["결승 경기"])
    return rounds;
  }

  

  function filterNicknames(input) {
    if (input === "") {
      filteredNicknames = $nicknames; // 입력이 없을 경우 전체 닉네임 리스트
    } else {
      filteredNicknames = $nicknames.filter((name) =>
        name.toLowerCase().includes(input.toLowerCase())
      );
    }
  }




</script>

<div class="main_data">
  <div class="table-outline">
    <div class="table-head">
      <div class="table-head-title">
        토너먼트 대진표 생성기
      </div>
    </div>
    <div class="table-contents-wrapper">
      <div class="table-contents flexbox">
        <div>참가인원 : </div>
        <input type="number" class="scorewidth" bind:value={joined_member} on:input={handle_joined_member} readonly={show} />
        <div>팀당 인원 : </div>
        <select class="numberwidth" bind:value={teamSize} disabled={show}>
          <option value=1>개인전</option>
          <option value=2>2인 1팀</option>
          <option value=3>3인 1팀</option>
          <option value=4>4인 1팀</option>
        </select>
        <button on:click={input_number} disabled={show}>인원 세팅</button>
      </div>
    </div>
    {#if show}
    <div class="table-contents-wrapper">
      <div class="table-contents flexbox">
        {#each Array(joined_member) as _, index}
          <div>
            <input
              type="text"
              class="nameinput"
              bind:value={memberNickname[index]}
              on:input={(event) => handle_memberNickname(event, index)}
              list="nicknames_list_{index}"
              placeholder="닉네임 입력"
            />
            <datalist id="nicknames_list_{index}">
              {#each filteredNicknames as option} <!-- 필터링된 닉네임 표시 -->
                <option value={option}>{option}</option>
              {/each}
            </datalist>
          </div>
        {/each}
        <button disabled={clicked} on:click={updateObjectsArray}>대진표 생성</button>
      </div>
    </div>    {/if}
    <div class="table-contents-wrapper">
      <div class="table-contents">
        <div class="bracket">
          {#each rounds as round, roundIndex}
          <div class="round-container">
          <h3>Round {roundIndex + 1}</h3>
              <div class="round">
                {#each round as match}
                  <div class="match">
                    <div class="team">
                      {match}
                    </div>
                  </div>
                {/each}
              </div></div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style>

.bracket {
  margin: auto;
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  flex-wrap: wrap;

}
.round-container{
  display: flex;
  flex-direction: column;
  margin-left: 30px;
}

.round {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 100%;

}

.match {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  border: 2px solid white;
  width: 150px;
  position: relative;
}

.team {
  padding: 5px 0;
  text-align: center;
  width: 120px;
  overflow: hidden;
  white-space: normal;

}

.round:nth-child(odd) .match::before {
  border-left: 1px solid white;
}

.round:nth-child(even) .match::after {
  border-right: 1px solid white;
}
</style>
