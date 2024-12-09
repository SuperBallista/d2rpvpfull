<script>

let wScore
let lScore
let result
let k = 32
let exponent = 400

$: handleCalculate = () => {
const expendedScore = 1 / (1 + Math.pow(10, (lScore - wScore) / exponent));
result = Math.round(k * (1 - expendedScore));
}


</script>
  <svelte:head>
      <title>mpk Elo점수 예상 계산기</title>
  </svelte:head>
  
  <div class="main_data table-outline">
    <div class="table-head">Elo점수 예상 계산기</div>
    
    <div class="table-contents-wrapper">
      <div class="table-contents">
        <div class="table-divide">
          <input type="number" class="numberwidth" bind:value={wScore} /> 승자 점수
        </div>
        <div class="table-divide">
          <input type="number" class="numberwidth" bind:value={lScore} /> 패자 점수
        </div>
      </div>
    </div>
  
    <div class="table-contents-wrapper">
      <div class="table-contents">
        <div class="left">
          <button on:click={handleCalculate}>계산</button><br />
  
          예상 득실 점수 : {result} 
        </div>
      </div>
    </div>
  </div>
  
  <style>
    .table-divide {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
  </style>
  