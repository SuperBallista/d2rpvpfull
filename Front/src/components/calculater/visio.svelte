<script lang="ts">
    let defense: number = 0;
    let skillLevels: number = 0;
    let arPercent: number = 0;
    let strength: number = 0;
    let dexterity: number = 0;
    let life: number = 0;
    let bo: number = 0;
    let shout: number = 0;
    let ironSkin: number = 0;
    let ar: number = 0;
    let ed: number = 0;
    let min: number = 0;
    let max: number = 0;
    let jewelEd: number = 0;
    let jewelmin: number = 0;
    let jewelmax: number = 0;
    let jewelStrength: number = 0;
    let jewelDexterity: number = 0;
    let jewelLife: number = 0;
    let jewelAr: number = 0;
    let jewelDefense: number = 0;
    let score: number = 0;
  
    function handleCalculate(): void {
      score =
        (Math.round(
          (2130 +
            life +
            jewelLife +
            4 * (strength + dexterity + jewelDexterity + jewelStrength)) *
            (2.25 + (skillLevels + bo) * 0.03) +
            468
        ) /
          ((((0.25 * 23514) /
            (23514 +
              Math.floor(
                (3134 + defense + jewelDefense) *
                  (0.2 * skillLevels + 7.7 + 0.1 * (ironSkin + shout)) *
                  0.875
              ))) *
            5604.5) /
            12) /
          (5758 /
            ((((0.25 *
              Math.floor(
                (4214 + ar + jewelAr) *
                  (5.02 + skillLevels * 0.13 + arPercent * 0.01)
              )) /
              (Math.floor(
                (ar + jewelAr + 4214) *
                  (5.02 + skillLevels * 0.13 + arPercent * 0.01)
              ) +
                29467 * 0.875)) *
              (((219 + min + max + jewelmax + jewelmin) / 2 + 400) *
                (10.7 + 0.1 * skillLevels + 0.01 * (ed + jewelEd)))) /
              12))) *
        100;
    }
  </script>
  
  <table>
    <thead>
      <tr>
        <th colspan="4">BABAPK 렙당뚜껑 계산기</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td colspan="4">아이템 기본 스탯</td>
      </tr>
      <tr>
        <td>
          <input class="input-text short" type="number"  bind:value={defense} /></td><td> 방어
        </td>
        <td>
          <input class="input-text short" type="number"  bind:value={skillLevels} /></td><td> + 모든(바바) 스킬
        </td>
      </tr>
      <tr>
        <td>
          <input class="input-text short" type="number"  bind:value={arPercent} /></td><td> % 어레 보너스
        </td>
        <td>
          <input class="input-text short" type="number"  bind:value={strength} /></td><td> 힘
        </td>
      </tr>
      <tr>
        <td>
          <input class="input-text short" type="number"  bind:value={dexterity} /></td><td> 민첩
        </td>
        <td>
          <input class="input-text short" type="number"  bind:value={life} /></td><td> 생명력
        </td>
      </tr>
      <tr>
        <td>
          <input class="input-text short" type="number"  bind:value={bo} /></td><td> 전투지시
        </td>
        <td>
          <input class="input-text short" type="number"  bind:value={shout} /></td><td> 외침
        </td>
      </tr>
      <tr>
        <td>
          <input class="input-text short" type="number"  bind:value={ironSkin} /></td><td> 철갑피부
        </td>
        <td>
          <input class="input-text short" type="number"  bind:value={ar} /></td><td> + 어레
        </td>
      </tr>
      <tr>
        <td>
          <input class="input-text short" type="number"  bind:value={ed} /></td><td> 증뎀
        </td>
        <td>
          <input class="input-text short" type="number"  bind:value={min} /></td><td> 최소 데미지
        </td>
      </tr>
      <tr>
        <td>
          <input class="input-text short" type="number"  bind:value={max} /></td><td> 최대 데미지
        </td>
        <td></td><td></td>
      </tr>
      <tr>
        <td colspan="4">2 소켓일 시 추가 주얼 스탯(1소켓일 시에는 모두 0 입력)</td>
      </tr>
      <tr>
        <td>
          <input class="input-text short" type="number"  bind:value={jewelEd} /></td><td> 증뎀
        </td>
        <td>
          <input class="input-text short" type="number"  bind:value={jewelmin} /></td><td> 최소 데미지
        </td>
      </tr>
      <tr>
        <td>
          <input class="input-text short" type="number"  bind:value={jewelmax} /></td><td> 최대 데미지
        </td>
        <td>
          <input class="input-text short" type="number"  bind:value={jewelStrength} /></td><td> 힘
        </td>
      </tr>
      <tr>
        <td>
          <input class="input-text short" type="number"  bind:value={jewelDexterity} /></td><td> 민첩
        </td>
        <td>
          <input class="input-text short" type="number"  bind:value={jewelLife} /></td><td> 생명력
        </td>
      </tr>
      <tr>
        <td>
          <input class="input-text short" type="number"  bind:value={jewelAr} /></td><td> 어레
        </td>
        <td>
          <input class="input-text short" type="number"  bind:value={jewelDefense} /></td><td> +방어
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <button class="emphasis-button" type="button" on:click={handleCalculate}>
            가치 계산
          </button><br />
          당신의 렙당 뚜껑의 점수는 {score}입니다
        </td>
      </tr>
      <tr>
        <td class="text" colspan="4">
          유니크 뚜껑과 비교<br />
          504 방어 슬가 점수 = 100<br />
          756 방어 에테 슬가 점수 = 95.54<br />
          408 방어 3/3/3 스킬 악마뿔의 날 점수 = 95.77<br />
          611 방어 3/3/3 스킬 에테 악마뿔의 날 점수 = 91.47
        </td>
      </tr>
      <tr>
        <td class="text"  colspan="4">
          이 계산기는 발리스타에 의해 만들어졌습니다<br />
          99레벨, 으뜸 슬가, 3/20/20 부적, 강철찢개, 버석고뇌 : 100점<br />
          만약 점수가 100점을 넘는다면 그만큼 슬가보다 좋은 뚜껑임을 나타냅니다.
        </td>
      </tr>
      <tr>
        <td class="text" colspan="4">
          어떻게 사용하나요?<br />
          뚜껑의 스탯을 입력하세요<br />
          만약 1소켓인 경우 주얼 입력을 모두 0으로 하세요. 만약 그렇지 않다면, 지증속
          주얼 2개를 제외한 자신이 사용할 전투주얼 수치를 넣으세요<br />
          % 상승 어레와 + 상승 어레를 구별해서 넣어주세요
        </td>
      </tr>
    </tbody>
  </table>

  <style>

.short{
padding: 3px;
width: 80px;
}
.text{
    text-align: left;
}

  </style>