<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { SecurityFetch } from "../store.js"

  onMount(async () => {
  });

  // 나의 변수
  let mycharlv = writable(99);
  let myhp = writable(0);
  let mymindmg = writable(0);
  let mymaxdmg = writable(0);
  let myar = writable(0);
  let mydf = writable(0);
  let myframe = writable(4);
  let mydfoff = writable(0);
  let myreduce = writable(0);
  let mycrush = writable(0);
  let mycs = writable(0);
  let myds = writable(0);
  let mydodge = writable(0);
  let myopenwound = writable(0);
  let mythorns = writable(0);
  let myclass = writable(0);

  // 상대의 변수
  let yourcharlv = writable(99);
  let yourhp = writable(0);
  let yourmindmg = writable(0);
  let yourmaxdmg = writable(0);
  let yourar = writable(0);
  let yourdf = writable(0);
  let yourframe = writable(4);
  let yourdfoff = writable(0);
  let yourreduce = writable(50);
  let yourcrush = writable(0);
  let yourcs = writable(0);
  let yourds = writable(0);
  let yourdodge = writable(0);
  let youropenwound = writable(0);
  let yourthorns = writable(0);
  let yourclass = writable(0);

  // 결과 변수
  let iterations = writable(2000);
  let win = writable(0);
  let lose = writable(0);
  let draw = writable(0);
  let winRate = writable(0);

  // 스탯 저장 함수
  const SaveMyStat = () => {
    const myformData = {
      charlv: $mycharlv,
      hp: $myhp,
      maxdmg: $mymaxdmg,
      mindmg: $mymindmg,
      ar: $myar,
      df: $mydf,
      frame: $myframe,
      dfoff: $mydfoff,
      reduce: $myreduce,
      crush: $mycrush,
      cs: $mycs,
      ds: $myds,
      dodge: $mydodge,
      openwound: $myopenwound,
      thorns: $mythorns,
      class: $myclass,
    };
    const jsonStr = JSON.stringify(myformData);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "내스탯.json";
    link.href = url;
    link.click();
  };

  const SaveYourStat = () => {
    const yourformData = {
      charlv: $yourcharlv,
      hp: $yourhp,
      maxdmg: $yourmaxdmg,
      mindmg: $yourmindmg,
      ar: $yourar,
      df: $yourdf,
      frame: $yourframe,
      dfoff: $yourdfoff,
      reduce: $yourreduce,
      crush: $yourcrush,
      cs: $yourcs,
      ds: $yourds,
      dodge: $yourdodge,
      openwound: $youropenwound,
      thorns: $yourthorns,
      class: $yourclass,
    };
    const jsonStr = JSON.stringify(yourformData);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "상대스탯.json";
    link.href = url;
    link.click();
  };

  const handleMyStatFile = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedJson = JSON.parse(event.target.result);
        if (
          parsedJson.charlv == undefined ||
          parsedJson.hp == undefined ||
          parsedJson.maxdmg == undefined ||
          parsedJson.mindmg == undefined ||
          parsedJson.ar == undefined ||
          parsedJson.df == undefined ||
          parsedJson.frame == undefined ||
          parsedJson.dfoff == undefined ||
          parsedJson.reduce == undefined ||
          parsedJson.crush == undefined ||
          parsedJson.cs == undefined ||
          parsedJson.ds == undefined ||
          parsedJson.dodge == undefined ||
          parsedJson.openwound == undefined ||
          parsedJson.thorns == undefined ||
          parsedJson.class == undefined
        ) {
          throw Error;
        }

        mycharlv.set(parsedJson.charlv);
        myhp.set(parsedJson.hp);
        mymaxdmg.set(parsedJson.maxdmg);
        mymindmg.set(parsedJson.mindmg);
        myar.set(parsedJson.ar);
        mydf.set(parsedJson.df);
        mydfoff.set(parsedJson.dfoff);
        myreduce.set(parsedJson.reduce);
        mycrush.set(parsedJson.crush);
        myds.set(parsedJson.ds);
        myframe.set(parsedJson.frame);
        mycs.set(parsedJson.cs);
        mydodge.set(parsedJson.dodge);
        myopenwound.set(parsedJson.openwound);
        mythorns.set(parsedJson.thorns);
        myclass.set(parsedJson.class);
      } catch (error) {
        alert("당신의 Json 파일은 손상되었습니다");
      }
    };
    reader.readAsText(file);
  };

  const handleYourStatFile = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedJson = JSON.parse(event.target.result);
        if (
          parsedJson.charlv == undefined ||
          parsedJson.hp == undefined ||
          parsedJson.maxdmg == undefined ||
          parsedJson.mindmg == undefined ||
          parsedJson.ar == undefined ||
          parsedJson.df == undefined ||
          parsedJson.frame == undefined ||
          parsedJson.dfoff == undefined ||
          parsedJson.reduce == undefined ||
          parsedJson.crush == undefined ||
          parsedJson.cs == undefined ||
          parsedJson.ds == undefined ||
          parsedJson.dodge == undefined ||
          parsedJson.openwound == undefined ||
          parsedJson.thorns == undefined ||
          parsedJson.class == undefined
        ) {
          throw Error;
        }

        yourcharlv.set(parsedJson.charlv);
        yourhp.set(parsedJson.hp);
        yourmaxdmg.set(parsedJson.maxdmg);
        yourmindmg.set(parsedJson.mindmg);
        yourar.set(parsedJson.ar);
        yourdf.set(parsedJson.df);
        yourdfoff.set(parsedJson.dfoff);
        yourreduce.set(parsedJson.reduce);
        yourcrush.set(parsedJson.crush);
        yourds.set(parsedJson.ds);
        yourframe.set(parsedJson.frame);
        yourcs.set(parsedJson.cs);
        yourdodge.set(parsedJson.dodge);
        youropenwound.set(parsedJson.openwound);
        yourthorns.set(parsedJson.thorns);
        yourclass.set(parsedJson.class);
      } catch (error) {
        alert("당신의 Json 파일은 손상되었습니다");
      }
    };
    reader.readAsText(file);
  };

  const handleCalculate = async () => {

    win.set("-");
    lose.set("-");
    draw.set("-");
    winRate.set("-");
    const requestData = {
      myhp: $myhp,
      yourhp: $yourhp,
      myframe: $myframe,
      yourframe: $yourframe,
      myclass: $myclass,
      yourclass: $yourclass,
      mycharlv: $mycharlv,
      yourcharlv: $yourcharlv,
      iterations: $iterations,
      myar: $myar,
      yourar: $yourar,
      mydf: $mydf,
      yourdf: $yourdf,
      mydfoff: $mydfoff,
      yourdfoff: $yourdfoff,
      mydodge: $mydodge,
      yourdodge: $yourdodge,
      mycrush: $mycrush,
      yourcrush: $yourcrush,
      myopenwound: $myopenwound,
      youropenwound: $youropenwound,
      mymaxdmg: $mymaxdmg,
      mymindmg: $mymindmg,
      yourmaxdmg: $yourmaxdmg,
      yourmindmg: $yourmindmg,
      myreduce: $myreduce,
      yourreduce: $yourreduce,
      mycs: $mycs,
      myds: $myds,
      yourcs: $yourcs,
      yourds: $yourds,
      mythorns: $mythorns,
      yourthorns: $yourthorns,
    };

    try {
      const response = await SecurityFetch("/calculate","POST",requestData);

      if (response.ok) {
        const data = await response.json();
        win.set(data.winCount);
        lose.set(data.loseCount);
        draw.set(data.drawCount);
        const roundedWinRate = Number(data.winRate.toFixed(2));
        winRate.set(roundedWinRate);
      } else {
        console.error("Error calculating:", response.statusText);
      }
    } catch (error) {
      console.error("Error calculating:", error);
      alert("계산 요청이 실패하였습니다", error);
    } finally {
    }
  };
