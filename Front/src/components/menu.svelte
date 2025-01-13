<script lang="ts">
      import { Link, useLocation } from "svelte-routing";
      import { mode, form, myaccount, SecurityFetch, jwtToken, mybabapk, mympk, myzpke, myUnionAccount, email, myorigin, admin, lang } from "../store";
  import { onMount } from "svelte";
      
  
  export let isOpen = false;

    

  const location = useLocation();
  let pathname = "";
  let modeName
  let modeChange = $lang ? "밀리PK" : "Melee PK"
  let modeChangeLink = "/mpk"
  let modeSrc = "/"
  let menuItems:{label:string, href:string}[]
  $: pathname = $location.pathname;

  const toggleMenu = () => {
    isOpen = !isOpen;
  };



$: if (pathname.includes("mpk"))
{mode.set("mpk")
 modeName = $lang ? "밀리PK" : "Melee PK"
 modeChangeLink = "/zpke"
 modeChange = $lang ? "질딘PK" : "Zeal PK"
 modeSrc = "/" + $mode
 menuSet()
 myaccount.set($mympk || "")
}
else if (pathname.includes("zpke"))
{mode.set("zpke")
modeName = $lang ? "질딘PK" : "Zeal PK"
modeChangeLink = "/babapk"
modeChange = $lang ? "정통바바" : "Barb PK"
modeSrc = "/" + $mode
menuSet()
myaccount.set($myzpke || "")
}
else if (pathname.includes("babapk"))
{mode.set("babapk")
modeName = $lang ? "정통바바" : "Barb PK"
modeChangeLink = "/mpk"
modeChange = $lang ? "밀리PK" : "Melee PK"
modeSrc = "/" + $mode
menuSet()
myaccount.set($mybabapk || "")
}
else
{mode.set("")
modeSrc = ""
menuSet()
}


function menuSet() {
  menuItems = $mode === "" ? [
    { label: $lang ? "정통바바" : "Barb PK", href: "/babapk" },
    { label: $lang ? "통합밀리" : "Melee PK", href: "/mpk" },
    { label: $lang ? "질딘PK" : "Zeal PK", href: "/zpke" },
  ] : [
    { label: $lang ? "공지사항" : "Notice", href: "/info" },
    { label: $lang ? "랭킹조회" : "Ladder", href: "/rank" },
    { label: $lang ? "대전기록" : "Records", href: "/record" },
    { label: $lang ? "대회기록" : "Event", href: "/tournament" },
    ...($mode === "babapk" ? [{ label: $lang ? "클랜목록" : "Clans", href: "/clan" }] : []),
    { label: $lang ? "커뮤니티" : "Community", href: "/boardlist" },
    ...($mode === "zpke" ? [] : [{ label: $lang ? "역대우승" : "Winners", href: "/winners" }]),
    { label: $lang ? "계산하기" : "Calculator", href: "/calculator" },
    ...($admin.includes($mode)
      ? [{ label: $lang ? "관리설정" : "Settings", href: "/admin" }]
      : []),
  ];

  if ($mode === "mpk")
{ document.body.style.backgroundColor = "#2a1e2e"}
else if ($mode === "zpke")
{document.body.style.backgroundColor = "#102a2d"}
else if ($mode === "babapk")
{document.body.style.backgroundColor = "#2a2d21"}
else
{document.body.style.backgroundColor = "#0d0d0d"}
}





async function checkJwt() {

  try {
const response = await SecurityFetch("/auth/check-jwt", "POST")
const data =  await response.json()
if (data.authenticated)
{
 myUnionAccount.set(data.username);
 mybabapk.set(data.babapk);
 mympk.set(data.mpk);
 myzpke.set(data.zpke);
 jwtToken.set(data.token);
 email.set(data.email);
 myorigin.set(data.origin);
 admin.set(data.admin);
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
    const msg = $lang ? "서버 연결에 실패했습니다" : "Server Error"
    alert(msg + error)
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

  /* 토글 스위치 컨테이너 */
  .toggle-switch {
    position: relative;
    width: 50px;
    height: 25px;
    background-color: #f5f5f5;
    border-radius: 25px;
    cursor: pointer;
    transition: background-color 0.4s;
  }

  /* 슬라이더 핸들 */
  .slider {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 19px;
    height: 19px;
    background-color: #3b3b3b;
    border-radius: 50%;
    transition: transform 0.4s;
  }

  /* 활성화 상태 (ON) */
  .toggle-switch.on {
    background-color: #1e1e2f;
  }

  .toggle-switch.on .slider {
    transform: translateX(25px);
  }
  .slider-label{
    color:#f5f5f5;
    font-size: 1.25rem;
    width: 70px;
    text-align: center;
  }
  .switch-container{
    display: flex;
    flex-direction: row;
  }

  </style>
  

  <div class="menu-container">
    <div class="menu-logo"><Link class="menu-logo-link" to="/">D2RPvP</Link>   </div>
  
    <!-- Desktop Menu -->
    <div class="menu-items">
      {#each menuItems as item}
        <Link class="link" to={modeSrc + item.href} on:click={() => (isOpen = false)}>{item.label}</Link>
      {/each}
    </div>
  
<!-- 토글 스위치 -->
<div class="switch-container">
<div class="toggle-switch {$lang ? 'on' : ''}" on:click={() => lang.set(!$lang)}>
  <div class="slider"></div>
</div>
<div class="slider-label">{$lang ? "English" : "한국어"}</div>
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
    {#if $mode !== ""}
    {#if $myUnionAccount === ""}
    <Link class="emphasis-button inline-block" to="/">
      {$lang ? "로그인" : "SignUp"}
    </Link>
    {/if}
    {#if $myaccount !==""}
    <button class="simple-button" on:click={() => form.set("myinfo")}>{$lang ? "나의정보" : "MyPages"}</button>
    {:else if $myUnionAccount !== ""}
    <button class="simple-button" on:click={() => form.set("connect")}>{$lang ? "등록하기" : "Register"}</button>
    {/if}
    <Link class="simple-button" to={modeChangeLink}>
      {modeChange}
    </Link>
{/if}
  </div>
  