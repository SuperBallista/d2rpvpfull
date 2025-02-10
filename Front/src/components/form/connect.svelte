<script lang="ts">
    import { showMessageBox } from "../../custom/customStore";
    import { form, modeinput, mode, SecurityFetch, mybabapk, mympk, myzpke, lang } from "../../store";
    let makenickname:string

    async function createChar() {
        
        const data = {nickname: makenickname, mode: $modeinput || $mode}
        const nicknameRegex = /^[\u4E00-\u9FFF\u3400-\u4DBF\u20000-\u2EBFF\u2E80-\u2EFF\u2F00-\u2FDF\u3007\uAC00-\uD7A3a-zA-Z]{2,20}$/;
        if (!nicknameRegex.test(makenickname)) {
            showMessageBox("alert", $lang? "닉네임 오류":"Input Error", $lang ? "캐릭터 닉네임을 바르게 지어주세요! 닉네임은 한글, 영어, 한자만 가능합니다" : "Please create a proper character nickname! Nicknames can only contain Korean, English, or Chinese characters.");
         } else {
        try{
        const response = await SecurityFetch("/connect/new", "POST", data)
        if (response.status===201){
            showMessageBox("success", $lang ? "생성 성공": "Success", $lang ? "캐릭터 생성에 성공했습니다!" : "Registered Success")
            form.set("none")
            if (data.mode==="babapk")
        {mybabapk.set(makenickname)}
        else if (data.mode==="mpk")
        {mympk.set(makenickname)}
        else if (data.mode==="zpke")
        {myzpke.set(makenickname)}
        }
        else if (response.status===409){
            showMessageBox("alert", $lang ? "사용 불가": "Alert", $lang ? "캐릭터 이름을 사용할 수 없습니다" : "You can't use this name")
        } else {
            showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
        }
        }
        catch (error)
        {        showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
    }        
    }
}

</script>

<h3 class="message-title">{$modeinput} {$lang ? "캐릭터 생성하기" : "Character Register"}</h3>

<div class="message-body">

<input class="input-text" autofocus bind:value={makenickname} type="text" placeholder={$lang ? "캐릭터 이름" : "Character Name"}>
<button class="emphasis-button block" on:click={() => createChar()}>{$lang ? "캐릭 생성" : "Create Character"}</button>
</div>
<button class="simple-button block" on:click={() => form.set("add")}>{$lang ? "캐릭 연동" : "Connect Legacy Character"}</button>
