<script lang="ts">
  let defense: number = 0;
  let arplus: number = 0;
  let arpercent: number = 0;
  let str: number = 0;
  let dex: number = 0;
  let allstat: number = 0;
  let vital: number = 0;
  let life: number = 0;
  let lifelv: number = 0;
  let min: number = 0;
  let max: number = 0;
  let dmg: number = 0;
  let edmg: number = 0;
  let skill: number = 0;
  let shout: number = 0;
  let bo: number = 0;
  let ironskin: number = 0;
  let warcry: number = 0;
  let mastery: number = 0;
  let combat: number = 0;
  let lifepercent: number = 0;
  let dfoff: number = 0;
  let crushblow: number = 0;
  let ds: number = 0;
  let statnoover: number = 0;
  let allstatnoover: number = 0;
  let score: number = 0;
  let charskill: number = 0;
  let aura: number = 0;

  $: basic_min_dmg= 2267;
  $: basic_max_dmg = 9411;
  $: basic_ar = 23374;
  $: basic_def = 27790;
  $: basic_life = 4346;
  $: basic_defoff = 0;
  $: basic_crush = 25;
  $: basic_ds = 52;
  $: basic_cs = 0;
  $: basic_ds_cs = 52;

  let item_min_dmg: number;
  let item_max_dmg: number;
  let item_ar: number;
  let item_def: number;
  let item_life: number;
  let item_defoff: number;
  let item_crush: number;
  let item_ds: number;
  let item_cs: number;
  let item_ds_cs: number;

  let basic_admg: number;
  let item_admg: number;

  let basic_crushdmg: number;
  let item_crushdmg: number;

  let basic_realdmg: number;
  let item_realdmg: number;

  let basic_realar: number;
  let item_realar: number;

  let basic_power: number;
  let item_power: number;

  const handleCalculate = (): void => {
    // 질딘 계산식
    item_min_dmg = Math.floor(
      ((133 + min + dmg) *
        (100 +
          (492 + edmg) +
          combat * 6 +
          aura * 17 +
          480 +
          378 +
          23 * (skill + charskill + 7) -
          138 +
          (232 + str + allstat))) /
        100
    );
    item_max_dmg = Math.floor(
      ((552 + max + dmg) *
        (100 +
          (492 + edmg) +
          combat * 6 +
          aura * 17 +
          480 +
          378 +
          23 * (skill + charskill + 7) -
          138 +
          (232 + str + allstat))) /
        100
    );
    item_ar = Math.floor(
      ((148 * 5 + (dex + allstat) * 5 - 15 + arplus + 2743) *
        (100 +
          99 +
          arpercent +
          170 +
          20 +
          270 +
          combat * 10 +
          aura * 5 +
          15 * (skill + charskill + 7) -
          15 * 6)) /
        100
    );
    item_def = Math.floor(
      ((3139 + defense + Math.floor((148 + dex + allstat) / 4)) *
        (100 + 760 + 15 * (charskill + skill + combat + 7) - 15 * 6)) /
        100
    );
    item_life =
      Math.round(
        ((55 +
          99 * 2 -
          2 +
          (420 + statnoover + allstatnoover * 2) * 3 -
          25 * 3 +
          60 +
          life +
          740) *
          (lifepercent + 100 + 71 + (5 + skill) * 3 - 9)) /
          100
      ) +
      lifelv +
      148 +
      (allstat + allstatnoover + 80 + vital) * 3;
    item_defoff = basic_defoff + dfoff;
    item_crush = basic_crush + crushblow;
    item_ds = basic_ds + ds;
    item_cs = 0;
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



  
  <table>
    <thead>
      <tr>
        <th colspan="4">질딘용 파워 점수 계산기</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>방어</td>
        <td><input type="number" class="input-text short" bind:value={defense} /></td>
        <td>+ 어레</td>
        <td><input type="number" class="input-text short" bind:value={arplus} /></td>
      </tr>
      <tr>
        <td>% 어레</td>
        <td><input type="number" class="input-text short" bind:value={arpercent} /></td>
        <td>오버 힘</td>
        <td><input type="number" class="input-text short" bind:value={str} /></td>
      </tr>
      <tr>
        <td>오버 민첩</td>
        <td><input type="number" class="input-text short" bind:value={dex} /></td>
        <td>모든 오버 스탯</td>
        <td><input type="number" class="input-text short" bind:value={allstat} /></td>
      </tr>
      <tr>
        <td>활력</td>
        <td><input type="number" class="input-text short" bind:value={vital} /></td>
        <td>생명력</td>
        <td><input type="number" class="input-text short" bind:value={life} /></td>
      </tr>
      <tr>
        <td>총 렙당 피</td>
        <td><input type="number" class="input-text short" bind:value={lifelv} /></td>
        <td>민뎀</td>
        <td><input type="number" class="input-text short" bind:value={min} /></td>
      </tr>
      <tr>
        <td>맥뎀</td>
        <td><input type="number" class="input-text short" bind:value={max} /></td>
        <td>데미지 추가(추뎀)</td>
        <td><input type="number" class="input-text short" bind:value={dmg} /></td>
      </tr>
      <tr>
        <td>증뎀</td>
        <td><input type="number" class="input-text short" bind:value={edmg} /></td>
        <td>모든 기술 레벨</td>
        <td><input type="number" class="input-text short" bind:value={skill} /></td>
      </tr>
      <tr>
        <td>모든 성기사 기술레벨</td>
        <td><input type="number" class="input-text short" bind:value={charskill} /></td>
        <td>공격 오라 기술레벨</td>
        <td><input type="number" class="input-text short" bind:value={aura} /></td>
      </tr>
      <tr>
        <td>최대 생명력 상승 %</td>
        <td><input type="number" class="input-text short" bind:value={lifepercent} /></td>
        <td>방깎</td>
        <td><input type="number" class="input-text short" bind:value={dfoff} /></td>
      </tr>
      <tr>
        <td>강타</td>
        <td><input type="number" class="input-text short" bind:value={crushblow} /></td>
        <td>치타</td>
        <td><input type="number" class="input-text short" bind:value={ds} /></td>
      </tr>
      <tr>
        <td>힘과 민첩(노오버)</td>
        <td><input type="number" class="input-text short" bind:value={statnoover} /></td>
        <td>모든 스탯(노오버)</td>
        <td><input type="number" class="input-text short" bind:value={allstatnoover} /></td>
      </tr>
      <tr>
        <td colspan="2">
          <button class="emphasis-button" type="button" on:click={handleCalculate}>파워 점수 계산</button>
        </td>
        <td colspan="2">당신의 아이템 파워 점수는 {score}점 입니다</td>
      </tr>
    </tbody>
  </table>

  <style>
    .short{
    padding: 3px;
    width: 80px;
    }
        </style>