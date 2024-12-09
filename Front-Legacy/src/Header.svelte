<script>
  import { mode } from "./store.js";
  import { Link } from "svelte-routing";
</script>

<div class="header-container">
  <div class="header-title">
    {#if $mode}<Link to="/mpk">
        <div class="header-homelink">D2R PvP MPK</div></Link
      >
    {:else}<Link to="/">
        <div class="header-homelink">D2R PvP BABAPK</div></Link
      >{/if}
  </div>
</div>

<style>
  .header-homelink {
    font-size: 2.1rem;
    font-weight: bolder;
    text-align: center;
    margin-top: 5px;
  }
</style>
