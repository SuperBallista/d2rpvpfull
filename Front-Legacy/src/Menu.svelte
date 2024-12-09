<script>
  import { Link, navigate } from "svelte-routing";
  import {
    nickname,
    formopen,
    mode,
    clickformopen,
    key,
    jwtToken,
    csrfToken,
    SecurityFetch
  } from "./store.js";
  import { onMount } from "svelte";

  import Form from "./Form.svelte";
  let menuItems = [];
  let marker;
  let activeIndex = -1;

  let contentElement;
  let scrollAmount = 100; // 한 번에 스크롤할 양

  let showScrollLeft = false;
  let showScrollRight = false;

  let isDragging = false;
  let startX;
  let scrollLeft;

  function scrollLeftf() {
    if (contentElement) {
      contentElement.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
      updateScrollButtons();
    }
  }

  function scrollRight() {
    if (contentElement) {
      contentElement.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
      updateScrollButtons();
    }
  }

  function handleKeydown(event, callback) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  }

  function handle_key(mode) {
    $key.set($key + 1);
    const currentUrl = window.location.href; // 현재 URL을 가져옵니다
    if (currentUrl.includes("/mpk")) {
      mode.set(true); // URL에 /mpk가 포함되어 있으면 mode를 true로 설정합니다
    } else {
      mode.set(false);
    }
  }

  // Define the navigation links
  $: links = !$mode
    ? [
        {
          linkname: `<div class="menu-icon"><i class="fa-solid fa-circle-info"></i></div><div class="menu-name">공지사항</div>`,
          href: "/babapk/notice",
        },
        {
          linkname: `<div class="menu-icon"><i class="fa-solid fa-ranking-star"></i></div><div class="menu-name">랭킹조회</div>`,
          href: "/babapk/rank",
        },
        {
          linkname: `<div class="menu-icon"><i class="fa-solid fa-comments"></i></div><div class="menu-name">커뮤니티</div>`,
          href: "/babapk/boardlist",
        },
        {
          linkname: `<div class="menu-icon"><i class="fa-regular fa-file-lines"></i></div><div class="menu-name">대전기록</div>`,
          href: "/babapk/record",
        },
        {
          linkname: `<div class="menu-icon"><i class="fa-solid fa-pen-to-square"></i></div><div class="menu-name">대회기록</div>`,
          href: "/babapk/event",
        },
        {
          linkname: `<div class="menu-icon"><i class="fa-solid fa-calculator"></i></div><div class="menu-name">계산하기</div>`,
          href: "/babapk/calculater",
        },
        {
          linkname: `<div class="menu-icon"><i class="fa-solid fa-calendar-days"></i></div><div class="menu-name">대회일정</div>`,
          href: "/",
        },
        {
          linkname: `<div class="menu-icon"><i class="fa-solid fa-trophy"></i></div><div class="menu-name">역대우승</div>`,
          href: "/babapk/winner",
        },
        {
          linkname: `<div class="menu-icon"><i class="fa-solid fa-database"></i></div><div class="menu-name">지난시즌</div>`,
          href: "/babapk/oldrecord",
        },
      ]
    : [
        {
          linkname: `<div class="menu-icon"><i class="fa-solid fa-circle-info"></i></div><div class="menu-name">공지사항</div>`,
          href: "/mpk/notice",
        },
        {
          linkname: `<div class="menu-icon"><i class="fa-solid fa-ranking-star"></i></div><div class="menu-name">랭킹조회</div>`,
          href: "/mpk/rank",
        },
        {
          linkname: `<div class="menu-icon"><i class="fa-solid fa-comments"></i></div><div class="menu-name">커뮤니티</div>`,
          href: "/mpk/boardlist",
        },
        {
          linkname: `<div class="menu-icon"><i class="fa-regular fa-file-lines"></i></div><div class="menu-name">대전기록</div>`,
          href: "/mpk/record",
        },
        {
          linkname: `<div class="menu-icon"><i class="fa-solid fa-people-group"></i></div><div class="menu-name">클랜경기</div>`,
          href: "/mpk/clan",
        },
        {
          linkname: `<div class="menu-icon"><i class="fa-solid fa-pen-to-square"></i></div><div class="menu-name">대회기록</div>`,
          href: "/mpk/event",
        },
        {
          linkname: `<div class="menu-icon"><i class="fa-solid fa-calculator"></i></div><div class="menu-name">계산하기</div>`,
          href: "/mpk/calculater",
        },
        {
          linkname: `<div class="menu-icon"><i class="fa-solid fa-calendar-days"></i></div><div class="menu-name">대회일정</div>`,
          href: "/mpk",
        },
        {
          linkname: `<div class="menu-icon"><i class="fa-solid fa-trophy"></i></div><div class="menu-name">역대우승</div>`,
          href: "/mpk/winner",
        },
        {
          linkname: `<div class="menu-icon"><i class="fa-solid fa-database"></i></div><div class="menu-name">지난시즌</div>`,
          href: "/mpk/oldrecord",
        },
      ];

  // 서버로 로그아웃 요청 함수
  async function logoutprocess() {
    try {
      const response = await SecurityFetch("/auth/logout","POST");

      if (response.ok) {
        alert("로그아웃하였습니다");
        nickname.set(null);
        jwtToken.set(null);
        csrfToken.set(null);
      } else {
        alert(`로그아웃 중 오류 발생: ${response.status}`);
      }
    } catch (error) {
      console.error("로그아웃 오류 발생:", error);
      alert("로그아웃 중 오류 발생: " + error.message);
    }
  }

  
  function updateMarker(index) {
    if (!menuItems[index] || !marker) return;

    const item = menuItems[index];
    const itemRect = item.getBoundingClientRect();
    const menuRect = item.closest(".inner").getBoundingClientRect();

    const leftPosition = itemRect.left - menuRect.left;

    marker.style.width = `${itemRect.width}px`;
    marker.style.transform = `translateX(${leftPosition}px)`;
    activeIndex = index;
  }

  function handleMouseEnter(index) {
    updateMarker(index);
    marker.style.opacity = "1";
  }

  function handleMouseLeave() {
    updateMarker(activeIndex);
    marker.style.opacity = "0";
  }

  onMount(async () => {
    checkAuth();
    updateMarker(0); // 초기 위치 설정
    const currentUrl = window.location.href; // 현재 URL을 가져옵니다
    if (currentUrl.includes("/mpk")) {
      mode.set(true); // URL에 /mpk가 포함되어 있으면 mode를 true로 설정합니다
    } else {
      mode.set(false);
    }
  });

  function updateScrollButtons() {
    if (contentElement) {
      showScrollLeft = contentElement.scrollLeft > 0;
      showScrollRight =
        contentElement.scrollWidth >
        contentElement.clientWidth + contentElement.scrollLeft;
    }
  }

  onMount(async () => {
    updateMarker(0); // 초기 위치 설정
    const currentUrl = window.location.href; // 현재 URL을 가져옵니다
    if (currentUrl.includes("/mpk")) {
      mode.set(true); // URL에 /mpk가 포함되어 있으면 mode를 true로 설정합니다
    } else {
      mode.set(false);
    }

    // 메뉴 초기 상태 업데이트
    updateScrollButtons();

    // 윈도우 리사이즈 이벤트에 핸들러 추가
    window.addEventListener("resize", updateScrollButtons);
    contentElement.addEventListener("scroll", updateScrollButtons);

    // 드래그 이벤트 핸들러 추가
    contentElement.addEventListener("mousedown", handleMouseDown);
    contentElement.addEventListener("mouseup", handleMouseUp);
    contentElement.addEventListener("mouseleave", handleMouseUp);
    contentElement.addEventListener("mousemove", handleMouseMove);
  });

  function handleMouseDown(e) {
    isDragging = true;
    contentElement.classList.add("active");
    startX = e.pageX - contentElement.offsetLeft;
    scrollLeft = contentElement.scrollLeft;
  }

  function handleMouseUp() {
    isDragging = false;
    contentElement.classList.remove("active");
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - contentElement.offsetLeft;
    const walk = (x - startX) * 2; // 스크롤 속도 조절
    contentElement.scrollLeft = scrollLeft + walk;
    updateScrollButtons();
  }


  async function checkAuth() {
  try {
    const response = await SecurityFetch('/check-auth',"GET");

    if (response.ok) {
      const data = await response.json();
            // JWT 토큰을 헤더에서 가져오기
            const jwtTokenFromHeader = response.headers.get('d2rpvpjwtToken');
            console.log(jwtTokenFromHeader);

      if (jwtTokenFromHeader) {
        jwtToken.set(jwtTokenFromHeader); // JWT 토큰 설정
      }
      nickname.set(data.username);
      const currentUrl = window.location.href; // 현재 URL을 가져옵니다

      if (data.username.endsWith("_m")) {
        mode.set(true);
        
        if (currentUrl.includes('/mpk'))
        {}
        else 
        { navigate(`/mpk`);}

      } else {
        mode.set(false);
        
        if (currentUrl.includes('/mpk'))
        {navigate(`/`);}
      }
    } else {
    }
  } catch (error) {
    
    }
}


