<script>
  import { Link } from "svelte-routing";
</script>
<svelte:head>
    <title>mpk 계산기 모음</title>
</svelte:head>

<div class="main_data table-outline">
  <div class="table-head">
    <div class="table-linktext">mpk 계산기</div>
  </div>
  <div class="table-contents-wrapper">
    <Link to="mpk/matchmaker"
      ><div class="table-contents">
        <div class="table-linktext">대진표 생성기</div>
      </div></Link
    >
  </div>

  <div class="table-contents-wrapper">
    <Link to="mpk/pscore"
      ><div class="table-contents">
        <div class="table-linktext">파워 점수 계산기</div>
      </div></Link
    >
  </div>

  <div class="table-contents-wrapper">
    <Link to="mpk/simul"
      ><div class="table-contents">
        <div class="table-linktext">대전 시뮬레이터</div>
      </div></Link
    >
  </div>
  <div class="table-contents-wrapper">
    <Link to="mpk/ring"
      ><div class="table-contents">
        <div class="table-linktext">링 스탯 측정기</div>
      </div></Link
    >
  </div>
  <div class="table-contents-wrapper">
    <Link to="mpk/elo"
      ><div class="table-contents">
        <div class="table-linktext">Elo 예상 점수 계산기</div>
      </div></Link
    >
  </div>


</div>

<style>
  .table-contents,
  .table-head {
    width: 100%;
    height: 45px;
  }
  .table-linktext {
    margin-left: 25px;
  }
  .table-contents:hover {
text-decoration: underline;

  }

</style>
