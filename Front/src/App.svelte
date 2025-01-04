<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Menu from "./components/menu.svelte";
  import Footer from "./components/footer.svelte";
  import Header from "./components/header.svelte";
  import Info from "./components/info.svelte";
  import Index from "./components/index.svelte";
  import Form from "./components/form.svelte";
  import Rank from "./components/rank.svelte";
  import Record from "./components/record.svelte";
  import Event from "./components/event.svelte";
  import Boardlist from "./components/Boardlist.svelte";
  import Post from "./components/post.svelte"
  import Write from "./components/write.svelte";
  import Pastwinner from "./components/pastwinner.svelte";
  import Calculater from "./components/calculater.svelte";
  import Zpkepscore from "./components/calculater/zpkepscore.svelte";
  import Babapkpscore from "./components/calculater/babapkpscore.svelte";
import Visio from "./components/calculater/visio.svelte";
import Ring from "./components/calculater/ring.svelte";
  import Babapksimul from "./components/calculater/babapksimul.svelte";
import Elo from "./components/calculater/elo.svelte";
    import Mpkadmin from "./components/mpkadmin.svelte";
    import Babapkadmin from "./components/babapkadmin.svelte";
    import Mpksimul from "./components/calculater/mpksimul.svelte";
    import Zpkesimul from "./components/calculater/zpkesimul.svelte";
    import Zpkeadmin from "./components/zpkeadmin.svelte";
    import Clanrank from "./components/clanrank.svelte";
    import Home from "./components/home.svelte";
    
</script>
<Router>
<nav>
  <Menu />
</nav>

<header>
<Header />
</header>


<main>
  <Route path="/:type/info" component={Info} />
  <Route path="/" component={Home} />
  <Route path="/babapk" component={Index} />
  <Route path="/mpk" component={Index} />
  <Route path="/zpke" component={Index} />
  <Route path="/:type/rank" component={Rank} />
  <Route path="/:type/record" component={Record} />
  <Route path="/:type/tournament" component={Event}/>
  <Route path="/:type/boardlist" component={Boardlist}/>
  <Route path="/:type/post/:id" component={Post}/>
  <Route path="/:type/write" component={Write}/>
  <Route path="/:type/winners" component={Pastwinner}/>
  <Route path="/:type/calculator" component={Calculater}/>
  <Route path="/zpke/pscore" component={Zpkepscore}/>
  <Route path="/babapk/pscore" component={Babapkpscore}/>
  <Route path="/babapk/visio" component={Visio}/>
  <Route path="/:type/ring" component={Ring}/>
  <Route path="/babapk/simul" component={Babapksimul}/>
  <Route path="/:type/elo" component={Elo}/>
  <Route path="/mpk/admin" component={Mpkadmin}/>
  <Route path="/babapk/admin" component={Babapkadmin}/>
  <Route path="/mpk/simul" component={Mpksimul}/>
  <Route path="/zpke/simul" component={Zpkesimul}/>
  <Route path="/zpke/admin" component={Zpkeadmin}/>
  <Route path="/babapk/clan" component={Clanrank}/>
  

</main>

<div class="form-container">
<Form />
</div>


<footer>
  <Footer />
</footer>

</Router>