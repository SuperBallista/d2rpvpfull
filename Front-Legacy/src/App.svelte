<script>
  import { Router, Route } from "svelte-routing";
  import Boardlist from "./Boardlist.svelte";
  import Post from "./Post.svelte";
  import Babapk from "./Babapk.svelte";
  import Notice from "./babapk/Notice.svelte";
  import Rank from "./babapk/Rank.svelte";
  import Record from "./babapk/Record.svelte";
  import Event from "./babapk/Event.svelte";
  import Calculater from "./babapk/Calculater.svelte";
  import Winner from "./babapk/Winner.svelte";
  import Menu from "./Menu.svelte";
  import Footer from "./Footer.svelte";
  import Visio from "./babapk/Visio.svelte";
  import Pscore from "./babapk/Pscore.svelte";
  import Stat from "./babapk/Stat.svelte";
  import Simul from "./babapk/Simul.svelte";
  import Ring from "./babapk/Ring.svelte";
  import Admin from "./babapk/Admin.svelte";
  import Oldrecord from "./babapk/Oldrecord.svelte";

  import Mpk from "./Mpk.svelte";
  import Mnotice from "./mpk/Notice.svelte";
  import Mrank from "./mpk/Rank.svelte";
  import Mevent from "./mpk/Event.svelte";
  import Mcalculater from "./mpk/Calculater.svelte";
  import Mrecord from "./mpk/Record.svelte";
  import Mwinner from "./mpk/Winner.svelte";
  import Mpscore from "./mpk/Pscore.svelte";
  import Msimul from "./mpk/Simul.svelte";
  import Mring from "./mpk/Ring.svelte";
  import Madmin from "./mpk/Admin.svelte";
  import Clan from "./mpk/Clan.svelte";
  import Melo from "./mpk/Elocheck.svelte";


  import Moldrecord from "./mpk/Oldrecord.svelte";
  import Write from "./Write.svelte";

  import Notfound from "./Notfound.svelte";
  import Matchmaker from "./Matchmaker.svelte"

  import { showNavbar } from "./store";
  // Store를 사용하여 컴포넌트 간에 공유 상태를 관리할 수 있습니다.

  import { writable } from "svelte/store";
  import Header from "./Header.svelte";

  // 현재 URL을 가져와서 `mpk`가 포함되어 있는지 확인합니다.
  const initialValue = window.location.href.includes("mpk");

  // 초기값으로 스토어를 생성합니다.
  export const mode = writable(initialValue);

  // URL이 변경될 때 스토어 값을 업데이트할 수 있습니다. (선택 사항)
  function checkUrl() {
    mode.set(window.location.href.includes("mpk"));
  }

  // URL 변경을 감지하려면 이벤트 리스너를 추가할 수 있습니다.
  window.addEventListener("popstate", checkUrl);
  window.addEventListener("pushstate", checkUrl);

  // 구글 애널리틱스
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-LYX9E4XRWM', { 'anonymize_ip': true });

</script>

<Router>
  <header>
    <Header />
  </header>
  {#if $showNavbar}
    <Menu />
  {/if}
  <main>
    <Route path="/" component={Babapk} />
    <Route path="/babapk/boardlist" component={Boardlist} />
    <Route path="/babapk/post/:id" component={Post} />
    <Route path="/babapk/write" component={Write} />
    <Route path="/mpk/boardlist" component={Boardlist} />
    <Route path="/mpk/post/:id" component={Post} />
    <Route path="/mpk/write" component={Write} />
    <Route path="/babapk/matchmaker" component={Matchmaker} />
    <Route path="/babapk/notice" component={Notice} />
    <Route path="/babapk/rank" component={Rank} />
    <Route path="/babapk/record" component={Record} />
    <Route path="/babapk/event" component={Event} />
    <Route path="/babapk/calculater" component={Calculater} />
    <Route path="/babapk/visio" component={Visio} />
    <Route path="/babapk/pscore" component={Pscore} />
    <Route path="/babapk/stat" component={Stat} />
    <Route path="/babapk/simul" component={Simul} />
    <Route path="/babapk/ring" component={Ring} />
    <Route path="/babapk/winner" component={Winner} />
    <Route path="/babapk/admin" component={Admin} />
    <Route path="/babapk/oldrecord" component={Oldrecord} />
    <Route path="/mpk" component={Mpk} />
    <Route path="/mpk/matchmaker" component={Matchmaker} />
    <Route path="/mpk/notice" component={Mnotice} />
    <Route path="/mpk/rank" component={Mrank} />
    <Route path="/mpk/record" component={Mrecord} />
    <Route path="/mpk/event" component={Mevent} />
    <Route path="/mpk/calculater" component={Mcalculater} />
    <Route path="/mpk/pscore" component={Mpscore} />
    <Route path="/mpk/simul" component={Msimul} />
    <Route path="/mpk/ring" component={Mring} />
    <Route path="/mpk/elo" component={Melo} />
    <Route path="/mpk/winner" component={Mwinner} />
    <Route path="/mpk/admin" component={Madmin} />
    <Route path="/mpk/oldrecord" component={Moldrecord} />
    <Route path="/mpk/clan" component={Clan} />
    <Route path="*" component={Notfound} />
  </main>
  <footer><Footer /></footer>
</Router>