</script>
<svelte:head>
    <title>mpk 대전 시뮬레이터</title>
</svelte:head>

<div class="main_data table-outline">
  <div class="table-head">내 캐릭터 스탯</div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" bind:value={$mycharlv} class="numberwidth" /> 레벨
      </div>

      <div class="table-divide">
        <input type="number" bind:value={$mymindmg} class="numberwidth" /> 최소 데미지
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" bind:value={$mymaxdmg} class="numberwidth" /> 최대 데미지
      </div>

      <div class="table-divide">
        <input type="number" bind:value={$myar} class="numberwidth" /> 총 어레
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" bind:value={$mydfoff} class="numberwidth" /> 방깎
      </div>

      <div class="table-divide">
        <input type="number" bind:value={$mydf} class="numberwidth" /> 총 방어
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" bind:value={$myhp} class="numberwidth" /> 총 생명력
      </div>

      <div class="table-divide">
        <input type="number" bind:value={$myframe} class="numberwidth" /> 공격 프레임
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" bind:value={$myreduce} class="numberwidth" /> 피해 감소
        %
      </div>

      <div class="table-divide">
        <input type="number" bind:value={$mycrush} class="numberwidth" /> 강타
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" bind:value={$myds} class="numberwidth" /> 치타
      </div>

      <div class="table-divide">
        <input type="number" bind:value={$mycs} class="numberwidth" /> 극대화
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" bind:value={$myopenwound} class="numberwidth" /> 상악
      </div>

      <div class="table-divide">
        <input type="number" bind:value={$mythorns} class="numberwidth" /> 반사데미지
      </div>
    </div>
  </div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" bind:value={$mydodge} class="numberwidth" /> 흘리기
        확률(아마존 스킬)
      </div>
      <div class="table-divide">
        <select bind:value={$myclass} class="namewidth">
          <option value="1">성기사</option>
          <option value="2">야만용사</option>
          <option value="3">드루이드</option>
          <option value="4">아마존</option>
        </select> 클래스
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <button on:click={SaveMyStat}>내 설정 파일로 저장</button>
      </div>
      <br />
      <div class="table-divide">
        <input
          type="file"
          id="myfileUpload"
          style="display: none"
          on:change={handleMyStatFile}
          accept="application/json"
        />
        <label for="myfileUpload" class="button"
          >파일을 내 스탯으로 불러오기</label
        >
      </div>
    </div>
  </div>

  <div class="table-head">상대 캐릭터 스탯</div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" bind:value={$yourcharlv} class="numberwidth" /> 레벨
      </div>

      <div class="table-divide">
        <input type="number" bind:value={$yourmindmg} class="numberwidth" /> 최소
        데미지
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" bind:value={$yourmaxdmg} class="numberwidth" /> 최대
        데미지
      </div>

      <div class="table-divide">
        <input type="number" bind:value={$yourar} class="numberwidth" /> 총 어레
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" bind:value={$yourdfoff} class="numberwidth" /> 방깎
      </div>

      <div class="table-divide">
        <input type="number" bind:value={$yourdf} class="numberwidth" /> 총 방어
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" bind:value={$yourhp} class="numberwidth" /> 총 생명력
      </div>

      <div class="table-divide">
        <input type="number" bind:value={$yourframe} class="numberwidth" /> 공격프레임
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" bind:value={$yourreduce} class="numberwidth" /> 피해
        감소 %
      </div>

      <div class="table-divide">
        <input type="number" bind:value={$yourcrush} class="numberwidth" /> 강타
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" bind:value={$yourds} class="numberwidth" /> 치타
      </div>

      <div class="table-divide">
        <input type="number" bind:value={$yourcs} class="numberwidth" /> 극대화
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" bind:value={$youropenwound} class="numberwidth" /> 상악
      </div>

      <div class="table-divide">
        <input type="number" bind:value={$yourthorns} class="numberwidth" /> 반사데미지
      </div>
    </div>
  </div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" bind:value={$yourdodge} class="numberwidth" /> 흘리기
        확률(아마존 스킬)
      </div>
      <div class="table-divide">
        <select bind:value={$yourclass} class="namewidth">
          <option value="1">성기사</option>
          <option value="2">야만용사</option>
          <option value="3">드루이드</option>
          <option value="4">아마존</option>
        </select>
        클래스
      </div>
    </div>
  </div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <button on:click={SaveYourStat}>상대 설정 파일로 저장</button>
      </div>
      <br />
      <div class="table-divide">
        <input
          type="file"
          id="yourfileUpload"
          style="display: none"
          on:change={handleYourStatFile}
          accept="application/json"
        />
        <label class="button" for="yourfileUpload"
          >파일을 상대 스탯으로 불러오기</label
        >
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <label
          >대전 시뮬 횟수?
          <input type="number" bind:value={$iterations} class="numberwidth" />
        </label>
      </div>

      <div class="table-divide">
        <button on:click={handleCalculate}>시뮬레이션 시작</button>
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="left">
        시뮬레이션 {#if $win === "-"}진행중{:else}결과{/if}<br />
        승 : {$win} <br />
        패 : {$lose} <br />
        무승부 : {$draw} <br />
        승률 : {$winRate} %
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="left">
        계산기 사용법
        <br />
        이 계산기는 두 세팅된 캐릭터의 모의 대전을 진행하여 승률을 계산하는 시뮬레이터입니다.
        각 입력란에는 스탯창 수치를 입력해야합니다.(아이템 수치 입력 X) 만약 아이템을
        장착시 스탯값을 알 수 없다면 장비스탯 구하기 계산기에서 마지막으로 저장한
        스탯을 여기에서 불러와 사용할 수 있습니다. 입력란의 민뎀과 맥뎀은 물리 데미지만을
        입력해야합니다(원소데미지 입력X) 또한 여기서는 소량의 원소데미지는 무시하고
        계산합니다. 입력란의 모든 수치를 입력하고 양쪽 값이 동등하다고 수치를 생략해서는
        안됩니다. 또한 대전 시뮬은 최소 2천번 이상 돌리는 것을 추천드립니다.
      </div>
    </div>
  </div>
</div>

<br /><br />
<br /><br />
