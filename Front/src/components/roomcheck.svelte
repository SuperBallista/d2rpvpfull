<script lang="ts">
    import { onMount } from "svelte";
    import { mode, myaccount, SecurityFetch, lang } from "../store";
    import { showMessageBox } from "../custom/customStore";

    interface Room {
        id: number;
        mode: string;
        created_at: Date;
        room_name: string;
        views: number;
    }
    let new_room: string;
    let new_password: string;

    let rooms: Room[] = [];

    interface member {
        account: string;
        babapk: string;
        mpk: string;
        zpke: string;
        ip_address: string;
        access_time: Date;
    }

    let list: member[];

    async function fetchData() {
        try {
            const response = await fetch("/rooms");
            if (!response.ok) throw new Error("데이터를 가져오는 데 실패했습니다.");
            const data = await response.json();

            // ✅ API 응답을 받을 때 created_at을 Date 객체로 변환
            rooms = data.map((room: any) => ({
                ...room,
                created_at: new Date(room.created_at),
            }));
        } catch (error) {
            console.error("데이터 로드 오류:", error);
        }
    }

    async function fetchNewRoom() {
        const data = { name: new_room, password: new_password, mode: $mode };
        try {
            const response = await SecurityFetch("/rooms/new", "POST", data);
            if (response.status === 201) {
                showMessageBox("success", $lang ? "등록 성공": "Success", $lang ? "방 등록에 성공하였습니다!" : "Room successfully created!")
                fetchData();
            } else if (response.status === 401) {
                showMessageBox("alert", $lang ? "권한 없음" : "No Permission", $lang ? "권한이 없습니다" : "You do not have permission.")
            } else{
                showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
            }
        } catch (error) {
            showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
        }
    }

    onMount(fetchData);

    async function view_room_password(id: number) {
        if (!$myaccount)
    {return}
        const userResponse = await showMessageBox("confirm",$lang?"조회 확인":"View Confirm",
        $lang?
        "해당 방의 암호를 조회하면 당신의 조회기록이 남습니다. 조회하시겠습니까?"
         : "Your access record will be saved when viewing the room password. Continue?")
        if (userResponse.success) {
            const data = { id };
            try {
                const response = await SecurityFetch("/rooms/password", "POST", data);
                const password = await response.json();
                if (response.status === 201) {
                    showMessageBox("alert", $lang ? "암호 확인": "Check Password", ($lang ? "암호는 다음과 같습니다: " : "The password is: ") + password.password)
                    // ✅ 새로운 배열을 재할당하여 반응형 업데이트 보장
                    rooms = rooms.map(room =>
                        room.id === id ? { ...room, views: room.views + 1 } : room
                    );
                } else if (response.status === 401) {
                    showMessageBox("alert", $lang ? "권한 없음" : "No Permission", $lang ? "권한이 없습니다" : "You do not have permission.")
                   }   else
                    {
                        showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
                    }
                
            } catch (error) {
                showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
            }
        }
    }

    async function views_account(id: number) {
        if (!$myaccount)
    {return}
        const data = { id };
        try {
            const response = await SecurityFetch("/rooms/views", "POST", data);
            const member: member[] = await response.json();
            if (response.status === 201) {
                showMessageBox("alert", $lang? "암호 조회자 확인": "Check Users", $lang ? "암호를 조회한 사람들의 정보를 봅니다" : "Viewing users who accessed the password.")

                // ✅ 새로운 배열로 업데이트하여 반응형 트리거
                list = member.map((ppl: any) => ({
                    ...ppl,
                    created_at: new Date(ppl.created_at),
                }));
            } else if (response.status === 401) {
                showMessageBox("alert", $lang ? "권한 없음" : "No Permission", $lang ? "권한이 없습니다" : "You do not have permission.")
            }
            else {
                showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${response.status}` : `Error: ${response.status}`)
            }
        } catch (error) {
            showMessageBox("error",$lang ? "에러 발생" : "Error", $lang? `에러 발생: ${error}` : `Error: ${error}`)
        }
    }

    function formatDateTime(date: any): string {
    if (!(date instanceof Date)) {
        date = new Date(date); // ✅ 문자열이면 Date 객체로 변환
    }
    const yy = String(date.getFullYear()).toString().slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return `${yy}/${mm}/${dd} ${hh}:${min}:${ss}`;
}

</script>

<table>
    <thead>
        <tr>
            <th>{ $lang ? "방 제목" : "Room Name" }</th>
            <th>{ $lang ? "게임모드" : "Game Mode" }</th>
            <th>{ $lang ? "생성시간" : "Created At" }</th>
            <th>{ $lang ? "조회수" : "Views" }</th>
        </tr>
    </thead>
    <tbody>
        {#if $myaccount}
        <tr>
            <td><input class="input-text" type="text" bind:value={new_room} placeholder={ $lang ? "새 방 이름 입력" : "Enter New Room Name" }></td>
            <td>{$mode}</td>
            <td><input class="input-text" type="password" bind:value={new_password} placeholder={ $lang ? "새 방 암호 입력" : "Enter New Room Password" }></td>
            <td><button class="emphasis-button" on:click={fetchNewRoom}>{ $lang ? "추가하기" : "Add" }</button></td>
        </tr>
        {/if}

        {#each list as ppl}
            <tr>
                <td colspan="4">
                    { $lang ? "계정" : "Account" }: {ppl.account} 
                    { $lang ? "아이피" : "IP Address" }: {ppl.ip_address}
                    <br/> 
                    { $lang ? "바바" : "Babapk" }: {ppl.babapk} 
                    { $lang ? "밀리" : "Mpk" }: {ppl.mpk} 
                    { $lang ? "질딘" : "Zpke" }: {ppl.zpke}
                    <br/> 
                    { $lang ? "엑세스시간" : "Access Time" }: {formatDateTime(ppl.access_time)} 
                </td>
            </tr>
        {/each}

        {#each rooms as room}
            <tr>
                <td class="pointer" on:click={() => view_room_password(room.id)}>{room.room_name}</td>
                <td>{room.mode}</td>
                <td>{formatDateTime(room.created_at)}</td>
                <td class="pointer" on:click={() => views_account(room.id)}>{room.views}</td>
            </tr>
        {/each}
    </tbody>
</table>

<style>
    .pointer {
        cursor: pointer;
    }
</style>
