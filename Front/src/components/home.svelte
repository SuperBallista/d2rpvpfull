<script lang="ts">
    import { onMount } from "svelte";

    export let onGoogleLogin = () => {

      // Google OAuth URL로 리디렉션
      window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?'
      +'&client_id=437914976266-cr9noqqpjokobs52sbnvlce0ncljo5bk.apps.googleusercontent.com'
      +`&redirect_uri=${window.location.origin}/auth/google/callback`
      +'&response_type=code'
     +'&scope=email';   

    };

    onMount(async () => {

        try{
        const token = sessionStorage.getItem('token');


    const response = await fetch('/auth/google', {
         method: 'POST', // 토큰 유효성 확인 요청 (POST 추천)
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ token }), // 토큰 전달
       });
 
       if (response.status===200) {
         const result = await response.json();
  myUnionAccount.set(result[0].account)
  mybabapk.set(result[0].babapk)
  mympk.set(result[0].mpk)
  myzpke.set(result[0].zpke)
  jwtToken.set(result[1])
  email.set("")
       } 
     } catch (error) {
       console.error('Token validation failed:', error);
     }
    });




    export let onKakaoLogin = () => {

      // Kakao OAuth URL로 리디렉션
      window.location.href = 'https://kauth.kakao.com/oauth/authorize'
      +'?client_id=60bf89cf2d5751b33fd1ec7e34de8c23'
      +`&redirect_uri=${window.location.origin}/auth/kakao/callback`
      +'&response_type=code'; 

    };
    import { form, myUnionAccount, myorigin, mybabapk, mympk, myzpke, modeinput, email, myaccount, jwtToken, SecurityFetch } from "../store"

    

    async function logout() {
    try{
 await SecurityFetch("/auth/logout", "POST")
  alert("로그아웃하였습니다")  
  form.set("none")
  myaccount.set("")
  myUnionAccount.set("")
  mybabapk.set("")
  mympk.set("")
  myzpke.set("")
  jwtToken.set("")
  email.set("")
  }
    catch (error)
    {
      alert(error)
    }     
    }


function ConnectNickname (mode:string){
    modeinput.set(mode)
    form.set("connect")
}


async function Unconnect(mode:string) {

    let unconnectAccount
    if (mode === "babapk"){
        unconnectAccount = $mybabapk
    } else if (mode === "mpk"){
        unconnectAccount = $mympk
    } else if (mode === "zpke"){
        unconnectAccount = $myzpke
    }

    const data = {mode: mode, nickname: unconnectAccount}
    
    const userResponse = confirm("다음 캐릭터 정보를 삭제하겠습니까? 캐릭터 정보 삭제시 현 시즌에 획득한 점수도 삭제되므로 꼭 확인해주세요!" + unconnectAccount)

    if (userResponse) {
        try{
            const response = await SecurityFetch("/connect/delete", "DELETE", data)
            
            if (response.status===200)
        {alert("삭제하였습니다!")

        if (mode==="babapk"){
            mybabapk.set("")
        } else if (mode==="mpk"){
            mympk.set("")
        }else if (mode==="zpke"){
            myzpke.set("")
        }}
        else
        {
        alert("삭제에 실패하였습니다")    
        }

        
        }
        catch (error){
            alert("에러가 발생하였습니다")
        }

    }


    
}


</script>

