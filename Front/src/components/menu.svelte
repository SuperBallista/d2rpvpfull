<script lang="ts">
      import { Link, useLocation, navigate } from "svelte-routing";
      import { mode, form, myaccount, SecurityFetch, jwtToken } from "../store";
  import { onMount } from "svelte";
      

  export let isOpen = false;
  
  const location = useLocation();
  let pathname = "";
  let modeName
  let modeChange = "밀리PK"
  let modeChangeLink = "/mpk"
  let modeSrc:string
  let menuItems:any[]
  $: pathname = $location.pathname;

  const toggleMenu = () => {
    isOpen = !isOpen;
  };


$: if (pathname.includes("mpk"))
{mode.set("mpk")
 modeName = "밀리PK"
 modeSrc = "/" + $mode
 modeChangeLink = "/zpke"
 modeChange = "질딘PK"
 menuSet()
}
else if (pathname.includes("zpke"))
{mode.set("zpke")
modeName = "질딘PK"
modeChangeLink = "/"
modeSrc = "/" + $mode
modeChange = "정통바바"
menuSet()
}
else
{mode.set("babapk")
modeName = "정통바바"
modeSrc = "/" + $mode
modeChangeLink = "/mpk"
modeChange = "밀리PK"
menuSet()
}


function menuSet() {
  menuItems = [
    { label: "공지사항", href: "/info" },
    { label: "랭킹조회", href: "/rank" },
    { label: "대전기록", href: "/record" },
    { label: "대회기록", href: "/tournament" },
    ...($mode === "babapk" ? [{ label: "클랜목록", href: "/clan" }] : []),
    { label: "커뮤니티", href: "/boardlist" },
    ...($mode === "zpke" ? [] : [{ label: "역대우승", href: "/winners" }]),
    { label: "계산하기", href: "/calculator" },
    ...($myaccount === "admin" || $myaccount === "admin_m" || $myaccount === "admin_z"
      ? [{ label: "관리설정", href: "/admin" }]
      : []),
  ];

  if ($mode === "mpk")
{ document.body.style.backgroundColor = "#2a1e2e"}
else if ($mode === "zpke")
{document.body.style.backgroundColor = "#102a2d"}
else
{document.body.style.backgroundColor = "#0d0d0d"}
}




async function checkJwt() {

  try {
const response = await SecurityFetch("/auth/check-jwt", "POST")
const data =  await response.json()
if (data.authenticated)
{
 myaccount.set(data.username);
 jwtToken.set(data.token);
 mode.set(data.mode);
 navigate("/" + $mode)
 modeSrc =  "/" + $mode;
 menuSet()
}
else
{
myaccount.set("");
jwtToken.set("");
}

  }
  catch (error)
  {
    alert("서버 연결에 실패하였습니다")
  }
}

onMount(async () => {
    await checkJwt();
  });

  </script>
  
  <style>
    .menu-container {
      position: fixed;
      top: 1%;
      left: 5%;
      width: 90%;
      background: #2e2e2e;
      color: #d4af37;
      padding: 10px 20px;
      border-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      box-sizing: border-box;
    }
  
    .menu-logo {
      font-size: 1.5rem;
      font-weight: bold;
    }
  
    .menu-items {
      display: flex;
      gap: 20px;
    }
  
    .hamburger {
      display: none;
      flex-direction: column;
      gap: 6px;
      cursor: pointer;
      padding: 10px;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      box-sizing: border-box;
    }
  
    .hamburger span {
      width: 25px;
      height: 3px;
      background: #f4f4f4;
      border-radius: 2px;
      transition: transform 0.3s, opacity 0.3s;
    }
  
    .login-btn {
      display: inline-block;
      padding: 8px 16px;
      color: #f4f4f4;
      background-color: #333;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s, color 0.3s;
    }
  
    .login-btn:hover {
      background-color: #333;
      color: #f4f4f4;
    }
  
    .mobile-menu {
      position: fixed;
      top: 60px;
      width: 90%;
      left: 5%;
      background: #3b3b3b;
      border-radius: 0 0 12px 12px;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-in-out;
      z-index: 999;
    }
  
    .mobile-menu.open {
      max-height: 70vh;
      overflow-y: auto;
    }
  
    @media (max-width: 768px) {
      .menu-items {
        display: none;
      }
  
      .hamburger {
        display: flex;
      }
  
      .login-btn {
        display: none;
      }
      .login-icon {
      position: absolute;
      right: 60px;
    }

    }

    .login-icon {
    color: #f4f4f4;
    font-size: 1.5rem;
    cursor: pointer;
    transition: color 0.3s;
  }

  .login-icon:hover {
    color: #333;
  }

  @media (min-width: 769px) {
    .login-icon {
      margin-left: auto;
    }
  }


  </style>
  

  <div class="menu-container">
    <div class="menu-logo"><Link class="menu-logo-link" to={modeSrc}>D2RPvP</Link>   </div>
  
    <!-- Desktop Menu -->
    <div class="menu-items">
      {#each menuItems as item}
        <Link class="link" to={modeSrc + item.href} on:click={() => (isOpen = false)}>{item.label}</Link>
      {/each}
    </div>
  
    <!-- Mobile Hamburger -->
    <button class="hamburger" on:click={toggleMenu}>
      <span style:transform={isOpen ? 'rotate(45deg)' : ''}></span>
      <span style:opacity={isOpen ? '0' : '1'}></span>
      <span style:transform={isOpen ? 'rotate(-45deg)' : ''}></span>
    </button>
  </div>
 

  <!-- Mobile Menu -->
  <div class={`mobile-menu ${isOpen ? 'open' : ''}`}>
    {#each menuItems as item}
      <Link class="link" to={modeSrc + item.href} on:click={() => (isOpen = false)}>{item.label}</Link>
    {/each}
  </div>

  
  <div class="floating-button">
    {#if ($myaccount === "")}
    <button class="emphasis-button inline-block" on:click={() => form.set("login")}>
      로그인
    </button>
    <Link class="simple-button" to={modeChangeLink}>
      {modeChange}
    </Link>
    {:else}
    <button class="simple-button" on:click={() => form.set("myinfo")}>나의정보</button>
    
    {/if}
  </div>
  