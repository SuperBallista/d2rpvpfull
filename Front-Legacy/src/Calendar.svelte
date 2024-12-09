<script>
  import {
    nickname,
    mode,
    formopen,
    currenteventname,
    showNavbar, SecurityFetch 
  } from "./store.js";
  import { onMount } from "svelte";

  export let year;
  export let month;
  export let date;
  export let events;
  export let eventname;
  export let getCalendartext;

  onMount(() => {
    showNavbar.set(true);
  });

  let editing = null;
  let eventText = "";
  let inputRef = null;

  $: ({ daysInMonth, startDayOfWeek } = generateCalendar(year, month));

  function generateCalendar(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = [];
    let currentDay = new Date(firstDay);

    while (currentDay <= lastDay) {
      daysInMonth.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    const startDayOfWeek = firstDay.getDay();

    return { daysInMonth, startDayOfWeek };
  }

  $: if (editing && inputRef) {
    inputRef.focus();
  }

  const handleEdit = (day, text) => {
    if ($nickname === "admin" || $nickname === "admin_m") {
      editing = day.toDateString();
    } else {
      formopen.set("calendartext");
      currenteventname.set(text);
    }
  };

  const handleSave = async (day) => {
    const eventDate = day.toDateString();
    const eventPayload = {
      year: day.getFullYear(),
      month: day.getMonth() + 1,
      day: day.getDate(),
      event: eventText,
      mode: $mode,
    };

    try {
      const endpoint = "/calendar/event"
      const response = await SecurityFetch(endpoint, "POST", eventPayload);

      if (response.ok) {
        alert("이벤트 기록을 저장하였습니다");
        events = { ...events, [eventDate]: eventText };
        editing = null;

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

  // Create calendar rows
  $: calendarRows = createCalendarRows(daysInMonth, startDayOfWeek);

  function createCalendarRows(daysInMonth, startDayOfWeek) {
    const rows = [];
    let week = [];
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

  function handle_eventtext(event) {
    eventText = event.target.value;
  }
</script>

<div class="table-outline">
  <div class="table-head">
    <div class="table-date">일</div>
    <div class="table-date">월</div>
    <div class="table-date">화</div>
    <div class="table-date">수</div>
    <div class="table-date">목</div>
    <div class="table-date">금</div>
    <div class="table-date">토</div>
  </div>
  {#each calendarRows as week}
    <div class="calendar-row">
      {#each week as dayEntry}
        {#if dayEntry === "empty"}
          <div class="table-date empty"></div>
        {:else}
          <div
            class="table-date table-date-heigh"
            style={dayEntry.isToday ? "color: blue;" : ""}
            role="button"
            tabindex="0"
            on:click={() =>
              handleEdit(dayEntry.day, eventname[dayEntry.dayKey])}
            on:keydown={(e) =>
              (e.key === "Enter" || e.key === " ") &&
              handleEdit(dayEntry.day, eventname[dayEntry.dayKey])}
          >
            {dayEntry.day.getDate()}
            <div class="event-cell">
              {#if editing === dayEntry.day.toDateString()}
                <div class="edit-container">
                  <input
                    type="text"
                    bind:this={inputRef}
                    class="calendar-input"
                    bind:value={eventText}
                    on:input={handle_eventtext}
                  /><br />
                  <button on:click={() => handleSave(dayEntry.day)}>수정</button
                  >
                </div>
              {:else}
                <div>
                  {eventname[dayEntry.dayKey] || ""}
                </div>
              {/if}
            </div>
          </div>
        {/if}
      {/each}
    </div>
  {/each}
</div>

<style>
  .calendar-row {
    display: flex;
    width: 100%; /* Ensure rows take full width */
  }

  .table-date {
    width: 14.28%;
    padding: 10px;
    border: 1px solid white;
    align-items: center;
    overflow: hidden; /* Hide overflow text */
    text-overflow: ellipsis; /* Show ellipsis (...) for overflow text */
  }
  .table-date-heigh {
    height: 100px;
    cursor: pointer;
  }

  .table-date.empty {
    border: 1px solid white;
  }

  .edit-container {
    align-items: center;
  }

  .calendar-input {
    flex-grow: 1;
  }

  .calendar-row:nth-child(even) .table-date:nth-child(even) {
    background-color: #555d;
  }
  .calendar-row:nth-child(odd) .table-date:nth-child(odd) {
    background-color: #555d;
  }
  .calendar-row:nth-child(odd) .table-date:nth-child(even) {
    background-color: #888d;
  }
  .calendar-row:nth-child(even) .table-date:nth-child(odd) {
    background-color: #888d;
  }

  .calendar-input {
    background-color: #0000;
    font-size: 1rem;
    color: white;
    border: none;
    font-family: "diablo";
  }
</style>
