<script lang="ts">
    import { mode, lang } from "../store";
    import {Link} from "svelte-routing";
    
    
    let list:any[]

    const mpklist = [
 {
    href: "/mpk/elo", title: $lang ? "Elo 점수 예상계산기" : "Elo Calculate"
    },
    {
    href: "/mpk/simul", title: $lang ? "시뮬레이터" : "Simulate"
    },
    {
    href: "/mpk/ring", title: $lang ?  "링 스탯 측정기" : "Check Ring Stats"
    }
    ]
    const babapklist = [
    {
    href: "/babapk/pscore", title: $lang ?  "파워점수 계산기" : "Power Score Calculate"
    },
    {
    href: "/babapk/visio", title: $lang ?  "렙당뚜껑 계산기" : "Visio Calculate"
    },
    {
    href: "/babapk/elo", title: $lang ? "Elo 점수 예상계산기" : "Elo Calculate"
    },
    {
    href: "/babapk/simul", title: $lang ? "시뮬레이터" : "Simulate"
    },
    {
    href: "/babapk/ring", title: $lang ? "링 스탯 측정기" : "Check Ring Stats"
    }
    ] 
    const zpkelist = [
    {
    href: "/zpke/pscore", title:  $lang ?  "파워점수 계산기" : "Power Score Calculate"
    },
    {
    href: "/zpke/elo", title: $lang ? "Elo 점수 예상계산기" : "Elo Calculate"
    },
    {
    href: "/zpke/simul", title: "시뮬레이터"
    },
    ]

if ($mode === "babapk")
{list = babapklist}
else if ($mode === "mpk")
{list = mpklist}
else
{list = zpkelist}

    
    </script>
    
    
    <div class="info-container">
    <table>
        <thead>
            <tr>
                <th>{$mode} {$lang ? "계산기 들어가기" : "Calculater Links(Korean)"}</th>
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