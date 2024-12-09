// store.js
import { writable, get } from 'svelte/store';
export const mode = writable(false);
export const formopen = writable(null);
export const currenteventname = writable("");


export function clickformopen(whatform) {
  formopen.set(whatform);
}



// 세션 유효성 및 사용자 정보를 저장할 스토어
export const isAuthenticated = writable(false);

// JWT 디코딩 및 사용자 정보 저장
export const nickname = writable(null);
  
 

  // 닉네임 리스트를 저장할 store
  export const nicknames = writable([]);
  
  // 닉네임을 서버에서 가져오는 함수
  export async function fetchNicknames(modevalue) {
    try {
      const endpoint = modevalue ? "/nicknames/m-user" : "/nicknames/b-user";
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
  
        // 닉네임 리스트 초기화 및 업데이트
        if (modevalue) {
          nicknames.set(data.map(name => name.replace("_m", "")));
        } else {
          nicknames.set(data);
        }
      } else {
        console.error('닉네임을 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('닉네임을 가져오는 중 오류가 발생했습니다:', error);
    }
  }
  

export const key = writable(0);


  // 날짜 포맷팅 함수
 export function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: "2-digit", day: "2-digit" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  // 페이지값 기억변수
  export const page = writable(1);
  export const category = writable("all");
export const modify_postid = writable("none");


export const showNavbar = writable(true);


export const clanlists = writable([]);

export async function fetechClanList() {
  try {
      const response = await fetch('/clan/list');
      if (response.ok) {
        const data = await response.json()
          clanlists.set(data); // 배열로 처리
      } 
  } catch (error) {
      alert("클랜 목록을 불러오는 중 오류가 발생했습니다.");
  }
}

export const jwtToken = writable('');

export const csrfToken = writable('');



// 특정 쿠키 값을 가져오는 함수
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}




export async function SecurityFetch(endpoint, method, data = null) {

  
  const token = get(jwtToken) || null;
  const csrfToken = getCookie('csrfToken') || null; // 쿠키에서 CSRF 토큰 가져오기

  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "d2rpvpjwtToken": token,
      "X-CSRF-Token": csrfToken,  // CSRF 토큰을 X-CSRF-Token으로 전송
    },
    credentials: "include", // 쿠키 포함
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(endpoint, options);
    if (response.status!=200 && response.status!=201 && response.status!=204) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error('Error during fetch:', error);
    throw error;
  }
}
