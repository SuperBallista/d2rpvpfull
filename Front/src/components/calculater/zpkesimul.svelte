<script lang="ts">
    import { writable } from "svelte/store";
    import { SecurityFetch } from "../../store";
  
    // Player variables
    let mycharlv = writable(99);
    let myhp = writable(0);
    let mymindmg = writable(0);
    let mymaxdmg = writable(0);
    let myar = writable(0);
    let mydf = writable(0);
    let myframe = writable([4,4,4,4,8]);
    let mydfoff = writable(0);
    let myreduce = writable(0);
    let mycrush = writable(0);
    let mycs = writable(0);
    let myds = writable(0);
    let mydodge = writable(0);
    let myopenwound = writable(0);
    let mythorns = writable(0);
    let myclass = writable(1);
    let myframelist = writable([        {name: "4/8프레임", value: [4,4,4,4,8]},
        {name: "5/8프레임", value: [5,5,5,5,8]},
        {name: "5/9프레임", value: [5,5,5,5,9]},
        {name: "5/10프레임", value: [5,5,5,5,10]}
]);

    // Opponent variables
    let yourcharlv = writable(99);
    let yourhp = writable(0);
    let yourmindmg = writable(0);
    let yourmaxdmg = writable(0);
    let yourar = writable(0);
    let yourdf = writable(0);
    let yourframe = writable([4]);
    let yourdfoff = writable(0);
    let yourreduce = writable(50);
    let yourcrush = writable(0);
    let yourcs = writable(0);
    let yourds = writable(0);
    let yourdodge = writable(0);
    let youropenwound = writable(0);
    let yourthorns = writable(0);
    let yourclass = writable(1);
    let yourframelist = writable([        {name: "4/8프레임", value: [4,4,4,4,8]},
        {name: "5/8프레임", value: [5,5,5,5,8]},
        {name: "5/9프레임", value: [5,5,5,5,9]},
        {name: "5/10프레임", value: [5,5,5,5,10]}
]);

    // Result variables
    let iterations = writable(2000);
    let win = writable(0);
    let lose = writable(0);
    let draw = writable(0);
    let winRate = writable(0);
  
    // Functions for saving and loading stats
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
      link.download = "my_stat.json";
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
      link.download = "opponent_stat.json";
      link.href = url;
      link.click();
    };
  
    const handleMyStatFile = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsedJson = JSON.parse(event.target?.result as string);
      Object.keys(parsedJson).forEach((key) => {
        if (parsedJson[key] === undefined) throw Error;
      });

      // JSON 데이터 적용
      myclass.set(parsedJson.class);
      myclassChange();
      mycharlv.set(parsedJson.charlv);
      myhp.set(parsedJson.hp);
      mymaxdmg.set(parsedJson.maxdmg);
      mymindmg.set(parsedJson.mindmg);
      myar.set(parsedJson.ar);
      mydf.set(parsedJson.df);
      mydfoff.set(parsedJson.dfoff);
      myreduce.set(parsedJson.reduce);
      mycrush.set(parsedJson.crush);
      mycs.set(parsedJson.cs);
      myds.set(parsedJson.ds);
      mydodge.set(parsedJson.dodge);
      myopenwound.set(parsedJson.openwound);
      mythorns.set(parsedJson.thorns);

      // `frame` 처리
      const frameValue = parsedJson.frame;
      const matchingOption = $myframelist.find(
        (option) => JSON.stringify(option.value) === JSON.stringify(frameValue)
      );
      if (matchingOption) {
        myframe.set(matchingOption.value); // 일치하는 옵션 값 설정
      } else {
        alert("Frame 값이 목록에 없습니다.");
      }
    } catch (error) {
      alert("Invalid JSON file");
    }
  };
  reader.readAsText(file);
};
  

const handleYourStatFile = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsedJson = JSON.parse(event.target?.result as string);
      Object.keys(parsedJson).forEach((key) => {
        if (parsedJson[key] === undefined) throw Error;
      });

      // JSON 데이터 적용
      yourclass.set(parsedJson.class);
      yourclassChange();
      yourcharlv.set(parsedJson.charlv);
      yourhp.set(parsedJson.hp);
      yourmaxdmg.set(parsedJson.maxdmg);
      yourmindmg.set(parsedJson.mindmg);
      yourar.set(parsedJson.ar);
      yourdf.set(parsedJson.df);
      yourdfoff.set(parsedJson.dfoff);
      yourreduce.set(parsedJson.reduce);
      yourcrush.set(parsedJson.crush);
      yourcs.set(parsedJson.cs);
      yourds.set(parsedJson.ds);
      yourdodge.set(parsedJson.dodge);
      youropenwound.set(parsedJson.openwound);
      yourthorns.set(parsedJson.thorns);

      // `frame` 처리
      const frameValue = parsedJson.frame;
      const matchingOption = $yourframelist.find(
        (option) => JSON.stringify(option.value) === JSON.stringify(frameValue)
      );
      if (matchingOption) {
        yourframe.set(matchingOption.value); // 일치하는 옵션 값 설정
      } else {
        alert("Frame 값이 목록에 없습니다.");
      }
    } catch (error) {
      alert("Invalid JSON file");
    }
  };
  reader.readAsText(file);
};


    const handleCalculate = async () => {
      win.set(0);
      lose.set(0);
      draw.set(0);
      winRate.set(0);
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
        const response = await SecurityFetch("/calculate", "POST", requestData);
  
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
        alert("Calculation failed.");
      }
    };


