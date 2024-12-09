<script>
  import { onMount } from "svelte";
  import Calendar from "./Calendar.svelte";

  let eventname = {};
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed
  const currentDate = today.getDate();

  let year = currentYear;
  let month = currentMonth;
  let date = currentDate;
  let events = {};

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
    getCalendartext(newYear, newMonth); // 이전 달의 데이터를 가져옵니다
  };

  async function getCalendartext(year, month) {
    try {
      const eventextEndpoint = `/calendar?year=${year}&month=${month + 1}&isM=false`;
      const response = await fetch(eventextEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const eventsByDate = {};
      data.forEach((item) => {
        eventsByDate[item.date] = item.text;
      });
      eventname = eventsByDate;
    } catch (error) {
      alert("달력 DB 에러");
      console.error("Error:", error);
    }
  }

  onMount(() => {
    getCalendartext(today.getFullYear(), today.getMonth()); // 현재 달의 데이터를 가져옵니다
  });
</script>
<svelte:head>
    <title>D2R PvP</title>
</svelte:head>

<div class="main_data calendar-title">
  <button on:click={clickbefore}>지난달</button>
  {year}년 {month + 1}월
  <button on:click={clicknext}>다음달</button>
</div>
<div class="main_data">
  <Calendar {year} {month} {date} {events} {eventname} {getCalendartext} />
</div>

<style>
  .calendar-title {
    margin-bottom: -40px;
    margin-top: 50px;
    font-size: 30px;
  }
</style>
