<script>

  let clickok = true;
  let my_head_def = 0;
  let my_head_ar = 0;
  let my_head_arpercent = 99;
  let my_head_stat = 0;
  let my_head_vital = 0;
  let my_head_life = 0;
  let my_head_lvperlife = 0;
  let my_head_min = 0;
  let my_head_max = 0;
  let my_head_dmg = 0;
  let my_head_edmg = 40;

  let my_body_def = 1908;
  let my_body_ar = 0;
  let my_body_arpercent = 0;
  let my_body_stat = 0;
  let my_body_vital = 0;
  let my_body_life = 0;
  let my_body_lvperlife = 148;
  let my_body_min = 0;
  let my_body_max = 0;
  let my_body_dmg = 0;
  let my_body_edmg = 300;

  let my_weap_def = 0;
  let my_weap_ar = 3;
  let my_weap_arpercent = 0;
  let my_weap_stat = 0;
  let my_weap_vital = 0;
  let my_weap_life = 0;
  let my_weap_lvperlife = 0;
  let my_weap_min = 27;
  let my_weap_max = 81;
  let my_weap_dmg = 400;
  let my_weap_edmg = 0;

  let my_sheild_def = 519;
  let my_sheild_ar = 0;
  let my_sheild_arpercent = 0;
  let my_sheild_stat = 30;
  let my_sheild_vital = 0;
  let my_sheild_life = 0;
  let my_sheild_lvperlife = 0;
  let my_sheild_min = 0;
  let my_sheild_max = 0;
  let my_sheild_dmg = 0;
  let my_sheild_edmg = 40;

  let my_belt_def = 158;
  let my_belt_ar = 0;
  let my_belt_arpercent = 0;
  let my_belt_stat = 0;
  let my_belt_vital = 40;
  let my_belt_life = 0;
  let my_belt_lvperlife = 0;
  let my_belt_min = 0;
  let my_belt_max = 0;
  let my_belt_dmg = 0;
  let my_belt_edmg = 0;

  let my_gloves_def = 281;
  let my_gloves_ar = 0;
  let my_gloves_arpercent = 0;
  let my_gloves_stat = 20;
  let my_gloves_vital = 0;
  let my_gloves_life = 0;
  let my_gloves_lvperlife = 0;
  let my_gloves_min = 0;
  let my_gloves_max = 0;
  let my_gloves_dmg = 0;
  let my_gloves_edmg = 60;

  let my_boots_def = 213;
  let my_boots_ar = 0;
  let my_boots_arpercent = 0;
  let my_boots_stat = 0;
  let my_boots_vital = 0;
  let my_boots_life = 0;
  let my_boots_lvperlife = 0;
  let my_boots_min = 0;
  let my_boots_max = 0;
  let my_boots_dmg = 0;
  let my_boots_edmg = 0;

  let my_ringamul_def = 0;
  let my_ringamul_ar = 2376;
  let my_ringamul_arpercent = 0;
  let my_ringamul_stat = 10;
  let my_ringamul_vital = 0;
  let my_ringamul_life = 115;
  let my_ringamul_lvperlife = 0;
  let my_ringamul_min = 0;
  let my_ringamul_max = 0;
  let my_ringamul_dmg = 0;
  let my_ringamul_edmg = 0;

  let my_tourchani_vital = 40;
  let my_tourchani_stat = 80;

  let quanitity1 = 37;
  let quanitity2 = 0;
  let quanitity3 = 0;
  let quanitity4 = 0;

  let max1 = 3;
  let max2 = 0;
  let max3 = 0;
  let max4 = 10;

  let ar1 = 20;
  let ar2 = 36;
  let ar3 = 0;
  let ar4 = 76;

  let def1 = 0;
  let def2 = 0;
  let def3 = 30;
  let def4 = 0;

  let life1 = 20;
  let life2 = 20;
  let life3 = 20;
  let life4 = 45;

  let my_skill = 6;
  let my_combat = 0;
  let my_warcries = 0;
  let my_masteries = 0;
  let my_shoutiron = 0;
  let my_order = 0;

  let my_lv = 99;
  let my_frame = 4;
  let my_defoff = 25;
  let my_reduce = 50;
  let my_crush = 25;
  let my_ds = 35;
  let my_cs = 31;
  let my_wound = 10;

  let my_totallife = 0;
  let my_totalmax = 0;
  let my_totalmin = 0;
  let my_totalar = 0;
  let my_totaldef = 0;

  let my_str = 232;
  let my_dex = 222;

  const saveData = (filename, data) => {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename;
    link.href = url;
    link.click();
  };

  const loadData = (event, setData) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedJson = JSON.parse(event.target.result);
        setData(parsedJson);
      } catch (error) {
        alert("당신의 Json 파일이 손상되었습니다");
      }
    };
    reader.readAsText(file);
  };

  const saveMyHead = () => {
    const formData = {
      def: my_head_def,
      ar: my_head_ar,
      arpercent: my_head_arpercent,
      stat: my_head_stat,
      vital: my_head_vital,
      life: my_head_life,
      lvperlife: my_head_lvperlife,
      min: my_head_min,
      max: my_head_max,
      dmg: my_head_dmg,
      edmg: my_head_edmg,
    };
    saveData("투구수치.json", formData);
  };

  const saveMyBody = () => {
    const formData = {
      def: my_body_def,
      ar: my_body_ar,
      arpercent: my_body_arpercent,
      stat: my_body_stat,
      vital: my_body_vital,
      life: my_body_life,
      lvperlife: my_body_lvperlife,
      min: my_body_min,
      max: my_body_max,
      dmg: my_body_dmg,
      edmg: my_body_edmg,
    };
    saveData("갑옷수치.json", formData);
  };

  const saveMyWeap = () => {
    const formData = {
      def: my_weap_def,
      ar: my_weap_ar,
      arpercent: my_weap_arpercent,
      stat: my_weap_stat,
      vital: my_weap_vital,
      life: my_weap_life,
      lvperlife: my_weap_lvperlife,
      min: my_weap_min,
      max: my_weap_max,
      dmg: my_weap_dmg,
      edmg: my_weap_edmg,
    };
    saveData("무기수치.json", formData);
  };

  const saveMySheild = () => {
    const formData = {
      def: my_sheild_def,
      ar: my_sheild_ar,
      arpercent: my_sheild_arpercent,
      stat: my_sheild_stat,
      vital: my_sheild_vital,
      life: my_sheild_life,
      lvperlife: my_sheild_lvperlife,
      min: my_sheild_min,
      max: my_sheild_max,
      dmg: my_sheild_dmg,
      edmg: my_sheild_edmg,
    };
    saveData("방패수치.json", formData);
  };

  const saveMyBelt = () => {
    const formData = {
      def: my_belt_def,
      ar: my_belt_ar,
      arpercent: my_belt_arpercent,
      stat: my_belt_stat,
      vital: my_belt_vital,
      life: my_belt_life,
      lvperlife: my_belt_lvperlife,
      min: my_belt_min,
      max: my_belt_max,
      dmg: my_belt_dmg,
      edmg: my_belt_edmg,
    };
    saveData("벨트수치.json", formData);
  };

  const saveMyGloves = () => {
    const formData = {
      def: my_gloves_def,
      ar: my_gloves_ar,
      arpercent: my_gloves_arpercent,
      stat: my_gloves_stat,
      vital: my_gloves_vital,
      life: my_gloves_life,
      lvperlife: my_gloves_lvperlife,
      min: my_gloves_min,
      max: my_gloves_max,
      dmg: my_gloves_dmg,
      edmg: my_gloves_edmg,
    };
    saveData("장갑수치.json", formData);
  };

  const saveMyBoots = () => {
    const formData = {
      def: my_boots_def,
      ar: my_boots_ar,
      arpercent: my_boots_arpercent,
      stat: my_boots_stat,
      vital: my_boots_vital,
      life: my_boots_life,
      lvperlife: my_boots_lvperlife,
      min: my_boots_min,
      max: my_boots_max,
      dmg: my_boots_dmg,
      edmg: my_boots_edmg,
    };
    saveData("부츠수치.json", formData);
  };

  const saveMyRingamul = () => {
    const formData = {
      def: my_ringamul_def,
      ar: my_ringamul_ar,
      arpercent: my_ringamul_arpercent,
      stat: my_ringamul_stat,
      vital: my_ringamul_vital,
      life: my_ringamul_life,
      lvperlife: my_ringamul_lvperlife,
      min: my_ringamul_min,
      max: my_ringamul_max,
      dmg: my_ringamul_dmg,
      edmg: my_ringamul_edmg,
    };
    saveData("장신구수치.json", formData);
  };

  const saveMyChar = () => {
    const formData = {
      charlv: my_lv,
      hp: my_totallife,
      maxdmg: my_totalmax,
      mindmg: my_totalmin,
      ar: my_totalar,
      df: my_totaldef,
      frame: my_frame,
      dfoff: my_defoff,
      reduce: my_reduce,
      crush: my_crush,
      cs: my_cs,
      ds: my_ds,
      dodge: 0,
      openwound: my_wound,
      thorns: 0,
      class: 2,
    };
    saveData("내정통바바스탯.json", formData);
  };

  const checkMyStat = () => {
    let my_sum_def =
      my_belt_def +
      my_head_def +
      my_body_def +
      my_weap_def +
      my_sheild_def +
      my_gloves_def +
      my_boots_def +
      my_ringamul_def +
      def1 * quanitity1 +
      def2 * quanitity2 +
      def3 * quanitity3 +
      def4 * quanitity4;
    let my_sum_ar =
      my_belt_ar +
      my_head_ar +
      my_body_ar +
      my_weap_ar +
      my_sheild_ar +
      my_gloves_ar +
      my_boots_ar +
      my_ringamul_ar +
      ar1 * quanitity1 +
      ar2 * quanitity2 +
      ar3 * quanitity3 +
      ar4 * quanitity4;
    let my_sum_arpercent =
      my_belt_arpercent +
      my_head_arpercent +
      my_body_arpercent +
      my_weap_arpercent +
      my_sheild_arpercent +
      my_gloves_arpercent +
      my_boots_arpercent +
      my_ringamul_arpercent;
    let my_sum_stat =
      my_belt_stat +
      my_head_stat +
      my_body_stat +
      my_weap_stat +
      my_sheild_stat +
      my_gloves_stat +
      my_boots_stat +
      my_ringamul_stat +
      my_tourchani_stat;
    let my_sum_vital =
      my_belt_vital +
      my_head_vital +
      my_body_vital +
      my_weap_vital +
      my_sheild_vital +
      my_gloves_vital +
      my_boots_vital +
      my_ringamul_vital +
      my_tourchani_vital;
    let my_sum_life =
      my_belt_life +
      my_head_life +
      my_body_life +
      my_weap_life +
      my_sheild_life +
      my_gloves_life +
      my_boots_life +
      my_ringamul_life +
      life1 * quanitity1 +
      life2 * quanitity2 +
      life3 * quanitity3 +
      life4 * quanitity4;
    let my_sum_lvperlife =
      my_belt_lvperlife +
      my_head_lvperlife +
      my_body_lvperlife +
      my_weap_lvperlife +
      my_sheild_lvperlife +
      my_gloves_lvperlife +
      my_boots_lvperlife +
      my_ringamul_lvperlife;
    let my_sum_min =
      my_belt_min +
      my_head_min +
      my_body_min +
      my_weap_min +
      my_sheild_min +
      my_gloves_min +
      my_boots_min +
      my_ringamul_min;
    let my_sum_max =
      my_belt_max +
      my_head_max +
      my_body_max +
      my_weap_max +
      my_sheild_max +
      my_gloves_max +
      my_boots_max +
      my_ringamul_max +
      max1 * quanitity1 +
      max2 * quanitity2 +
      max3 * quanitity3 +
      max4 * quanitity4;
    let my_sum_dmg =
      my_belt_dmg +
      my_head_dmg +
      my_body_dmg +
      my_weap_dmg +
      my_sheild_dmg +
      my_gloves_dmg +
      my_boots_dmg +
      my_ringamul_dmg;
    let my_sum_edmg =
      my_belt_edmg +
      my_head_edmg +
      my_body_edmg +
      my_weap_edmg +
      my_sheild_edmg +
      my_gloves_edmg +
      my_boots_edmg +
      my_ringamul_edmg;
    let my_totalvital =
      505 - (99 - my_lv) * 5 - my_str - my_dex + 30 + 20 + 25 + my_sum_stat;

    my_totalmin = Math.floor(
      ((my_sum_min + my_sum_dmg) *
        (100 +
          my_sum_edmg +
          128 +
          130 +
          10 * my_skill +
          my_combat * 5 +
          my_masteries * 5 +
          my_str)) /
        100
    );
    my_totalmax = Math.floor(
      ((my_sum_max + my_sum_dmg) *
        (100 +
          my_sum_edmg +
          128 +
          130 +
          10 * my_skill +
          my_combat * 5 +
          my_masteries * 5 +
          my_str)) /
        100
    );
    my_totalar = Math.floor(
      ((my_dex * 5 - 15 + my_sum_ar) *
        (100 +
          my_sum_arpercent +
          248 +
          180 +
          13 * my_skill -
          13 * 6 +
          my_combat * 5 +
          my_masteries * 8)) /
        100
    );
    my_totaldef = Math.floor(
      ((my_sum_def + Math.floor(my_dex / 4)) *
        (100 +
          420 +
          290 +
          20 * my_skill -
          120 +
          my_shoutiron * 10 +
          my_masteries * 10 +
          my_warcries * 10)) /
        100
    );
    my_totallife =
      Math.floor(
        ((55 + my_lv * 2 - 2 + my_totalvital * 4 - 25 * 4 + 60 + my_sum_life) *
          (100 + 113 + (my_skill + my_warcries + my_order) * 3)) /
          100
      ) +
      my_sum_lvperlife +
      my_sum_vital * 4;

    clickok = false;
  };