function myclassChange()
{
    if ($myclass === 1) {
        myframelist.set(
        [
        {name: "4/8프레임", value: [4,4,4,4,8]},
        {name: "5/8프레임", value: [5,5,5,5,8]},
        {name: "5/9프레임", value: [5,5,5,5,9]},
        {name: "5/10프레임", value: [5,5,5,5,10]}
    ]);

    }
    else if($myclass === 2)
    {
        myframelist.set(
            [
             {name: "9프레임", value: [9]},
            {name: "10프레임", value: [10]},
            {name: "11프레임", value: [11]},
            {name: "12프레임", value: [12]},
            {name: "13프레임", value: [13]},
            {name: "14프레임", value: [14]},
            {name: "15프레임", value: [15]}
            ]
        );

    }
    else if($myclass === 3)
{
    myframelist.set(
        [
        {name: "5/3/6프레임", value:   [5,3,3,3,6]},
        {name: "5/4/6프레임", value:   [5,4,4,4,6]},
        {name: "5/4/7프레임", value:     [5,4,4,4,7]},
        {name: "6/4/7프레임", value:   [6,4,4,4,7]},
        {name: "6/4/8프레임", value:   [6,4,4,4,8]}]
    );  

}
else if($myclass === 4)
{
    myframelist.set(
        [
        {name: "12프레임", value: [4]},
    {name: "13프레임", value: [4,4,5]},
    {name: "14프레임", value: [4,4,6]},
    {name: "15프레임", value: [4,5,6]},
    {name: "16프레임", value: [5,5,6]},
    {name: "17프레임", value: [5,5,6]},
    {name: "18프레임", value: [5,6,6]}
]);

}
}

function yourclassChange()
{
    if ($yourclass === 1) {
        yourframelist.set([
        {name: "5/10프레임", value: [5,5,5,5,10]},
        {name: "5/9프레임", value: [5,5,5,5,9]},
        {name: "5/8프레임", value: [5,5,5,5,8]},
        {name: "4/8프레임", value: [4,4,4,4,8]}]);
    }
    else if($yourclass === 2)
    {
        yourframelist.set([
            {name: "15프레임", value: [15]},
            {name: "14프레임", value: [14]},
            {name: "13프레임", value: [13]},
            {name: "12프레임", value: [12]},
            {name: "11프레임", value: [11]},
            {name: "10프레임", value: [10]},
            {name: "9프레임", value: [9]}]);
    }
    else if($yourclass === 3)
{
    yourframelist.set([
        {name: "5/3/6프레임", value:   [5,3,3,3,6]},
        {name: "5/4/6프레임", value:   [5,4,4,4,6]},
        {name: "5/4/7프레임", value:     [5,4,4,4,7]},
        {name: "6/4/7프레임", value:   [6,4,4,4,7]},
        {name: "6/4/8프레임", value:   [6,4,4,4,8]}]);    
}
else if($yourclass === 4)
{
    yourframelist.set([
        {name: "12프레임", value: [4]},
    {name: "13프레임", value: [4,4,5]},
    {name: "14프레임", value: [4,4,6]},
    {name: "15프레임", value: [4,5,6]},
    {name: "16프레임", value: [5,5,6]},
    {name: "17프레임", value: [5,5,6]},
    {name: "18프레임", value: [5,6,6]}]);
}
}

  </script>

