<script lang="ts">
    let wScore: number | undefined;
    let lScore: number | undefined;
    let result: number | undefined;
    const k: number = 32;
    const exponent: number = 400;
  
    $: handleCalculate = () => {
      if (wScore !== undefined && lScore !== undefined) {
        const expendedScore = 1 / (1 + Math.pow(10, (lScore - wScore) / exponent));
        result = Math.round(k * (1 - expendedScore));
      } else {
        result = undefined;
      }
    };
  </script>
  
  <svelte:head>
    <title>mpk Elo점수 예상 계산기</title>
  </svelte:head>
  
  <div class="main-container">
    <div class="table-head">Elo점수 예상 계산기</div>
  
    <div class="form-wrapper">
      <div class="input-group">
        <label for="wScore">승자 점수</label>
        <input type="number" id="wScore" class="input-text name" bind:value={wScore} />
      </div>
      <div class="input-group">
        <label for="lScore">패자 점수</label>
        <input type="number" id="lScore" class="input-text name" bind:value={lScore} />
      </div>
    </div>
  
    <div class="result-wrapper">
      <button class="emphasis-button" on:click={handleCalculate}>계산</button>
      <p class="result-text">예상 득실 점수: {result !== undefined ? result : '값을 입력하세요'}</p>
    </div>
  </div>
  
  <style>

  
    .main-container {
      max-width: 300px;
      margin: 50px auto;
      padding: 20px;
      background: #3b3b3b;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  
    .table-head {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 20px;
      text-align: center;
    }
  
    .form-wrapper {
      margin-bottom: 20px;
    }
  
    .input-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 15px;
    }
  
    .input-group label {
      font-size: 0.9rem;
      margin-bottom: 5px;
      text-align: left;
    }
  
    .name{
        width: 100px;
    }
 
    .result-wrapper {
      text-align: center;
    }
  
    .result-text {
      margin-top: 15px;
      font-size: 1.1rem;
      font-weight: bold;
    }
  </style>
  