</script>
<svelte:head>
    <title>babapk 장비 스탯 구하기</title>
</svelte:head>



<div class="main_data">
  <div class="headline">장비 스탯 구하기</div>
  <div class="table-outline font15">
    <div class="table-head">
      <div class="margin10px">나의 장비 수치 입력</div>
    </div>
    <table class="width100">
      <tr class="black">
        <th>장비</th>
        <th>방어</th>
        <th>어레+</th>
        <th>어레%</th>
        <th>힘/민첩</th>
        <th>활력</th>
        <th>피</th>
        <th>렙당피</th>
        <th>민뎀</th>
        <th>맥뎀</th>
        <th>추뎀</th>
        <th>증뎀</th>
        <th>저장/열기</th>
      </tr>
      <tbody>
        <tr>
          <td>투구</td>
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_head_def}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_head_ar}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_head_arpercent}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_head_stat}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_head_vital}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_head_life}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_head_lvperlife}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_head_min}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_head_max}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_head_dmg}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_head_edmg}
            /></td
          >
          <td>
            <button on:click={saveMyHead}>저장</button>
            <input
              type="file"
              id="myheadfileUpload"
              style="display: none;"
              on:change={(event) =>
                loadData(event, (data) => {
                  my_head_def = data.def;
                  my_head_ar = data.ar;
                  my_head_arpercent = data.arpercent;
                  my_head_stat = data.stat;
                  my_head_vital = data.vital;
                  my_head_life = data.life;
                  my_head_lvperlife = data.lvperlife;
                  my_head_min = data.min;
                  my_head_max = data.max;
                  my_head_dmg = data.dmg;
                  my_head_edmg = data.edmg;
                })}
              accept="application/json"
            />
            <label class="button" for="myheadfileUpload">열기</label>
          </td>
        </tr>

        <tr>
          <td>갑옷</td>
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_body_def}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_body_ar}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_body_arpercent}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_body_stat}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_body_vital}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_body_life}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_body_lvperlife}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_body_min}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_body_max}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_body_dmg}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_body_edmg}
            /></td
          >
          <td>
            <button on:click={saveMyBody}>저장</button>
            <input
              type="file"
              id="mybodyfileUpload"
              style="display: none;"
              on:change={(event) =>
                loadData(event, (data) => {
                  my_body_def = data.def;
                  my_body_ar = data.ar;
                  my_body_arpercent = data.arpercent;
                  my_body_stat = data.stat;
                  my_body_vital = data.vital;
                  my_body_life = data.life;
                  my_body_lvperlife = data.lvperlife;
                  my_body_min = data.min;
                  my_body_max = data.max;
                  my_body_dmg = data.dmg;
                  my_body_edmg = data.edmg;
                })}
              accept="application/json"
            />
            <label class="button" for="mybodyfileUpload">열기</label>
          </td>
        </tr>

        <tr>
          <td>무기</td>
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_weap_def}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_weap_ar}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_weap_arpercent}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_weap_stat}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_weap_vital}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_weap_life}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_weap_lvperlife}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_weap_min}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_weap_max}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_weap_dmg}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_weap_edmg}
            /></td
          >
          <td>
            <button on:click={saveMyWeap}>저장</button>
            <input
              type="file"
              id="myweapfileUpload"
              style="display: none;"
              on:change={(event) =>
                loadData(event, (data) => {
                  my_weap_def = data.def;
                  my_weap_ar = data.ar;
                  my_weap_arpercent = data.arpercent;
                  my_weap_stat = data.stat;
                  my_weap_vital = data.vital;
                  my_weap_life = data.life;
                  my_weap_lvperlife = data.lvperlife;
                  my_weap_min = data.min;
                  my_weap_max = data.max;
                  my_weap_dmg = data.dmg;
                  my_weap_edmg = data.edmg;
                })}
              accept="application/json"
            />
            <label class="button" for="myweapfileUpload">열기</label>
          </td>
        </tr>

        <tr>
          <td>방패</td>
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_sheild_def}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_sheild_ar}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_sheild_arpercent}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_sheild_stat}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_sheild_vital}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_sheild_life}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_sheild_lvperlife}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_sheild_min}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_sheild_max}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_sheild_dmg}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_sheild_edmg}
            /></td
          >
          <td>
            <button on:click={saveMySheild}>저장</button>
            <input
              type="file"
              id="mysheildfileUpload"
              style="display: none;"
              on:change={(event) =>
                loadData(event, (data) => {
                  my_sheild_def = data.def;
                  my_sheild_ar = data.ar;
                  my_sheild_arpercent = data.arpercent;
                  my_sheild_stat = data.stat;
                  my_sheild_vital = data.vital;
                  my_sheild_life = data.life;
                  my_sheild_lvperlife = data.lvperlife;
                  my_sheild_min = data.min;
                  my_sheild_max = data.max;
                  my_sheild_dmg = data.dmg;
                  my_sheild_edmg = data.edmg;
                })}
              accept="application/json"
            />
            <label class="button" for="mysheildfileUpload">열기</label>
          </td>
        </tr>

        <tr>
          <td>벨트</td>
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_belt_def}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_belt_ar}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_belt_arpercent}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_belt_stat}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_belt_vital}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_belt_life}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_belt_lvperlife}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_belt_min}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_belt_max}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_belt_dmg}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_belt_edmg}
            /></td
          >
          <td>
            <button on:click={saveMyBelt}>저장</button>
            <input
              type="file"
              id="mybeltfileUpload"
              style="display: none;"
              on:change={(event) =>
                loadData(event, (data) => {
                  my_belt_def = data.def;
                  my_belt_ar = data.ar;
                  my_belt_arpercent = data.arpercent;
                  my_belt_stat = data.stat;
                  my_belt_vital = data.vital;
                  my_belt_life = data.life;
                  my_belt_lvperlife = data.lvperlife;
                  my_belt_min = data.min;
                  my_belt_max = data.max;
                  my_belt_dmg = data.dmg;
                  my_belt_edmg = data.edmg;
                })}
              accept="application/json"
            />
            <label class="button" for="mybeltfileUpload">열기</label>
          </td>
        </tr>

        <tr>
          <td>장갑</td>
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_gloves_def}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_gloves_ar}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_gloves_arpercent}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_gloves_stat}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_gloves_vital}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_gloves_life}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_gloves_lvperlife}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_gloves_min}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_gloves_max}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_gloves_dmg}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_gloves_edmg}
            /></td
          >
          <td>
            <button on:click={saveMyGloves}>저장</button>
            <input
              type="file"
              id="myglovesfileUpload"
              style="display: none;"
              on:change={(event) =>
                loadData(event, (data) => {
                  my_gloves_def = data.def;
                  my_gloves_ar = data.ar;
                  my_gloves_arpercent = data.arpercent;
                  my_gloves_stat = data.stat;
                  my_gloves_vital = data.vital;
                  my_gloves_life = data.life;
                  my_gloves_lvperlife = data.lvperlife;
                  my_gloves_min = data.min;
                  my_gloves_max = data.max;
                  my_gloves_dmg = data.dmg;
                  my_gloves_edmg = data.edmg;
                })}
              accept="application/json"
            />
            <label class="button" for="myglovesfileUpload">열기</label>
          </td>
        </tr>

        <tr>
          <td>부츠</td>
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_boots_def}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_boots_ar}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_boots_arpercent}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_boots_stat}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_boots_vital}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_boots_life}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_boots_lvperlife}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_boots_min}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_boots_max}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_boots_dmg}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_boots_edmg}
            /></td
          >
          <td>
            <button on:click={saveMyBoots}>저장</button>
            <input
              type="file"
              id="mybootsfileUpload"
              style="display: none;"
              on:change={(event) =>
                loadData(event, (data) => {
                  my_boots_def = data.def;
                  my_boots_ar = data.ar;
                  my_boots_arpercent = data.arpercent;
                  my_boots_stat = data.stat;
                  my_boots_vital = data.vital;
                  my_boots_life = data.life;
                  my_boots_lvperlife = data.lvperlife;
                  my_boots_min = data.min;
                  my_boots_max = data.max;
                  my_boots_dmg = data.dmg;
                  my_boots_edmg = data.edmg;
                })}
              accept="application/json"
            />
            <label class="button" for="mybootsfileUpload">열기</label>
          </td>
        </tr>

        <tr>
          <td>장신구</td>
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_ringamul_def}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_ringamul_ar}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_ringamul_arpercent}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_ringamul_stat}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_ringamul_vital}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_ringamul_life}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_ringamul_lvperlife}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_ringamul_min}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_ringamul_max}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_ringamul_dmg}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_ringamul_edmg}
            /></td
          >
          <td>
            <button on:click={saveMyRingamul}>저장</button>
            <input
              type="file"
              id="myringamulfileUpload"
              style="display: none;"
              on:change={(event) =>
                loadData(event, (data) => {
                  my_ringamul_def = data.def;
                  my_ringamul_ar = data.ar;
                  my_ringamul_arpercent = data.arpercent;
                  my_ringamul_stat = data.stat;
                  my_ringamul_vital = data.vital;
                  my_ringamul_life = data.life;
                  my_ringamul_lvperlife = data.lvperlife;
                  my_ringamul_min = data.min;
                  my_ringamul_max = data.max;
                  my_ringamul_dmg = data.dmg;
                  my_ringamul_edmg = data.edmg;
                })}
              accept="application/json"
            />
            <label class="button" for="myringamulfileUpload">열기</label>
          </td>
        </tr>

        <tr>
          <td>부적</td>
          <td
            ><input
              type="number"
              class="scorewidth"
              value={def1 * quanitity1 +
                def2 * quanitity2 +
                def3 * quanitity3 +
                def4 * quanitity4}
              readonly
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              value={ar1 * quanitity1 +
                ar2 * quanitity2 +
                ar3 * quanitity3 +
                ar4 * quanitity4}
              readonly
            /></td
          >
          <td><input type="number" class="scorewidth" value={0} readonly /></td>
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_tourchani_stat}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              bind:value={my_tourchani_vital}
            /></td
          >
          <td
            ><input
              type="number"
              class="scorewidth"
              value={life1 * quanitity1 +
                life2 * quanitity2 +
                life3 * quanitity3 +
                life4 * quanitity4}
              readonly
            /></td
          >
          <td><input type="number" class="scorewidth" value={0} readonly /></td>
          <td><input type="number" class="scorewidth" value={0} readonly /></td>
          <td
            ><input
              type="number"
              class="scorewidth"
              value={max1 * quanitity1 +
                max2 * quanitity2 +
                max3 * quanitity3 +
                max4 * quanitity4}
              readonly
            /></td
          >
          <td><input type="number" class="scorewidth" value={0} readonly /></td>
          <td><input type="number" class="scorewidth" value={0} readonly /></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>

  <br /><br />
  <div class="table-outline">
    <div class="table-head">부적 및 기타 입력수치</div>
    <div class="oneline pctable">
      <table class="black width100">
        <tr>
          <th>수량</th>
          <th>맥</th>
          <th>어레</th>
          <th>방어</th>
          <th>피</th>
          <th colspan="6">기타 아이템 수치</th>
        </tr>
        <tbody>
          <tr>
            <td
              ><input
                type="number"
                class="scorewidth"
                bind:value={quanitity1}
              /></td
            >
            <td><input type="number" class="scorewidth" bind:value={max1} /></td
            >
            <td><input type="number" class="scorewidth" bind:value={ar1} /></td>
            <td><input type="number" class="scorewidth" bind:value={def1} /></td
            >
            <td
              ><input type="number" class="scorewidth" bind:value={life1} /></td
            >

            <td>바바스킬</td>
            <td>전투기술 </td>
            <td>숙련</td>
            <td>함성</td>
            <td>전투지시</td>
            <td>외침/철갑피부</td>
          </tr>

          <tr>
            <td
              ><input
                type="number"
                class="scorewidth"
                bind:value={quanitity2}
              /></td
            >
            <td><input type="number" class="scorewidth" bind:value={max2} /></td
            >
            <td><input type="number" class="scorewidth" bind:value={ar2} /></td>
            <td><input type="number" class="scorewidth" bind:value={def2} /></td
            >
            <td
              ><input type="number" class="scorewidth" bind:value={life2} /></td
            >
            <td>
              <input
                type="number"
                class="scorewidth"
                bind:value={my_skill}
              /></td
            >
            <td
              ><input
                type="number"
                class="scorewidth"
                bind:value={my_combat}
              /></td
            >
            <td>
              <input
                type="number"
                class="scorewidth"
                bind:value={my_masteries}
              /></td
            >
            <td>
              <input
                type="number"
                class="scorewidth"
                bind:value={my_warcries}
              /></td
            >
            <td>
              <input
                type="number"
                class="scorewidth"
                bind:value={my_order}
              /></td
            >
            <td
              ><input
                type="number"
                class="scorewidth"
                bind:value={my_shoutiron}
              /></td
            >
          </tr>

          <tr>
            <td
              ><input
                type="number"
                class="scorewidth"
                bind:value={quanitity3}
              /></td
            >
            <td><input type="number" class="scorewidth" bind:value={max3} /></td
            >
            <td><input type="number" class="scorewidth" bind:value={ar3} /></td>
            <td><input type="number" class="scorewidth" bind:value={def3} /></td
            >
            <td
              ><input type="number" class="scorewidth" bind:value={life3} /></td
            >
            <td>방깎</td>
            <td>강타</td>

            <td>피해감소%</td>
            <td>상악</td>
            <td>치타</td>
            <td></td>
          </tr>

          <tr>
            <td
              ><input
                type="number"
                class="scorewidth"
                bind:value={quanitity4}
              /></td
            >
            <td><input type="number" class="scorewidth" bind:value={max4} /></td
            >
            <td><input type="number" class="scorewidth" bind:value={ar4} /></td>
            <td><input type="number" class="scorewidth" bind:value={def4} /></td
            >
            <td
              ><input type="number" class="scorewidth" bind:value={life4} /></td
            >

            <td>
              <input
                type="number"
                class="scorewidth"
                bind:value={my_defoff}
              /></td
            >
            <td
              ><input
                type="number"
                class="scorewidth"
                bind:value={my_reduce}
              /></td
            >
            <td
              ><input
                type="number"
                class="scorewidth"
                bind:value={my_crush}
              /></td
            >
            <td
              ><input
                type="number"
                class="scorewidth"
                bind:value={my_wound}
              /></td
            >
            <td
              ><input type="number" class="scorewidth" bind:value={my_ds} /></td
            ><td></td>
          </tr>

          <tr>
            <td>{quanitity1 + quanitity2 + quanitity3 + quanitity4}</td>
            <td
              >{max1 * quanitity1 +
                max2 * quanitity2 +
                max3 * quanitity3 +
                max4 * quanitity4}</td
            >
            <td
              >{ar1 * quanitity1 +
                ar2 * quanitity2 +
                ar3 * quanitity3 +
                ar4 * quanitity4}</td
            >
            <td
              >{def1 * quanitity1 +
                def2 * quanitity2 +
                def3 * quanitity3 +
                def4 * quanitity4}</td
            >
            <td
              >{life1 * quanitity1 +
                life2 * quanitity2 +
                life3 * quanitity3 +
                life4 * quanitity4}</td
            >
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <br /><br />
  <div class="table-outline">
    <div class="table-head">캐릭터 수치 입력</div>
    <table class="black width100">
      <tr
        ><th>캐릭터 레벨</th><th>힘(아이템 수치 포함)</th><th
          >민첩(아이템 수치 포함)</th
        ><th>타격 프레임</th><th>극대화</th></tr
      >
      <tbody
        ><tr
          ><td>
            <input type="number" class="scorewidth" bind:value={my_lv} />
          </td><td>
            <input type="number" class="scorewidth" bind:value={my_str} />
          </td><td>
            <input type="number" class="scorewidth" bind:value={my_dex} /></td
          ><td>
            <input type="number" class="scorewidth" bind:value={my_frame} />
          </td><td
            ><input type="number" class="scorewidth" bind:value={my_cs} /></td
          ></tr
        ></tbody
      >
    </table>
  </div>

  <div class="main_data">
    <button on:click={checkMyStat}>계산하기</button>
    <button disabled={clickok} on:click={saveMyChar}>저장하기</button>
  </div>

  <div class="table-outline">
    <div class="table-head">수치</div>
    <div class="table-contents-wrapper">
      <div class="table-contents">
        <div class="left">
          체력 : {my_totallife}<br />
          물리 데미지(원소 데미지 제외) : {my_totalmin} ~ {my_totalmax}<br />
          명중 : {my_totalar}<br /> 방어 : {my_totaldef}<br />
        </div>
      </div>
    </div>
    <div class="table-contents-wrapper">
      <div class="table-contents">
        <div class="left">
          계산기 사용법<br />
          이 계산기는 인게임에서 장비를 장착시 뜨는 스탯창 수치를 확인할 수 없는
          경우에 스탯창 수치를 정확하게 측정하기 위해 사용하는 계산기입니다. 모든
          아이템의 수치를 빠짐없이 입력해야합니다. 기타 수치도 입력해주세요. 모든(바바)
          스킬 레벨은 횃불과 애니참, 뚜껑의 2스킬, 목걸이, 갑옷 등 모든 부문의 아이템
          수치만 합해서 입력해야합니다. 부적은 부적 세팅하기에서 부적 갯수와 수량에
          따라 총 수치를 편하게 자동 입력되도록 하였습니다. 각 장비별로 json파일로
          값을 저장해둘 수 있고, 불러와서 장비를 수정할 수 있습니다. 또한 최종수치도
          json파일로 저장하여 시뮬레이터에 활용할 수 있습니다.
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .font15 {
    font-size: 20px;
  }
  .width100 {
    width: 100%;
  }
  .black {
    background-color: black;
  }
  tbody tr:nth-child(odd) {
    background-color: #555d;
  }
  tbody tr:nth-child(even) {
    background-color: #888d;
  }
  .margin10px {
    margin-left: 10px;
  }
  td input {
    margin: 0 auto;
  }
  .headline {
    font-size: 50px;
  }
</style>