<div class="main_data table-outline">
    <div class="table-head">내 캐릭터 스탯</div>
  
    <table class="table-contents-wrapper">
        <tbody>
      <tr>
        <td>레벨</td>
        <td><input type="number" bind:value={$mycharlv} class="input-text short" /></td>
        <td>최소 데미지</td>
        <td><input type="number" bind:value={$mymindmg} class="input-text short" /></td>
      </tr>
      <tr>
        <td>최대 데미지</td>
        <td><input type="number" bind:value={$mymaxdmg} class="input-text short" /></td>
        <td>총 어레</td>
        <td><input type="number" bind:value={$myar} class="input-text short" /></td>
      </tr>
      <tr>
        <td>방깎</td>
        <td><input type="number" bind:value={$mydfoff} class="input-text short" /></td>
        <td>총 방어</td>
        <td><input type="number" bind:value={$mydf} class="input-text short" /></td>
      </tr>
      <tr>
        <td>총 생명력</td>
        <td><input type="number" bind:value={$myhp} class="input-text short" /></td>
        <td>-</td>
        <td>-</td>
      </tr>
      <tr>
        <td>피해 감소 %</td>
        <td><input type="number" bind:value={$myreduce} class="input-text short" /></td>
        <td>강타</td>
        <td><input type="number" bind:value={$mycrush} class="input-text short" /></td>
      </tr>
      <tr>
        <td>치타</td>
        <td><input type="number" bind:value={$myds} class="input-text short" /></td>
        <td>극대화</td>
        <td><input type="number" bind:value={$mycs} class="input-text short" /></td>
      </tr>
      <tr>
        <td>상악</td>
        <td><input type="number" bind:value={$myopenwound} class="input-text short" /></td>
        <td>반사데미지</td>
        <td><input type="number" bind:value={$mythorns} class="input-text short" /></td>
      </tr>
      
      <tr>
        <td>세팅 저장</td>
        <td><button class="simple-button" on:click={SaveMyStat}>저장</button></td>
        <td>세팅 불러오기</td>
        <td>
          <input
            type="file"
            id="myfileUpload"
            style="display: none"
            on:change={handleMyStatFile}
            accept="application/json"
          />
          <label for="myfileUpload" class="simple-button">불러오기</label>
        </td>
      </tr>
    </tbody>
    </table>
  
    <div class="table-head">상대 캐릭터 스탯</div>
  
    <table class="table-contents-wrapper">
        <tbody>
      <tr>
        <td>레벨</td>
        <td><input type="number" bind:value={$yourcharlv} class="input-text short" /></td>
        <td>최소 데미지</td>
        <td><input type="number" bind:value={$yourmindmg} class="input-text short" /></td>
      </tr>
      <tr>
        <td>최대 데미지</td>
        <td><input type="number" bind:value={$yourmaxdmg} class="input-text short" /></td>
        <td>총 어레</td>
        <td><input type="number" bind:value={$yourar} class="input-text short" /></td>
      </tr>
      <tr>
        <td>방깎</td>
        <td><input type="number" bind:value={$yourdfoff} class="input-text short" /></td>
        <td>총 방어</td>
        <td><input type="number" bind:value={$yourdf} class="input-text short" /></td>
      </tr>
      <tr>
        <td>총 생명력</td>
        <td><input type="number" bind:value={$yourhp} class="input-text short" /></td>
        <td>-</td>
        <td>-</td>
      </tr>
      <tr>
        <td>피해 감소 %</td>
        <td><input type="number" bind:value={$yourreduce} class="input-text short" /></td>
        <td>강타</td>
        <td><input type="number" bind:value={$yourcrush} class="input-text short" /></td>
      </tr>
      <tr>
        <td>치타</td>
        <td><input type="number" bind:value={$yourds} class="input-text short" /></td>
        <td>극대화</td>
        <td><input type="number" bind:value={$yourcs} class="input-text short" /></td>
      </tr>
      <tr>
        <td>상악</td>
        <td><input type="number" bind:value={$youropenwound} class="input-text short" /></td>
        <td>반사데미지</td>
        <td><input type="number" bind:value={$yourthorns} class="input-text short" /></td>
      </tr>



      <tr>
        <td>세팅 저장</td>
        <td><button class="simple-button" on:click={SaveYourStat}>저장</button></td>
        <td>세팅 불러오기</td>
        <td>
          <input
            type="file"
            id="yourfileUpload"
            style="display: none"
            on:change={handleYourStatFile}
            accept="application/json"
          />
          <label class="simple-button" for="yourfileUpload">불러오기</label>
        </td>
      </tr>
    </tbody>
    </table>
  
    <table class="table-contents-wrapper">
        <tbody>
      <tr>
        <td>대전 시뮬 횟수?</td>
        <td><input type="number" bind:value={$iterations} class="input-text short" /></td>
      </tr>
      <tr>
        <td>시뮬레이션 시작</td>
        <td><button class="emphasis-button" on:click={handleCalculate}>시작</button></td>
      </tr>
    </tbody>
    </table>
  
    <table class="table-contents-wrapper">
        <tbody>
      <tr>
        <td>시뮬레이션 결과</td>
        <td>
          승 : {$win}<br />
          패 : {$lose}<br />
          무승부 : {$draw}<br />
          승률 : {$winRate} %
        </td>
      </tr>
        <tr>
        <td  colspan="2">계산기 사용법</td>
        </tr><tr>
        <td  colspan="2" class="text">
          이 계산기는 두 세팅된 캐릭터의 모의 대전을 진행하여 승률을 계산하는 시뮬레이터입니다.
          각 입력란에는 스탯창 수치를 입력해야합니다.(아이템 수치 입력 X) 만약 아이템을
          장착시 스탯값을 알 수 없다면 장비스탯 구하기 계산기에서 마지막으로 저장한
          스탯을 여기에서 불러와 사용할 수 있습니다. 입력란의 민뎀과 맥뎀은 물리 데미지만을
          입력해야합니다(원소데미지 입력X) 또한 여기서는 소량의 원소데미지는 무시하고
          계산합니다. 입력란의 모든 수치를 입력하고 양쪽 값이 동등하다고 수치를 생략해서는
          안됩니다. 또한 대전 시뮬은 최소 2천번 이상 돌리는 것을 추천드립니다.
        </td>
      </tr>
    </tbody>
    </table>
  </div>
  

<style>
.short{
padding: 3px;
width: 80px;
}
.text{
white-space: normal;
text-align: left;
}
table{
    margin:5px;
}
</style>