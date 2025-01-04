<script lang="ts">
    import { onMount } from "svelte";
    import Calendar from "./calendar.svelte";
    import { mode, SecurityFetch } from "../store";
    import { useLocation } from "svelte-routing"

    const location = useLocation()
    let eventname = {};
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed
    const currentDate = today.getDate();
  
    let year = currentYear;
    let month = currentMonth;
    let date: number | null = currentDate;
    let events = {};
    $: pathname = $location.pathname;

  
    const clicknext = () => {
      let newMonth = month + 1;
      let newYear = year;
      if (newMonth === 12) {
        newMonth = 0;
        newYear += 1;
      }
      month = newMonth;
      year = newYear;
      date = null;
      if (newYear === today.getFullYear() && newMonth === today.getMonth()) {
        date = today.getDate();
      }
      getCalendartext(newYear, newMonth); // 다음 달의 데이터를 가져옵니다
    };
  
    const clickbefore = () => {
      let newMonth = month - 1;
      let newYear = year;
      if (newMonth === -1) {
        newMonth = 11;
        newYear -= 1;
      }
      month = newMonth;
      year = newYear;
      date = null;
      if (newYear === today.getFullYear() && newMonth === today.getMonth()) {
        date = today.getDate();
      }
      getCalendartext(newYear, newMonth); // 이 달의 데이터를 가져옵니다
    };
  
    async function getCalendartext(year: number, month: number) {
      try {
        const eventextEndpoint = `/calendar/event?year=${year}&month=${month + 1}&mode=${$mode}`;
        const response = await SecurityFetch(eventextEndpoint,"GET");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const eventsByDate: Record<string, string> = {};
        data.forEach((item: { date: string; text: string }) => {
          eventsByDate[item.date] = item.text;
        });
        eventname = eventsByDate;
      } catch (error) {
        alert("달력 DB 에러");
        console.error("Error:", error);
      }
    }
  
    onMount(() => {
// if (pathname.includes("mpk"))
// {mode.set("mpk")}
// else if (pathname.includes("zpke"))
// {mode.set("zpke")}
// else if (pathname.includes("babapk"))
// {mode.set("babapk")} 
      getCalendartext(today.getFullYear(), today.getMonth()); // 현재 달의 데이터를 가져옵니다
    });
  </script>
<div class="calendar-header">
<button class="simple-button" on:click={clickbefore}>지난달</button>
  <div class="calendar-header-text">{year}년 {month + 1}월</div>
    <button class="simple-button" on:click={clicknext}>다음달</button>
</div>
    <Calendar {year} {month} {date} {events} {eventname} {getCalendartext} />
  
  <style>
  .calendar-header {
    display: flex;
    justify-content: center;
    align-items: center;
  margin: 0 0 10px 0;
}
.calendar-header-text {
  font-weight: bold;
  margin: 0 10px;
}
  </style>