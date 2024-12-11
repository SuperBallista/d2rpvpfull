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

<table>
    <thead>
      <tr>
        <th colspan="4">바바용 파워 점수 계산기</th>
      </tr>
    </thead>
    <tbody>
        <tr>
          <td><input type="number" class="input-text short"  bind:value={defense} /></td><td> 방어</td>
          <td><input type="number" class="input-text short"  bind:value={arplus} /></td><td> + 어레</td>
        </tr>
        <tr>
          <td><input type="number" class="input-text short"  bind:value={arpercent} /></td><td> % 어레</td>
          <td><input type="number" class="input-text short"  bind:value={str} /></td><td> 오버 힘</td>
        </tr>
        <tr>
          <td><input type="number" class="input-text short"  bind:value={dex} /></td><td> 오버 민첩</td>
          <td><input type="number" class="input-text short"  bind:value={allstat} /></td><td> 모든 오버 스탯</td>
        </tr>
        <tr>
          <td><input type="number" class="input-text short"  bind:value={vital} /></td><td> 활력</td>
          <td><input type="number" class="input-text short"  bind:value={life} /></td><td> 생명력</td>
        </tr>
        <tr>
          <td><input type="number" class="input-text short"  bind:value={lifelv} /></td><td> 총 렙당 피</td>
          <td><input type="number" class="input-text short"  bind:value={min} /></td><td> 민뎀</td>
        </tr>
        <tr>
          <td><input type="number" class="input-text short"  bind:value={max} /></td><td> 맥뎀</td>
          <td><input type="number" class="input-text short"  bind:value={dmg} /></td><td> 데미지 추가(추뎀)</td>
        </tr>
        <tr>
          <td><input type="number" class="input-text short"  bind:value={edmg} /></td><td> 증뎀</td>
          <td><input type="number" class="input-text short"  bind:value={skill} /></td><td> +모든(바바) 스킬</td>
        </tr>
        <tr>
          <td><input type="number" class="input-text short"  bind:value={bo} /></td><td> 전투지시</td>
          <td><input type="number" class="input-text short"  bind:value={shout} /></td><td> 외침</td>
        </tr>
        <tr>
          <td><input type="number" class="input-text short"  bind:value={ironskin} /></td><td> 철갑피부</td>
          <td><input type="number" class="input-text short"  bind:value={warcry} /></td><td> + 함성 기술 레벨</td>
        </tr>
        <tr>
          <td><input type="number" class="input-text short"  bind:value={mastery} /></td><td> + 숙련 기술 레벨</td>
          <td><input type="number" class="input-text short"  bind:value={combat} /></td><td> + 전투 기술 레벨</td>
        </tr>
        <tr>
          <td><input type="number" class="input-text short"  bind:value={lifepercent} /></td><td> 최대 생명력 상승 %</td>
          <td><input type="number" class="input-text short"  bind:value={dfoff} /></td><td> 방깎</td>
        </tr>
        <tr>
          <td><input type="number" class="input-text short"  bind:value={crushblow} /></td><td> 강타</td>
          <td><input type="number" class="input-text short"  bind:value={ds} /></td><td> 치타</td>
        </tr>
        <tr>
          <td><input type="number" class="input-text short"  bind:value={statnoover} /></td><td> 힘과 민첩(노오버)</td>
          <td><input type="number" class="input-text short"  bind:value={allstatnoover} /></td><td> 모든 스탯(노오버)</td>
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