</script>

{#if $formopen}
  <div class="graybg">
    <Form />
  </div>
{/if}

<nav key={$key}>
  {#if $nickname}
    <div class="logined-info main_data">
      {#if $nickname === "admin"}
        <Link to="/babapk/admin" class="logined-info_admin"
          > <i class="fa-solid fa-gear"></i>
            관리설정
            </Link
        >{:else if $nickname === "admin_m"}
        <Link to="/mpk/admin" class="logined-info_admin"
          > <i class="fa-solid fa-gear"></i>
            관리설정
          </Link
        >
      {/if}
      <button class="buttonlink " on:click={() => logoutprocess()}>
          <i class="fa-solid fa-right-from-bracket"></i> 로그아웃
        </button
      >
      <button class="buttonlink " on:click={() => clickformopen("myinfo")}
        >
          <i class="fa-solid fa-id-card"></i> 나의정보
      </button>
    </div>
  {:else}
    <div class="logouted-info main_data">
      {#if $mode}
        <Link to="/"  class="logouted-info_mode"  on:click={handle_key}>
            <i class="fa-solid fa-right-left"></i> babapk접속
        </Link>
      {:else}
        <Link to="/mpk" class="logouted-info_mode" on:click={handle_key}>
            <i class="fa-solid fa-right-left"></i>
            mpk접속
        </Link>
      {/if}

      <button on:click={() => clickformopen("login")} class="buttonlink">
          <i class="fa-solid fa-right-to-bracket"></i> 로그인
        </button
      >

      <button class="buttonlink" on:click={() => clickformopen("register")}>
          <i class="fa-solid fa-user-plus"></i>
          등록하기
        </button
      >
    </div>
  {/if}
  <div class="main_data">
    <div class="moving-inner">
      {#if showScrollLeft}
        <div
          class="left-button"
          tabindex="0"
          role="button"
          on:click={scrollLeftf}
          on:keydown={(e) => handleKeydown(e, scrollLeftf)}
        >
          <i class="fa-solid fa-circle-left"></i>
        </div>
      {/if}
      {#if showScrollRight}
        <div
          class="right-button"
          tabindex="0"
          role="button"
          on:click={scrollRight}
          on:keydown={(e) => handleKeydown(e, scrollRight)}
        >
          <i class="fa-solid fa-circle-right"></i>
        </div>
      {:else}
        <div class="none"></div>
      {/if}
    </div>
    <div class="inner">
      <div class="menu" bind:this={contentElement}>
        {#each links as { linkname, href }, index}
          <div
            class="menu-item"
            bind:this={menuItems[index]}
            on:mouseenter={() => handleMouseEnter(index)}
            on:mouseleave={handleMouseLeave}
          >
            <Link to={href}>{@html linkname}</Link>
          </div>
        {/each}
        <span class="marker" bind:this={marker}></span>
      </div>
    </div>
  </div>
</nav>

<style>
  .moving-inner {
    display: flex;
    justify-content: right;
    font-size: 2rem;
  }

  .graybg {
    background-color: #000d;
    z-index: 5;
    width: 100vw;
    height: 100vh;
    position: fixed;
    display: flex;
    top: 0;
  }

  .inner {
    position: relative;
    margin: 0 auto;
    display: flex;
    justify-content: center;
  }
  .marker {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 5px;
    background-color: gray;
    z-index: 1;
    transition: all 0.3s ease;
    opacity: 0;
  }

  .menu-item:hover ~ .marker {
    opacity: 1;
  }
  .menu-item:hover {
    color: gray;
  }

  .menu {
    display: flex;
    justify-content: center;
    text-align: center;
    scroll-behavior: smooth;
  }
  .menu-item {
    position: relative;
    padding: 15px 0;
    margin: 0 20px;
  }

  .menu {
    width: 80%;
    overflow: hidden;
    display: flex;
    justify-content: left;
  }

  .left-button,
  .right-button {
    cursor: pointer;
  }

  .left-button:hover,
  .right-button:hover {
    color: gray;
  }

  .none {
    width: 32px;
  }


  .menu-item {
    cursor: grab;
    cursor: -webkit-grab;
  }
</style>
