<script lang="ts">
    import { useLocation } from "svelte-routing";
    import { mode } from "../store";
    
    const location = useLocation();
    let pathname = "";
    
    $: pathname = $location.pathname;

    let modestring : string = "";
    let titlestring : string = "";
    
    $: if (pathname.includes("rank")) {
        titlestring = "랭킹조회";
    }
    else if (pathname.includes("info")) {
        titlestring = "공지사항";
    }
    else if (pathname.includes("record")) {
        titlestring = "대전기록";
    }
    else if (pathname.includes("tournament")) {
        titlestring = "대회기록";
    }
    else if (pathname.includes("boardlist")) {
        titlestring = "커뮤니티";
    }
    else if (pathname.includes("winners")) {
        titlestring = "역대우승";
    }   
    else if (pathname.includes("calculator")) {
        titlestring = "계산하기";
    }
    else if (pathname.includes("admin")){
        titlestring = "관리설정";
    }
    else {
        titlestring = "";
    }

    $: if ($mode) {
        modestring = "밀리PK";
    }   
    else if (!$mode) {
        modestring = "정통바바";
    }   
    else {
        modestring = "";
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
