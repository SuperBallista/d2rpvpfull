import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class CalculateService {
  roundFloatToInt(value: number): number {
    return Math.round(value);
  }

  roundFloatToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }

  calculateRound(params: any): any {
    let wincount = 0;
    let losecount = 0;

    for (let number = 0; number < params.iterations; number++) {
      let framecount = 0;
      let myframecheck = 0;
      let yourframecheck = 0;
      let mygamehp = params.myhp;
      let yourgamehp = params.yourhp;

      let mylv = params.mycharlv;
      mylv += params.myclass < 3 ? 20 : 5;

      let yourlv = params.yourcharlv;
      yourlv += params.yourclass < 3 ? 20 : 5;

      while (mygamehp > 0 && yourgamehp > 0) {
        framecount++;
        myframecheck++;
        yourframecheck++;
        let mywoundcondition = 0;
        let yourwoundcondition = 0;

        if (myframecheck - params.myframe >= 0) {
          myframecheck -= params.myframe;
          if (
            Math.random() <
            0.25 *
              this.roundFloatToTwoDecimals(
                ((100 - params.yourdodge) / 100) *
                  (params.myar / (params.myar + params.yourdf * ((100 - params.mydfoff / 2) / 100))) *
                  (2 * mylv) /
                  (mylv + yourlv),
              )
          ) {
            if (Math.random() * 100 < params.mycrush) {
              yourgamehp -= this.roundFloatToInt((yourgamehp / 10 / params.yourreduce) * 100);
            }
            if (Math.random() * 100 < params.myopenwound) {
              yourwoundcondition = 200;
            }
            const damage =
              Math.random() *
                (params.mymaxdmg / 6 / params.yourreduce - params.mymindmg / 6 / params.yourreduce) +
              params.mymindmg / 6 / params.yourreduce;
            const isCrit = Math.random() * 100 < params.mycs + (params.myds * (100 - params.mycs)) / 100;
            yourgamehp -= this.roundFloatToInt(isCrit ? damage * 2 : damage);
          }
          mygamehp -= params.yourthorns / 6 / params.myreduce;
        }

        if (yourframecheck - params.yourframe >= 0) {
          yourframecheck -= params.yourframe;
          if (
            Math.random() <
            0.25 *
              this.roundFloatToTwoDecimals(
                ((100 - params.mydodge) / 100) *
                  (params.yourar / (params.yourar + params.mydf * ((100 - params.yourdfoff / 2) / 100))) *
                  (2 * yourlv) /
                  (yourlv + mylv),
              )
          ) {
            if (Math.random() * 100 < params.yourcrush) {
              mygamehp -= this.roundFloatToInt((mygamehp / 10 / params.myreduce) * 100);
            }
            if (Math.random() * 100 < params.youropenwound) {
              mywoundcondition = 200;
            }
            const damage =
              Math.random() *
                (params.yourmaxdmg / 6 / params.myreduce - params.yourmindmg / 6 / params.myreduce) +
              params.yourmindmg / 6 / params.myreduce;
            const isCrit = Math.random() * 100 < params.yourcs + (params.yourds * (100 - params.yourcs)) / 100;
            mygamehp -= this.roundFloatToInt(isCrit ? damage * 2 : damage);
          }
          yourgamehp -= params.mythorns / 6 / params.yourreduce;
        }

        if (mywoundcondition > 0) {
          mywoundcondition--;
          mygamehp = Math.max(1, mygamehp - (45 * params.yourcharlv - 1319) / 256);
        }

        if (yourwoundcondition > 0) {
          yourwoundcondition--;
          yourgamehp = Math.max(1, yourgamehp - (45 * params.mycharlv - 1319) / 256);
        }

        if (mygamehp <= 0 && yourgamehp > 0) {
          losecount++;
        }

        if (mygamehp > 0 && yourgamehp <= 0) {
          wincount++;
        }

        if (framecount > 15000) {
          console.warn('Loop count exceeded 15000, breaking to prevent infinite loop');
          break;
        }
      }
    }

    const drawcount = params.iterations - wincount - losecount;
    const winRate = (wincount / params.iterations) * 100;

    return {
      winCount: wincount,
      loseCount: losecount,
      drawCount: drawcount,
      winRate: winRate,
    };
  }
}
