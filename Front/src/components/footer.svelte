<script>

import { useLocation } from "svelte-routing";
    
    const location = useLocation();
   $: pathname = $location.pathname;



  const footerLinks = [
    { label: "문의하기", href: "https://open.kakao.com/me/balli" },
    { label: "개인정보 보호정책", href: "/privacy.html" },
    { label: "이용 약관", href: "/terms.html" }
  ];

  $: socialLinks = pathname.includes("mpk") ? [
    { icon: "/assets/icons/discord.svg", href: "https://discord.gg/4tuTA5Uf", alt: "mpk Discord" },
    { icon: "/assets/icons/kakao.svg", href: "https://open.kakao.com/o/gPUHe6kf", alt: "mpk Kakaotalk" },
  ] : [
    { icon: "/assets/icons/discord.svg", href: "https://discord.gg/AqvAJJKCag", alt: "babapk Discord" },
    { icon: "/assets/icons/kakao.svg", href: "https://open.kakao.com/o/giHO7Mzg", alt: "babapk Kakaotalk" },
  ];
</script>

<style>
  footer {
    color: #f4f4f4;
    padding: 20px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 20px;
  }

  .footer-links {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .footer-links a {
    text-decoration: none;
    color: #f4f4f4;
    font-size: 0.9rem;
    transition: color 0.3s;
  }

  .footer-links a:hover {
    color: #ffd700;
  }

  .social-links {
    display: flex;
    gap: 15px;
    justify-content: center;
  }

  .social-links a {
    font-size: 1.5rem;
    color: #f4f4f4;
    transition: color 0.3s;
  }

  .social-links a:hover {
    color: #ffd700;
  }

  .copyright {
    font-size: 0.8rem;
    color: #aaa;
  }

  @media (max-width: 768px) {
    .footer-links {
      gap: 10px;
    }

    .social-links a {
      font-size: 1.2rem;
    }
  }

  .social-icon {
    width: 24px;
    height: 24px;
  }

</style>

<footer>
  <!-- 링크 섹션 -->
  <div class="footer-links">
    {#each footerLinks as link}
      <a href={link.href}>{link.label}</a>
    {/each}
  </div>

  <!-- 소셜 미디어 섹션 -->
  <div class="social-links">
    {#each socialLinks as social}
       <a href={social.href} target="_blank" rel="noopener noreferrer">
        <img class="social-icon" src={social.icon} alt={social.alt} />
      </a>
    {/each}
  </div>

  <!-- 저작권 섹션 -->
  <div class="copyright">
    © {new Date().getFullYear()} D2RPvP. All rights reserved.
  </div>
</footer>
