<script lang="ts">
    import { onMount } from "svelte";
    import { nicknames, fetchNicknames, mode } from "../../store";

    interface Member {
        nickname: string;
        result: number;
        order: number;
    }

    interface Round {
        roundIndex: number;
        matches: string[];
    }

    function combineGroups(groupedNicknames: string[][], teamSize: number): string[] {
        let combinedGroups: string[] = [];
        let tempGroup: string[] = [];

        groupedNicknames.forEach((group) => {
            if (Array.isArray(group)) {
                tempGroup.push(...group);
            } else {
                tempGroup.push(group);
            }

            while (tempGroup.length >= teamSize) {
                combinedGroups.push(tempGroup.splice(0, teamSize).join(" & "));
            }
        });

        if (tempGroup.length > 0) {
            combinedGroups.push(tempGroup.join(" & "));
        }

        return combinedGroups;
    }

    onMount(async () => {
        await fetchNicknames($mode);
    });

    let rounds: Round[] = [];
    let joined_member: number = 8;
    let teamSize: number = 1;
    let teamNumber: number | undefined;
    let pre_game: number | undefined;
    let main_game: number | undefined;
    let memberNickname: string[] = Array(joined_member).fill("");
    let memberResults: number[] = Array(joined_member).fill(0);
    let show: boolean = false;
    let groupedNicknames: string[][] | string[] = [];
    let hasDuplicates: boolean = false;
    let objectsArray: Member[] = [];
    let clicked: boolean = false;
    const main_game_player: any[] = [];
    const pre_game_player: string[] = [];
    let filteredNicknames: string[] = [];

    function shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function handle_memberNickname(event: Event, index: number): void {
        const target = event.target as HTMLInputElement;
        memberNickname[index] = target.value;
        filterNicknames(target.value);
    }

    function handle_joined_member(event: Event): void {
        const target = event.target as HTMLInputElement;
        joined_member = Number(target.value);
        memberNickname = Array(joined_member).fill("");
        memberResults = Array(joined_member).fill(0);
    }

    function input_number(): void {
        if (joined_member % teamSize === 0) {
            teamNumber = joined_member / teamSize;
            pre_game = 2 * (teamNumber - 2 ** Math.floor(Math.log2(teamNumber)));
            main_game = teamNumber - pre_game;
            show = true;
        } else {
            alert("전체 인원이 팀 인원으로 나누어 떨어지지 않습니다");
        }
    }

    function checkForDuplicates(): void {
        const counts: Record<string, number> = {};
        hasDuplicates = false;

        for (const name of memberNickname) {
            if (counts[name]) {
                hasDuplicates = true;
                break;
            }
            counts[name] = 1;
        }
    }

    async function updateObjectsArray(): Promise<void> {
        checkForDuplicates();

        if (hasDuplicates) {
            alert("중복 입력된 선수가 있습니다");
        } else {
            clicked = true;

            if (teamSize === 1) {
                try {
                    const rankendpoint = $mode ? "/rank/m-user" : "/rank/b-user";
                    const response = await fetch(rankendpoint);

                    if (response.status === 200) {
                        const data = await response.json();
                        const nicknamelist: string[] = data.nicknamelist;
                        const rank: number[] = data.rank;

                        for (let i = 0; i < teamNumber!; i++) {
                            for (let ii = 0; ii < nicknamelist.length; ii++) {
                                if (memberNickname[i] === nicknamelist[ii]) {
                                    memberResults[i] = rank[ii];
                                }
                            }
                        }
                    }

                    objectsArray = Array.from({ length: joined_member }, (_, index) => ({
                        nickname: memberNickname[index],
                        result: memberResults[index],
                        order: Math.random(),
                    }));

                    objectsArray.sort((a, b) => a.result - b.result);

                    for (let i = 0; i < main_game!; i++) {
                        main_game_player.push(objectsArray[i].nickname);
                    }

                    for (let i = main_game!; i < main_game! + pre_game!; i++) {
                        pre_game_player.push(objectsArray[i].nickname);
                    }

                    rounds = generateRounds();
                } catch (error) {
                    alert("성적을 불러오지 못했습니다");
                }
            } else {
                objectsArray = Array.from({ length: joined_member }, (_, index) => ({
                    nickname: memberNickname[index],
                    result: memberResults[index],
                    order: Math.random(),
                }));

                rounds = updateGroupedNicknames();
            }
        }
    }

    function createGameArray(n: number): string[] {
        const numberOfItems = Math.floor(n / 2);
        return Array(numberOfItems).fill(`${n}강 경기`);
    }

    function updateGroupedNicknames(): Round[] {
        groupedNicknames = division(shuffleArray(objectsArray.map((obj) => obj.nickname)), teamSize);
        groupedNicknames = combineGroups(groupedNicknames, teamSize);

        const newRounds: Round[] = [
            { roundIndex: 1, matches: groupedNicknames },
        ];

        for (let n = teamNumber!; n >= 4; n /= 2) {
            newRounds.push({ roundIndex: newRounds.length + 1, matches: createGameArray(n) });
        }

        newRounds.push({ roundIndex: newRounds.length + 1, matches: ["결승 경기"] });
        return newRounds;
    }

    function division(nicknamearray: string[], teamSize: number): string[][] {
        const length = nicknamearray.length;
        const divide = Math.floor(length / teamSize) - 1;
        const newArray: string[][] = [];

        for (let i = 0; i <= divide; i++) {
            newArray.push(nicknamearray.splice(0, teamSize));
        }

        return newArray;
    }

    function generateRounds(): Round[] {
        const pre_matches_group = division(pre_game_player, 2);
        main_game_player.push(...pre_matches_group);

        let playorder = shuffleArray([...main_game_player]);
        playorder = playorder.map((group) =>
            Array.isArray(group) ? `${group[0]} vs ${group[1]}` : group
        );

        const newRounds: Round[] = [
            { roundIndex: 1, matches: playorder },
        ];

        for (let n = playorder.length; n >= 4; n /= 2) {
            newRounds.push({ roundIndex: newRounds.length + 1, matches: createGameArray(n) });
        }

        newRounds.push({ roundIndex: newRounds.length + 1, matches: ["결승 경기"] });
        return newRounds;
    }

    function filterNicknames(input: string): void {
    if (input === "") {
        filteredNicknames = $nicknames;
    } else {
        filteredNicknames = $nicknames.filter((name:string) =>
            name.toLowerCase().includes(input.toLowerCase())
        );
    }
}

