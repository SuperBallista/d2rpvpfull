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
  <Route path="/" component={Index} />
  <Route path="/mpk" component={Index} />
  <Route path="/:type/rank" component={Rank} />
  <Route path="/:type/record" component={Record} />
  <Route path="/:type/tournament" component={Event}/>
  <Route path="/:type/boardlist" component={Boardlist}/>
  <Route path="/:type/post/:id" component={Post}/>
  <Route path="/:type/write" component={Write}/>
  <Route path="/:type/winners" component={Pastwinner}/>

</main>

<div class="form-container">
<Form />
</div>


<footer>
  <Footer />
</footer>

</Router>