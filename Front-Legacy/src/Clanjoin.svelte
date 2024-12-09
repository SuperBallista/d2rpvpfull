<script>
    import { clickformopen, fetechClanList, clanlists, SecurityFetch } from "./store.js";
    import { onMount } from "svelte";

    let clan = "none";

    onMount(async () => {
        await fetechClanList();
    });


    async function clanjoin() {
    try {
        // 데이터 유효성 검증 (필요한 경우)
        if (clan === "none") {
            alert("클랜을 선택해 주세요.");
            return;
        }
        const data = { clanname: clan };
        
        const response = await SecurityFetch('/clan/join', "POST",data);

        if (response.ok) {
            alert("클랜 가입 완료");
            clickformopen(null);
        } else {
            const errorData = await response.json(); // 서버로부터 에러 메시지를 받는 경우
            alert(`오류 발생: ${response.status}, 메시지: ${errorData.message || '서버 오류'}`);
        }
    } catch (error) {
        alert(`클랜 가입 중 오류가 발생했습니다: ${error.message}`);
    }
}

</script>

<div class="left">
    <select class="namewidth" bind:value={clan}>
        <option value="none">클랜 선택</option>
        {#each $clanlists as list}
            <option value={list}>{list}</option>
        {/each}
    </select>

    <button on:click={() => clanjoin()}>가입하기</button>
</div>
