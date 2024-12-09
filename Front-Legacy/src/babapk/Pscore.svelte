<script>
  let defense = 0;
  let arplus = 0;
  let arpercent = 0;
  let str = 0;
  let dex = 0;
  let allstat = 0;
  let vital = 0;
  let life = 0;
  let lifelv = 0;
  let min = 0;
  let max = 0;
  let dmg = 0;
  let edmg = 0;
  let skill = 0;
  let shout = 0;
  let bo = 0;
  let ironskin = 0;
  let warcry = 0;
  let mastery = 0;
  let combat = 0;
  let lifepercent = 0;
  let dfoff = 0;
  let crushblow = 0;
  let ds = 0;
  let statnoover = 0;
  let allstatnoover = 0;
  let score = 0;
  let charskill = 0;
  let aura = 0;

  $: basic_min_dmg = 4697;
  $: basic_max_dmg = 6512;
  $: basic_ar = 23514;
  $: basic_def = 29467;
  $: basic_life = 5758;
  $: basic_defoff = 25;
  $: basic_crush = 25;
  $: basic_ds = 35;
  $: basic_cs = 31;
  $: basic_ds_cs = 55.15;

  let item_min_dmg;
  let item_max_dmg;
  let item_ar;
  let item_def;
  let item_life;
  let item_defoff;
  let item_crush;
  let item_ds;
  let item_cs;
  let item_ds_cs;

  let basic_admg;
  let item_admg;

  let basic_crushdmg;
  let item_crushdmg;

  let basic_realdmg;
  let item_realdmg;

  let basic_realar;
  let item_realar;

  let basic_power;
  let item_power;

  const handleCalculate = () => {
    item_min_dmg = Math.floor(
      ((27 + 400 + min + dmg) *
        (100 +
          (440 + edmg) +
          (128 + 130 + 6 * 10 + skill * 10) +
          (10 + combat * 5 + mastery * 5) +
          (232 + str + allstat))) /
        100
    );
    item_max_dmg = Math.floor(
      ((81 + 111 + 400 + max + dmg) *
        (100 +
          (440 + edmg) +
          (128 + 130 + 6 * 10 + skill * 10) +
          (10 + combat * 5 + mastery * 5) +
          (232 + str + allstat))) /
        100
    );
    item_ar = Math.floor(
      ((222 * 5 + (dex + allstat) * 5 - 15 + arplus + 3119) *
        (100 +
          20 +
          arpercent +
          248 +
          180 +
          13 * (skill + 6) -
          13 * 6 +
          (combat + 2) * 5 +
          mastery * 8)) /
        100
    );
    item_def = Math.floor(
      ((3583 + defense + Math.floor((222 + dex + allstat) / 4)) *
        (100 +
          360 +
          230 +
          20 * (skill + 6) +
          (shout + ironskin + mastery + warcry) * 10)) /
        100
    );
    item_life =
      Math.round(
        ((55 +
          99 * 2 -
          2 +
          (306 + statnoover + allstatnoover * 2) * 4 -
          25 * 4 +
          60 +
          life +
          855) *
          (lifepercent + 100 + 113 + (6 + skill + bo) * 3)) /
          100
      ) +
      lifelv +
      148 +
      (allstat + allstatnoover + 80 + vital) * 4;
    item_defoff = basic_defoff + dfoff;
    item_crush = basic_crush + crushblow;
    item_ds = basic_ds + ds;
    item_cs = basic_cs + (skill + mastery >= 4 ? 1 : 0);
    item_ds_cs =
      (item_ds / 100 + (((100 - item_ds) / 100) * item_cs) / 100) * 100;

    basic_admg = (basic_min_dmg + basic_max_dmg) / 6 / 2 / 2;
    item_admg = (item_min_dmg + item_max_dmg) / 6 / 2 / 2;
    basic_crushdmg = ((item_life / 2 / 10) * basic_crush) / 100 / 2;
    item_crushdmg = ((basic_life / 2 / 10) * item_crush) / 100 / 2;
    basic_realdmg = basic_admg * (basic_ds_cs / 100 + 1) + basic_crushdmg;
    item_realdmg = item_admg * (item_ds_cs / 100 + 1) + item_crushdmg;
    basic_realar =
      (basic_ar / (basic_ar + (item_def * (100 - basic_defoff / 2)) / 100)) *
      0.25;
    item_realar =
      (item_ar / (item_ar + (basic_def * (100 - item_defoff / 2)) / 100)) *
      0.25;
    basic_power = ((item_life / basic_realdmg) * 4) / 25 / basic_realar;
    item_power = ((basic_life / item_realdmg) * 4) / 25 / item_realar;
    score =
      Math.round(((basic_power / item_power) * 100 - 100) * 100 * 100) / 100;
  };
</script>
<svelte:head>
    <title>babapk 파워점수 계산기</title>
</svelte:head>

<div class="main_data table-outline">
  <div class="table-head">파워 점수 계산기</div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={defense} />
        방어
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={arplus} />
        + 어레
      </div>
    </div>
  </div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={arpercent} />
        % 어레
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={str} />
        오버 힘
      </div>
    </div>
  </div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={dex} />
        오버 민첩
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={allstat} />
        모든 오버 스탯
      </div>
    </div>
  </div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={vital} />
        활력
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={life} />
        생명력
      </div>
    </div>
  </div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={lifelv} />
        총 렙당 피
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={min} />
        민뎀
      </div>
    </div>
  </div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={max} />
        맥뎀
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={dmg} />
        데미지 추가(추뎀)
      </div>
    </div>
  </div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={edmg} />
        증뎀
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={skill} />
        +모든(바바) 스킬
      </div>
    </div>
  </div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={bo} />
        전투지시
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={shout} />
        외침
      </div>
    </div>
  </div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={ironskin} />
        철갑피부
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={warcry} />
        + 함성 기술 레벨
      </div>
    </div>
  </div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={mastery} />
        + 숙련 기술 레벨
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={combat} />
        + 전투 기술 레벨
      </div>
    </div>
  </div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={lifepercent} />
        최대 생명력 상승 %
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={dfoff} />
        방깎
      </div>
    </div>
  </div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={crushblow} />
        강타
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={ds} />
        치타
      </div>
    </div>
  </div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={statnoover} />
        힘과 민첩(노오버)
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={allstatnoover} />
        모든 스탯(노오버)
      </div>
    </div>
  </div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="left">
        <button type="button" on:click={handleCalculate}>파워 점수 계산</button>
      </div>
    </div>
  </div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      당신의 아이템 파워 점수는 {score}점 입니다
    </div>
  </div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="left">
        계산기 사용법<br />
        이 계산기는 아이템이 얼마나 강한지를 측정하는 계산기입니다. 각 입력란에는
        아이템의 수치를 입력해야합니다.(스탯창 수치 입력 X) 그리고 '증뎀' 입력칸은
        방어구 증뎀을 입력해야하며 무기 증뎀은 넣지 않고, 무기의 실제 최소-최대 데미지를
        넣어야합니다. 힘과 민첩은 해당 아이템 수치를 무시하고 장비 장착시 232, 222를
        초과되도록 찍을 경우 '오버'에 입력해주시고, 232, 222 등 스탯리셋으로 딱 맞춰
        찍으신다면 '노오버'에 입력해주세요
      </div>
    </div>
  </div>
</div>
