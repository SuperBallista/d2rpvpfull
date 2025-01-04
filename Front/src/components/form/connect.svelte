<script lang="ts">
    import { form, modeinput, mode, SecurityFetch, mybabapk, mympk, myzpke } from "../../store";
    let makenickname:string

    async function createChar() {
        
        const data = {nickname: makenickname, mode: $modeinput || $mode}

        try{
        const response = await SecurityFetch("/connect/new", "POST", data)
        if (response.status===201){
            alert("캐릭터 생성에 성공했습니다!")
            form.set("none")
            if (data.mode==="babapk")
        {mybabapk.set(makenickname)}
        else if (data.mode==="mpk")
        {mympk.set(makenickname)}
        else if (data.mode==="zpke")
        {myzpke.set(makenickname)}
        }
        else if (response.status===409){
            alert("캐릭터 이름을 사용할 수 없습니다")
        } else if (response.status===403){
            alert("수정이 불가능합니다")
        }
        }
        catch (error)
        {alert("서버 에러입니다")}        
    }


</script>

<h3 class="message-title">{$modeinput} 캐릭터 생성하기</h3>

<div class="message-body">

<input class="input-text" bind:value={makenickname} type="text" placeholder="캐릭터 이름">
<button class="emphasis-button block" on:click={() => createChar()}>캐릭 생성</button>
</div>
<button class="simple-button block" on:click={() => form.set("add")}>캐릭 연동</button>
