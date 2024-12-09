<script>
  let ar = 0;
  let strength = 0;
  let dexterity = 0;
  let life = 0;
  let mindmg = 0;
  let maxdmg = 0;
  let charclass = 4;
  let result = 0;
  let bonusar = false;

  $: handleCalculate = () => {
    let score = strength + dexterity + ar / 5 + (maxdmg + mindmg) * 1.5 + (life / charclass);

    if (bonusar) {
      score += 38 / 5;
    }

    result = score;
  };
</script>
<svelte:head>
    <title>mpk 링 스탯 측정기</title>
</svelte:head>

<div class="main_data table-outline">
  <div class="table-head">링 스탯 측정기</div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <select class="namewidth" bind:value={charclass} on:change={handleCalculate}>
          <option value="4">야만용사</option>
          <option value="3">성기사</option>
          <option value="2">드루이드</option>
          <option value="3">아마존</option>
        </select>
      </div>
    </div>
  </div>


  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <label class="custom-checkbox">
          <input type="checkbox" bind:checked={bonusar} />
          <span class="checkmark"></span>
          <span>+ 5% 추가어레</span>
        </label>
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={mindmg} /> 최소 데미지
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={maxdmg} /> 최대 데미지
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={ar} /> 어레
      </div>
    </div>
  </div>
  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={strength} /> 힘
      </div>
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={dexterity} /> 민첩
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="table-divide">
        <input type="number" class="numberwidth" bind:value={life} /> 생명력
      </div>
    </div>
  </div>

  <div class="table-contents-wrapper">
    <div class="table-contents">
      <div class="left">
        <button on:click={handleCalculate}>계산</button><br />

        이 링의 전체 스탯은 {result} 스탯 입니다. 단순히 스탯만을 계산하므로 전체적인
        성능과는 차이가 있을 수 있습니다.
      </div>
    </div>
  </div>
</div>

<style>
  .custom-checkbox {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .custom-checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: #ccc;
    border-radius: 5px;
    border: 2px solid white;
    margin-right: 10px;
    position: relative;
  }

  .custom-checkbox input:checked + .checkmark {
    background-color: black;
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  .custom-checkbox input:checked + .checkmark:after {
    display: block;
  }

  .custom-checkbox .checkmark:after {
    left: 6px;
    top: 3px;
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  .table-divide {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
</style>
