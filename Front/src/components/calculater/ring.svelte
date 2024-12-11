<script lang="ts">
    let ar: number = 0;
    let strength: number = 0;
    let dexterity: number = 0;
    let life: number = 0;
    let mindmg: number = 0;
    let maxdmg: number = 0;
    let charclass: number = 4;
    let result: number = 0;
    let bonusar: boolean = false;
  
    $: handleCalculate = () => {
      let score = strength + dexterity + ar / 5 + (maxdmg + mindmg) * 1.5 + (life / charclass);
  
      if (bonusar) {
        score += 38 / 5;
      }
  
      result = score;
    };
  </script>
  
  <table>
    <thead>
      <tr>
        <th>링 스탯 측정기</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <select class="input-text short" bind:value={charclass} on:change={handleCalculate}>
            <option value="4">야만용사</option>
            <option value="3">성기사</option>
            <option value="2">드루이드</option>
            <option value="3">아마존</option>
          </select>
        </td>
      </tr>
      <tr>
        <td>
          <label>
            <input class="input-text short" type="checkbox" bind:checked={bonusar} /> + 5% 추가어레
          </label>
          <input class="input-text short" type="number" bind:value={mindmg} /> 최소 데미지
        </td>
      </tr>
      <tr>
        <td>
          <input class="input-text short" type="number" bind:value={maxdmg} /> 최대 데미지
          <input class="input-text short" type="number" bind:value={ar} /> 어레
        </td>
      </tr>
      <tr>
        <td>
          <input class="input-text short" type="number" bind:value={strength} /> 힘
          <input class="input-text short" type="number" bind:value={dexterity} /> 민첩
        </td>
      </tr>
      <tr>
        <td>
          <input class="input-text short" type="number" bind:value={life} /> 생명력
        </td>
      </tr>
      <tr>
        <td>
          <button class="emphasis-button" on:click={handleCalculate}>계산</button><br />
          이 링의 전체 스탯은 {result} 스탯 입니다.
          <br/> 단순히 스탯만을 계산하므로 전체적인 성능과는 차이가 있을 수 있습니다.
        </td>
      </tr>
    </tbody>
  </table>
  
<style>
.short{
padding: 3px;
width: 80px;

}

</style>