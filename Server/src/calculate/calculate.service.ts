import { Injectable } from '@nestjs/common';

function activeEffect(odd:number):boolean {
  if (odd/100 > Math.random())
{return true}
  else
  {return false}
}

function caculateFinalDamage(min:number, max:number, reduce: number):number{
// 리듀 환산
  const reducePercent = reduce / 100
// 실제 맥뎀과 민뎀 계산
  const realmax = max / 6 * reducePercent
const realmin = min / 6 * reducePercent
return Math.floor(Math.random() * (realmax - realmin + 1)) + realmin
}

function CSActiveCalculate(cs: number, ds: number): number{
 return cs + (ds * (100 - cs))
}


@Injectable()
export class CalculateService {
  roundFloatToInt(value: number): number {
    return Math.round(value);
  }

  roundFloatToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }


  calculateRound(startStat: any): any[] {
    let simulResult = [startStat, []]

    class FrameStatus {
      constructor(
        public frame: number,
        public myLife: number,
        public yourLife: number,
        public myOpenedWoundStatus: number,
        public yourOpenedWoundStatus: number,
        public myTriedAttack: boolean,
        public yourTriedAttack: boolean,
        public myAttackSuccess: number,
        public yourAttackSuccess: number,
        public myCrushSuccess: boolean,
        public yourCrushSuccess: boolean,
        public myDeadlySuccess: boolean,
        public yourDeadlySuccess: boolean,
        public myOpenedWoundSuccess: boolean,
        public yourOpenedWoundSuccess: boolean
      ) {}
    }

    const mylv = startStat.mycharlv + (startStat.myclass < 3 ? 20 : 5);
    const yourlv = startStat.yourcharlv + (startStat.yourclass < 3 ? 20 : 5);


    let wincount = 0;
    let losecount = 0;
    
// 게임을 횟수만큼 돌립니다
    for (let games = 1; games < startStat.iterations + 1; games++)
{
// 게임 시작전 모든 변수를 초기화합니다
let FrameCount = 0
let myFrameCheck = 0;
let yourFrameCheck = 0;
let myCharHp = startStat.myhp;
let yourCharHp = startStat.yourhp;
let myWoundStatus = 0;
let yourWoundStatus = 0;
let myAttackFrameIndex = 0;
let yourAttackFrameIndex = 0;

let myOpenedWoundStatus = 0
let yourOpenedWoundStatus = 0



// 경기시작, 프레임이 진행됩니다
while (myCharHp > 0 && yourCharHp > 0 && FrameCount < 7500){
FrameCount++;
myFrameCheck++;
yourFrameCheck++;
let myCrushSuccess = false
let myOpenedWoundSuccess = false
let myDeadlySuccess = false

let yourCrushSuccess = false
let yourOpenedWoundSuccess = false
let yourDeadlySuccess = false

let myAttackTried = false
let yourAttackTried = false
let myAttackSuccess = 0
let yourAttackSuccess = 0


//상악 데미지를 적용합니다
if (myOpenedWoundStatus > 0)
  {
    myOpenedWoundStatus -=1;
    myCharHp = Math.max(1, myCharHp - (45 * startStat.yourcharlv - 1319) / 256)
  }
  
  if (yourOpenedWoundStatus > 0)
    {
      yourOpenedWoundStatus -=1;
      yourCharHp = Math.max(1, yourCharHp - (45 * startStat.mycharlv - 1319) / 256)
    }

  
// 현재 필요한 공격시 소요프레임을 가져옵니다
const myAttackFrame = startStat.myframe[myAttackFrameIndex]
const yourAttackFrame = startStat.yourframe[yourAttackFrameIndex]


// 나의 타격 프레임이 되었는지 체크
if (myFrameCheck - myAttackFrame >= 0){
myFrameCheck -= myAttackFrame;
myAttackFrameIndex = (myAttackFrame + 1) % startStat.myframe.length;
myAttackTried = true


// 타격 성공 여부 계산
if (activeEffect(
  0.25 * this.roundFloatToTwoDecimals(((100 - startStat.yourdodge) / 100) * (startStat.myar / (startStat.myar + startStat.yourdf * ((100 - startStat.mydfoff / 2) / 100))) * (2 * mylv) / mylv + yourlv)))
{
myAttackSuccess = caculateFinalDamage(startStat.mymindmg, startStat.mymaxdmg, startStat.yourreduce)

// 강타 성공 여부
if (activeEffect(startStat.mycrush))
{
  myCrushSuccess = true
  yourCharHp = yourCharHp - ( yourCharHp / 10 * (startStat.yourreduce / 100) )
}

//상처악화 성공여부
if (activeEffect(startStat.myopenwound))
{
  myOpenedWoundSuccess = true
  yourOpenedWoundStatus = 200
}

// 치명적 공격 성공여부
if (activeEffect(CSActiveCalculate(startStat.mycs, startStat.myds)))
{
  myDeadlySuccess = true
  // 치타 성공으로 물리데미지 한번 더 빼서 계산
  yourCharHp = yourCharHp - myAttackSuccess  
}
// 공격 데미지 계산
yourCharHp = yourCharHp - myAttackSuccess  

}

  // 쏜즈 데미지 계산
myCharHp = myCharHp - (startStat.yourthorns / 6 * ( startStat.myreduce / 100))

}



// 상대의 타격 프레임이 되었는지 체크
if (yourFrameCheck - yourAttackFrame >= 0){
  yourFrameCheck -= yourAttackFrame;
  yourAttackFrameIndex = (yourAttackFrame + 1) % startStat.yourframe.length;
  yourAttackTried = true
  
  
  // 타격 성공 여부 계산
  if (activeEffect(
    0.25 * this.roundFloatToTwoDecimals(((100 - startStat.mydodge) / 100) * (startStat.yourar / (startStat.yourar + startStat.mydf * ((100 - startStat.yourdfoff / 2) / 100))) * (2 * yourlv) / yourlv + mylv)))
  {
  yourAttackSuccess = caculateFinalDamage(startStat.yourmindmg, startStat.yourmaxdmg, startStat.myreduce)
  
  // 강타 성공 여부
  if (activeEffect(startStat.yourcrush))
  {
    yourCrushSuccess = true
    myCharHp = myCharHp - (myCharHp / 10 * (startStat.myreduce / 100))
  }
  
  //상처악화 성공여부
  if (activeEffect(startStat.youropenwound))
  {
    yourOpenedWoundSuccess = true
    myOpenedWoundStatus = 200
  }
  
  // 치명적 공격 성공여부
  if (activeEffect(CSActiveCalculate(startStat.yourcs, startStat.yourds)))
  {
    yourDeadlySuccess = true
    // 치타 성공으로 물리데미지 한번 더 빼서 계산
    myCharHp -= yourAttackSuccess  
  }
  // 공격 데미지 계산
  myCharHp -= yourAttackSuccess  
  
  }
  
  // 쏜즈 데미지 계산
  yourCharHp = yourCharHp - (startStat.mythorns / 6 * ( startStat.yourreduce / 100))
  }
  


// 결과 기록
  if (myCharHp <= 0 || yourCharHp <= 0) {
if (myCharHp > 0) {
  wincount = wincount + 1
  // console.log("win", wincount)
}
else if (yourCharHp > 0) {
  losecount = losecount + 1
  // console.log("lose", losecount)
}


  }

        
// 현재 상태를 저장할 객체를 선언
const thisStatus = new FrameStatus(
  FrameCount,
  myCharHp,
  yourCharHp,
  myWoundStatus,
  yourWoundStatus,
  myAttackTried,
  yourAttackTried,
 myAttackSuccess,
 yourAttackSuccess,
 myCrushSuccess,
 yourCrushSuccess,
 myDeadlySuccess,
 yourDeadlySuccess,
 myOpenedWoundSuccess,
 yourOpenedWoundSuccess
)

if (games===1)
{simulResult[games].push(thisStatus)}

}
    
  }
  simulResult[0].winCount = wincount
  simulResult[0].loseCount = losecount
  simulResult[0].drawCount = startStat.iterations - wincount - losecount;
  simulResult[0].winRate = (wincount / startStat.iterations) * 100;


  return simulResult

}
}