<style>
    .social-login {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .button {
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 8px;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: transform 0.2s ease;
        width: 200px;
    }
    .simple-button{
        width: 200px;
    }

    .button:hover {
        transform: scale(1.05);
    }

    .google {
        background: #fff;
        color: #4285f4;
        border: 1px solid #ddd;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .google svg {
        margin-right: 0.5rem;
    }

    .kakao {
        background: #fee500;
        color: #3c1e1e;
        border: 1px solid #fee500;
    }

    .kakao svg {
        margin-right: 0.5rem;
    }

    .button:active {
        transform: scale(0.95);
    }
</style>
{#if $myUnionAccount === ""}

<div class="social-login">
    <button class="button google" on:click={onGoogleLogin}>
        <svg width="24" height="24" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.15 0 5.96 1.1 8.19 3.25l6.1-6.1C34.83 3.17 29.78 1 24 1 14.61 1 6.84 6.69 3.34 14.51l7.91 6.14C13.05 14.01 18.02 9.5 24 9.5z"></path>
            <path fill="#34A853" d="M46.06 24.58c0-1.7-.15-3.35-.41-4.96H24v9.41h12.57c-.54 2.8-2.17 5.16-4.59 6.81l7.19 5.59c4.19-3.87 6.89-9.59 6.89-16.85z"></path>
            <path fill="#FBBC04" d="M10.25 28.91A15.42 15.42 0 0 1 9.63 24c0-1.64.27-3.23.77-4.74L2.48 13.1C.9 16.32 0 19.99 0 24c0 4.04.9 7.7 2.48 10.93l7.77-6.02z"></path>
            <path fill="#4285F4" d="M24 48c6.48 0 11.91-2.15 15.88-5.84l-7.19-5.59c-2.01 1.35-4.6 2.17-7.32 2.17-5.99 0-11.06-4.51-12.73-10.54l-7.91 6.14C6.84 41.31 14.61 47 24 47z"></path>
        </svg>
        구글로 로그인
    </button>
    <button class="button kakao" on:click={onKakaoLogin}>
        <svg width="24" height="24" viewBox="0 0 48 48">
            <path fill="#3C1E1E" d="M24 4C13.506 4 5 10.798 5 19c0 4.445 2.503 8.434 6.523 11.173-.343 1.89-1.244 6.827-1.445 7.895 0 0-.054.437.23.565.285.129.62-.073.62-.073.798-.118 7.774-5.068 9.07-6.055 1.594.398 3.297.595 5.002.595 10.493 0 19-6.798 19-15S34.493 4 24 4z"></path>
        </svg>
        카카오로 로그인
    </button>
    <button class="simple-button" on:click={() => form.set("unionlogin")}>
     로그인
    </button>
</div>
{:else}
<h1>로그인하였습니다!</h1>
<table>
<tbody>
<tr>
    <td>계정</td>
    <td>{$myUnionAccount}</td>
    <td></td>
</tr>
<tr>
    <td>로그인 방법</td>
    <td>{$myorigin}</td>
    <td></td>
</tr>
<tr>
    <td>정통바바 캐릭터</td>
    {#if $mybabapk}
        <td>{$mybabapk}</td>
        <td>    <button class="simple-button" on:click={() => Unconnect("babapk")}>삭제하기</button>  </td>        
        {:else}
        <td></td>
        <td>        <button class="simple-button" on:click={() => ConnectNickname("babapk")}>등록하기</button>        </td>
        {/if}
    
</tr>
<tr>
    <td>통합밀리 캐릭터</td>
    {#if $mympk}
    <td>        {$mympk.replace("_m","")}    </td>
    <td>  <button class="simple-button" on:click={() => Unconnect("mpk")}>삭제하기</button> </td>
        {:else}
        <td></td>
        <td>        <button class="simple-button" on:click={() => ConnectNickname("mpk")}>등록하기</button>        </td>
        {/if}
</tr>
<tr>
    <td>질딘PK 캐릭터</td>
    {#if $myzpke}
    <td>        {$myzpke.replace("_z","")}    </td>
    <td>  <button class="simple-button" on:click={() => Unconnect("zpke")}>삭제하기</button> </td>
        {:else}
        <td></td>
        <td>        <button class="simple-button" on:click={() => ConnectNickname("zpke")}>등록하기</button>        </td>
        {/if}
    
</tr>
<tr>
    <td>암호</td>
    <td>*********</td>
    <td><button class="simple-button" on:click={() => form.set("changepw")}>변경</button></td>
    </tr>
    <tr>
        <td>이메일</td>
        <td>{$email}</td><td> <button class="simple-button" on:click={() => form.set("changeemail")}>변경</button></td>
        </tr>
        <tr>
            <td>계정삭제</td>
            <td></td>
            <td><button class="simple-button" on:click={() => form.set("deleteaccount")}>삭제</button></td>
            </tr>
                
<tr>
<td>로그 아웃</td>
<td></td>
<td><button class="simple-button" on:click={() => logout()}>로그아웃</button></td>

</tr>
</tbody>
</table>


{/if}