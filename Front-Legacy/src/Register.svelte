<script>
  import { mode, clickformopen, SecurityFetch } from "./store";
  import { writable } from "svelte/store";

  let terms = writable(false);
  let privacy = writable(false);
  let reginickname = writable("");
  let regipw = writable("");
  let regipwcheck = writable("");
  let email = writable("");
  let checked_nickname = false

  async function check_nickname() {

    if (checked_nickname)
  {alert("닉네임을 이미 확인하였습니다")}
  else
  {
    const checkEndpoint = $mode ? `/auth/m-user/check-nickname` : `/auth/b-user/check-nickname`;
    const data = {nickname: $reginickname}

    try{
    const response = await SecurityFetch(checkEndpoint,"POST",data)
    if (response.status===200) {
      alert("해당 닉네임은 사용 가능합니다")
      checked_nickname = true
    }
    else if (response.status===403) {
      alert("이미 사용중인 닉네임입니다")
    } else if (response.status === 400) {
      alert("입력값에는 숫자, 밑줄(_), 띄어쓰기를 사용할 수 없습니다.")
    }
  }
  catch (error) {
alert(error.message)    
  }
}
  }

  async function register() {
    // Check if terms and privacy are agreed
    if (!$terms || !$privacy) {
      alert("서비스 이용 약관과 개인정보 정책에 동의해야 합니다.");
      return;
    }

    // Check if password matches
    if ($regipw !== $regipwcheck) {
      alert("암호가 일치하지 않습니다.");
      return;
    }
        // Check nicknames
        if (!checked_nickname) {
      alert("닉네임 중복 여부를 먼저 확인해야합니다.");
      return;
    }

    // Create the payload
    const payload = {
      nickname: $reginickname,
      password: $regipw,
      email: $email,
    };

    try {
      const endpoint = $mode ? "/auth/m-user/register" : "/auth/b-user/register";
      const response = await SecurityFetch(endpoint, "POST",payload);
      if (!response.ok) {
        throw new Error("회원가입에 실패했습니다.");
      }

      const result = await response.json();
      alert("회원가입이 성공적으로 완료되었습니다.");
      clickformopen(null);
    } catch (error) {
      alert(error.message);
    }
  }
</script> 

<div class="left">
  {#if $mode}통합밀리{:else}정통바바{/if}
  <br />
  <a href="https://d2rpvp.org/site.html" target="_blank"
    ><div class="buttonLink">이용 약관</div></a
  >
  <label>
    <input type="checkbox" bind:checked={$terms} />서비스 이용 약관에
    동의합니다.</label
  >
  <a href="https://d2rpvp.org/privacy.html" target="_blank"
    ><div class="buttonLink">개인정보 정책</div></a
  >
  <label>
    <input type="checkbox" bind:checked={$privacy} />
    개인정보 정책에 동의합니다.
  </label>
  <br />

  닉네임
  <input class="namewidth" type="text" bind:value={$reginickname} readonly={checked_nickname} />
  <button on:click={check_nickname}>중복 확인</button><br/>
  암호
  <input class="namewidth" type="password" bind:value={$regipw} />
  암호확인
  <input class="namewidth" type="password" bind:value={$regipwcheck} />
  이메일
  <input class="namewidth" type="text" bind:value={$email} />

  <button on:click={register}>등록하기</button>
</div>
