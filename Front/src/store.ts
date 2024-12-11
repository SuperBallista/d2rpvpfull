import { writable, get } from "svelte/store";

export const mode = writable(false);


export const jwtToken = writable('');

export const csrfToken = writable('');

function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  }
  
  export async function SecurityFetch(endpoint: string, method: string, data: any = null) {
    const token = get(jwtToken) || null;
    const csrfToken = getCookie('csrfToken') || null; // 쿠키에서 CSRF 토큰 가져오기
  
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
  
    if (token) {headers["d2rpvpjwttoken"] = token};
    if (csrfToken) {headers["X-CSRF-Token"] = csrfToken};
  
    const options: RequestInit = {
      method: method,
      headers,
      credentials: "include" as RequestCredentials,
    };
  
    if (data) {
      options.body = JSON.stringify(data);
    }
  
    try {
      const response = await fetch(endpoint, options);

      const jwt = response.headers.get("d2rpvpjwttoken")

      if (typeof jwt === "string")
{jwtToken.set(jwt)}
      // 상태 코드에 관계없이 response 반환
      return response;
    } catch (error) {
      console.error("Error during fetch:", error);
      throw error; // 네트워크 오류는 그대로 throw
    }
  }
  
export const key = writable("");


  // JWT 디코딩 및 사용자 정보 저장
export const myaccount = writable("");


  // 닉네임 리스트를 저장할 store
  export const nicknames = writable([]);
  
  // 닉네임을 서버에서 가져오는 함수
  export async function fetchNicknames(modevalue: boolean) {
    try {
      const endpoint = modevalue ? "/nicknames/m-user" : "/nicknames/b-user";
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
  
        // 닉네임 리스트 초기화 및 업데이트
        if (modevalue) {
          nicknames.set(data.map((name: string) => name.replace("_m", "")));
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
  

// 날짜 포맷팅 함수
export function formatDate(dateString: string): string {
  // dateString이 유효한 날짜인지 확인
  const date = new Date(dateString);

  // 유효하지 않은 날짜 처리
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`);
  }

  // 포맷 옵션 타입 명시
  const options: Intl.DateTimeFormatOptions = {
    month: "2-digit",
    day: "2-digit",
  };

  // 날짜를 포맷팅하여 반환
  return new Intl.DateTimeFormat("en-US", options).format(date);
}



  // 페이지값 기억변수
  export const page = writable(1);
  export const category = writable("all");
export const modify_postid = writable("none");







// 폼 전환
export const form = writable("none");


