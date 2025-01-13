<script lang="ts">
    import { useLocation } from "svelte-routing";
    import { mode, lang } from "../store";
    
    const location = useLocation();
    let pathname = "";
    
    $: pathname = $location.pathname;

    let modestring : string = "";
    let titlestring : string = "";
    
    $: if (pathname.includes("rank")) {
        titlestring = $lang ? "랭킹조회" : "Ladder";
    }
    else if (pathname.includes("info")) {
        titlestring = $lang ? "공지사항" : "Notice";
    }
    else if (pathname.includes("record")) {
        titlestring = $lang ? "대전기록" : "Records";
    }
    else if (pathname.includes("tournament")) {
        titlestring = $lang ? "대회기록" : "Event";
    }
    else if (pathname.includes("boardlist")) {
        titlestring = $lang ? "커뮤니티" : "Community";
    }
    else if (pathname.includes("winners")) {
        titlestring = $lang ? "역대우승" : "Winners";
    }   
    else if (pathname.includes("calculator")) {
        titlestring = $lang ? "계산하기" : "Calculate";
    }
    else if (pathname.includes("admin")){
        titlestring = $lang ? "관리설정" : "Setting";
    }
    else {
        titlestring = "";
    }

    $: if ($mode === "mpk") {
        modestring = $lang ? "밀리PK" : "Melee PK";
    }   
    else if ($mode === "babapk") {
        modestring = $lang ? "정통바바" : "Barb PK";
    }   
    else if ($mode === "zpke"){
        modestring = $lang ? "질딘PK" : "Zeal PK";
    }
    else if ($mode === ""){
        modestring = ""
    }

    $: document.title = "D2RPvP " + modestring + " " + titlestring;


</script>
<style>
    .header-container {
        color: #f4f4f4;
        padding: 10px 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 65px;
    }
    .hidden{
        display: none;
    }
</style>



<div class="header-container {pathname.includes('post') || pathname.includes('write') ? 'hidden' : ''}">
    <h1>{modestring} {titlestring}</h1></div>
