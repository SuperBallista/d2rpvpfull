<script lang="ts">
import { mode, lang } from "../store";

type InfoList = { title: string; href: string;}    

let list: InfoList[] = [];

if ($mode === "mpk") {

    list = [
{
    href: "https://docs.google.com/spreadsheets/d/18jJ3WYsWZEdV8oXeJYt1-aMrACN1IHsFnCV3-gir5pk/", title: "후원 내역 및 후원 랭킹 보기"
},
{
href: "https://docs.google.com/document/d/12jpQH4QP7QyPRhLPuXJSuU3lJdA_3SzCE5dBYl2jYZg/", title: "듀얼 규칙 안내"
},
{
href: "https://docs.google.com/document/d/1Wj31FLkeFLZp-N2Bohkj_ZKoUrJU5LXkUABH7x9zxC8/", title: "대회 및 랭킹 시스템 안내"
}
] 

}
else if ($mode === "babapk")
{
list = [ {
    href: "https://docs.google.com/spreadsheets/d/19a-_44yVj04BnlUK6QQY9U3jXtlDAgOmdHCgdis1toI/", title: "후원 내역 및 후원 랭킹 보기"
},
{
    href: "https://docs.google.com/document/d/12EBBA8c9K-KzaE-cC6QvRb8vOB07V9Mi90D44-dzOPw/", title: "인게임 방 안내"
},
{
href: "https://docs.google.com/document/d/1b-vnUyLaDrSnSMouTOoFAYz5K3lq8hS-kzjh_R-JuD8/", title: "월별 랭킹 시스템 안내(with 클랜전)"
},
{
href: "https://docs.google.com/document/d/1RBDp8SzVp-epjIdekWOWPYt0f6XBpreVbQnPD1qv3-o/", title: "미니대회 운영 안내"
},
{
href: "https://docs.google.com/document/d/1m50GKaWyszyBSslQn3348Fz1CAp55DFbKNwNyj5dLnw/", title: "내부 랭킹전 안내"
}
]
}
else {
list = [
{href: "https://docs.google.com/document/d/1FFuQPQYJJKBcpKM5VaBijzsf1Zg-bW1iy9R8vM9OPkA/", title: "질딘PK 공지사항"}

]

}


</script>


<div class="info-container">
<table>
    <thead>
        <tr>
            <th>{$lang ? "공지사항 들어가기(구글 문서)" : "Notice(Google Doc, Korean)"}</th>
        </tr>
    </thead>
    <tbody>
        {#each list as list}
        <tr>
            <td><a href={list.href}>{list.title}</a></td>
        </tr>
        {/each}
    </tbody>
</table>
</div>

<style>
 tr th, tr td{
    text-align: left;
    width: 100%;
}


</style>