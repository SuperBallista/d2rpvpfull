<script lang="ts">
    import {
      mode,
      SecurityFetch,
      admin, lang
    } from "../store";
  
    export let year: number;
    export let month: number;
    export let date: number | null;
    export let events: Record<string, string>;
    export let eventname: Record<number, string>;
    export let getCalendartext: (year: number, month: number) => Promise<void>;
  

    let editing: string | null = null;
    let eventText = "";
    let inputRef: HTMLInputElement | null = null;
  
    interface CalendarDay {
      day: Date;
      isToday: boolean;
      dayKey: number;
    }
  
    interface CalendarRow {
      day?: CalendarDay;
      empty?: boolean;
    }
  
    interface Calendar {
      daysInMonth: Date[];
      startDayOfWeek: number;
    }
  
    $: ({ daysInMonth, startDayOfWeek } = generateCalendar(year, month));
  
    function generateCalendar(year: number, month: number): Calendar {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
  
      const daysInMonth: Date[] = [];
      let currentDay = new Date(firstDay);
  
      while (currentDay <= lastDay) {
        daysInMonth.push(new Date(currentDay));
        currentDay.setDate(currentDay.getDate() + 1);
      }
  
      const startDayOfWeek = firstDay.getDay();
  
      return { daysInMonth, startDayOfWeek };
    }
  
    const handleEdit = (day: Date, text: string): void => {
    if ($admin.includes($mode)) {
      editing = day.toDateString();
      eventText = text || ""; // Initialize with existing event text or empty
    }
  };
    
    const handleSave = async (day: Date): Promise<void> => {
      const eventDate = day.toDateString();
      const eventPayload = {
        year: day.getFullYear(),
        month: day.getMonth() + 1,
        day: day.getDate(),
        event: eventText,
        mode: $mode,
      };
  
      try {
        const endpoint = "/calendar/event";
        const response = await SecurityFetch(endpoint, "POST", eventPayload);
  
        if (response.status === 201) {
          alert($lang ? "이벤트 기록을 저장하였습니다" : "Memo Saved");
          events = { ...events, [eventDate]: eventText };
          editing = null;
          eventText = "";
  
          const savedYear = year;
          const savedMonth = month;
          await getCalendartext(savedYear, savedMonth);
        } else {
          alert(`오류 발생: ${response.status}`);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    $: calendarRows = createCalendarRows(daysInMonth, startDayOfWeek);
  
    function createCalendarRows(
      daysInMonth: Date[],
      startDayOfWeek: number
    ): Array<CalendarDay | "empty">[] {
      const rows: Array<Array<CalendarDay | "empty">> = [];
      let week: Array<CalendarDay | "empty"> = [];
      let dayOfWeekCounter = 0;
  
      // Fill the first week with empty cells if necessary
      for (let i = 0; i < startDayOfWeek; i++) {
        week.push("empty");
        dayOfWeekCounter++;
      }
  
      // Fill the calendar with the actual days
      daysInMonth.forEach((day) => {
        if (dayOfWeekCounter === 7) {
          rows.push(week);
          week = [];
          dayOfWeekCounter = 0;
        }
  
        const isToday =
          day.getDate() === date &&
          day.getMonth() === month &&
          day.getFullYear() === year;
        const dayKey = day.getDate();
        week.push({ day, isToday, dayKey });
        dayOfWeekCounter++;
      });
  
      // Fill the last week with empty cells if necessary
      if (week.length > 0) {
        while (week.length < 7) {
          week.push("empty");
        }
        rows.push(week);
      }
  
      return rows;
    }
  
    function handle_eventtext(event: Event): void {
      const target = event.target as HTMLInputElement;
      eventText = target.value;
    }

    let activeTooltip: string | null = null; // 현재 활성화된 툴팁의 날짜 키

function toggleTooltip(dayKey: number): void {
  if (activeTooltip === `${dayKey}`) {
    activeTooltip = null; // 이미 열려 있다면 닫기
  } else {
    activeTooltip = `${dayKey}`; // 새로운 툴팁 열기
  }
}

  </script>
  

  <div class="calendar-container">
    <table class="calendar-table">
      <thead>
        <tr>
          <th class="day-header">{$lang ? '일' : 'Sun'}</th>
          <th class="day-header">{$lang ? '월' : 'Mon'}</th>
          <th class="day-header">{$lang ? '화' : 'Tue'}</th>
          <th class="day-header">{$lang ? '수' : 'Wed'}</th>
          <th class="day-header">{$lang ? '목' : 'Thu'}</th>
          <th class="day-header">{$lang ? '금' : 'Fri'}</th>
          <th class="day-header">{$lang ? '토' : 'Sat'}</th>
        </tr>
      </thead>
      <tbody>
        {#each calendarRows as week}
          <tr>
            {#each week as dayEntry}
              {#if dayEntry === "empty"}
                <td class="empty"></td>
              {:else}
              <td class="day-cell" role="button" tabindex="0">
                <div
                  on:click={() => handleEdit(dayEntry.day, eventname[dayEntry.dayKey])}
                  class="day-number {$admin.includes($mode) ? "pointer" : ""}"
                >
                  {dayEntry.day.getDate()}
                </div>
                
                {#if editing === dayEntry.day.toDateString()}
                  <input
                    class="calendar-input"
                    type="text"
                    bind:value={eventText}   on:keydown={(event) => {
                      if (event.key === "Enter") handleSave(dayEntry.day);
                    }}
                  />
                  <button
                    class="emphasis-button small"
                    on:click={() => handleSave(dayEntry.day)}
                  >
                    {$lang ? "저장" : "Save"}
                  </button>
                {:else}
                  <div
                    class="inside-tooltip pointer"
                    on:click={() => toggleTooltip(dayEntry.dayKey)}
                  >
                    {eventname[dayEntry.dayKey] || ""}
                  </div>
                  <div
                    class="tooltiptext"
                    class:visible={activeTooltip === `${dayEntry.dayKey}`}
                  >
                    {eventname[dayEntry.dayKey] || ""}
                  </div>
                {/if}
              </td>
                            {/if}
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>


  
  <style>
  .tooltiptext {
    position: fixed;
    top: 50%; /* 셀 아래 표시 */
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    text-align: center;
    padding: 5px;
    border-radius: 4px;
    white-space: nowrap;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    visibility: hidden; /* 기본적으로 숨김 */
    opacity: 0;
    transition: opacity 0.3s, visibility 0.3s;
    z-index: 10;
    font-size: 2rem;
  }

  .tooltiptext.visible {
    visibility: visible;
    opacity: 1;
  }

  .day-header {
    text-align: center;
  }

  .day-cell {
    position: relative;
    text-align: center;
    vertical-align: top;
  }
  

  .calendar-table {
    width: 100%;
    border-collapse: collapse;
  }

  .calendar-table td {
    width: 14.28%; /* 7열로 균등 분할 */
    height: 100px;
    position: relative;
  }
  .inside-tooltip{
    font-size: 0.8rem;
  }
  
  .pointer{
    cursor: pointer;
  }

  .calendar-input{
    border: none; /* 테두리 제거 */
  background: transparent; /* 배경 투명 */
  color: inherit; /* 부모 요소의 텍스트 색상 상속 */
  font-size: 0.8rem; /* 기본 폰트 크기 */
  width: 60%; /* 셀 너비에 맞추기 */
  text-align: center; /* 텍스트 중앙 정렬 */
  outline: none; /* 포커스 시 파란 테두리 제거 */
  padding: 0; /* 여백 제거 */
  }
  .calendar-input:focus{
    outline: none;
  }


  table {
  border-collapse: collapse; /* 테두리가 겹치지 않도록 설정 */
  width: 100%; /* 테이블 너비 */
}

td, th {
  border: 1px solid #444; /* 내부 셀에만 선을 추가 */
}

table th, table td {
  border-left: none; /* 왼쪽 선 제거 */
  border-top: none; /* 위쪽 선 제거 */
}

table tr:first-child th {
  border-top: none; /* 첫 행의 상단 선 제거 */
}
table tr:last-child td {
  border-bottom: none; /* 끝 행의 하단 선 제거 */
}


table tr td:first-child,
table tr th:first-child {
  border-left: none; /* 첫 열의 왼쪽 선 제거 */
}

table tr td:last-child,
table tr th:last-child {
  border-right: none; /* 끝 열의 오른쪽 선 제거 */
}

.small{
  padding: 3px;
  font-size: 0.7rem;
}

</style>