</script>

<table>
    <thead>
        <tr>
            <th colspan="4">토너먼트 대진표 생성기</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td colspan="2">참가인원 :</td>
            <td colspan="2">
                <input class="input-text short"
                    type="number"
                    bind:value={joined_member}
                    on:input={handle_joined_member}
                    readonly={show}
                />
            </td>
        </tr>
        <tr>
            <td colspan="2">팀당 인원 :</td>
            <td colspan="2">
                <select class="input-text name" bind:value={teamSize} disabled={show}>
                    <option value={1}>개인전</option>
                    <option value={2}>2인 1팀</option>
                    <option value={3}>3인 1팀</option>
                    <option value={4}>4인 1팀</option>
                </select>
            </td>
        </tr>
        <tr>
            <td colspan="4">
                <button class="simple-button" on:click={input_number} disabled={show}>인원 세팅</button>
            </td>
        </tr>
    </tbody>
    {#if show}
    <tbody>
        {#each Array(Math.ceil(joined_member / 4)) as _, rowIndex}
        <tr>
          {#each Array(4) as _, colIndex}
            {#if rowIndex * 4 + colIndex < joined_member}
              <td>
                <input
                  class="name input-text"
                  type="text"
                  bind:value={memberNickname[rowIndex * 4 + colIndex]}
                  on:input={(event) => handle_memberNickname(event, rowIndex * 4 + colIndex)}
                  list={`nicknames_list_${rowIndex * 4 + colIndex}`}
                  placeholder="닉네임 입력"
                />
                <datalist id={`nicknames_list_${rowIndex * 4 + colIndex}`}>
                  {#each filteredNicknames as option}
                    <option value={option}>{option}</option>
                  {/each}
                </datalist>
              </td>
            {:else}
              <td></td>
            {/if}
          {/each}
        </tr>
      {/each}
              <tr>
            <td colspan="4">
                <button class="simple-button" disabled={clicked} on:click={updateObjectsArray}>대진표 생성</button>
            </td>
        </tr>
    </tbody>
    {/if}
    <tbody>
        {#each rounds as round}
        <tr>
            <td colspan="3">Round {round.roundIndex}</td>
        </tr>
        {#each round.matches as match}
        <tr>
            <td colspan="3">{match}</td>
        </tr>
        {/each}
        {/each}
    </tbody>
</table>

<style>
.short{
    width: 80px;
}
.name{
    width: 140px;
}
input, button{
padding: 3px;
}
</style>