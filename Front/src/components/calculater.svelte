<script lang="ts">
    import { mode } from "../store";
    import {Link} from "svelte-routing";
    
    
    const list  = $mode?[
    {
    href: "/mpk/pscore", title: "질딘 파워점수 계산기"
    },
    {
    href: "/mpk/ring", title: "링 스탯 측정기"
    },  {
    href: "/mpk/elo", title: "Elo 점수 예상계산기"
    },
    {
    href: "/mpk/simul", title: "시뮬레이터"
    }
    ]  : [
    {
    href: "/babapk/pscore", title: "파워점수 계산기"
    },
    {
    href: "/babapk/visio", title: "렙당뚜껑 계산기"
    },
    {
    href: "/babapk/simul", title: "시뮬레이터"
    },  {
    href: "/babapk/ring", title: "링 스탯 측정기"
    }
    ] 
    
    </script>
    
    
    <div class="info-container">
    <table>
        <thead>
            <tr>
                <th>{$mode ? "밀리PK" : "정통바바"}계산기 들어가기</th>
            </tr>
        </thead>
        <tbody>
            {#each list as list}
            <tr>
                <td><Link to={list.href}>{list.title}</Link></td>
            </tr>
            {/each}
        </tbody>
    </table>
    </div>
    
    <style>
    table tr th, table tr td{
        text-align: left;
        width: 100%;
    }
    
    </style>