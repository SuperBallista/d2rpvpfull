<script>
  let defense = 0;
  let skillLevels = 0;
  let arPercent = 0;
  let strength = 0;
  let dexterity = 0;
  let life = 0;
  let bo = 0;
  let shout = 0;
  let ironSkin = 0;
  let ar = 0;
  let ed = 0;
  let min = 0;
  let max = 0;
  let jewelEd = 0;
  let jewelmin = 0;
  let jewelmax = 0;
  let jewelStrength = 0;
  let jewelDexterity = 0;
  let jewelLife = 0;
  let jewelAr = 0;
  let jewelDefense = 0;
  let score = 0;

  function handleCalculate() {
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
<svelte:head>
    <title>babapk 렙당뚜껑 계산기</title>
</svelte:head>

<div class="main_data table-outline">
  <div class="table-head">BABAPK 렙당뚜껑 계산기</div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div>아이템 기본 스탯</div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={defense} />
        방어
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={skillLevels} />
        + 모든(바바) 스킬
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={arPercent} />
        % 어레 보너스
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={strength} />
        힘
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={dexterity} />
        민첩
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
        <input type="number" class="numberwidth" bind:value={ironSkin} />
        철갑피부
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={ar} />
        + 어레
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={ed} />
        증뎀
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={min} />
        최소 데미지
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={max} />
        최대 데미지
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div>2 소켓일 시 추가 주얼 스탯(1소켓일 시에는 모두 0 입력)</div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={jewelEd} />
        증뎀
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={jewelmin} />
        최소 데미지
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={jewelmax} />
        최대 데미지
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={jewelStrength} />
        힘
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={jewelDexterity} />
        민첩
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={jewelLife} />
        생명력
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={jewelAr} />
        어레
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={jewelDefense} />
        +방어
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="left">
        <button type="button" class="babapkcolor" on:click={handleCalculate}>
          가치 계산
        </button><br />

        당신의 렙당 뚜껑의 점수는 {score}입니다
      </div>
    </div>
  </div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="left">
        유니크 뚜껑과 비교<br />
        504 방어 슬가 점수 = 100<br />
        756 방어 에테 슬가 점수 = 95.54<br />
        408 방어 3/3/3 스킬 악마뿔의 날 점수 = 95.77<br />
        611 방어 3/3/3 스킬 에테 악마뿔의 날 점수 = 91.47
      </div>
    </div>
  </div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="left">
        이 계산기는 발리스타에 의해 만들어졌습니다<br />
        99레벨, 으뜸 슬가, 3/20/20 부적, 강철찢개, 버석고뇌 : 100점<br />
        만약 점수가 100점을 넘는다면 그만큼 슬가보다 좋은 뚜껑임을 나타냅니다.
      </div>
    </div>
  </div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="left">
        어떻게 사용하나요?<br />
        뚜껑의 스탯을 입력하세요<br />
        만약 1소켓인 경우 주얼 입력을 모두 0으로 하세요. 만약 그렇지 않다면, 지증속
        주얼 2개를 제외한 자신이 사용할 전투주얼 수치를 넣으세요<br />
        % 상승 어레와 + 상승 어레를 구별해서 넣어주세요
      </div>
    </div>
  </div>
</div>
