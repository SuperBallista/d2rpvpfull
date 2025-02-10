import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CalculateService } from './calculate.service';
import { RolesGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/guard/roles.decorator';

@Controller('calculate')
export class CalculateController {
  constructor(private readonly calculateService: CalculateService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles("admin", "user", "guest")
  async handleCalculation(@Body() params: any): Promise<any> {
    const startTime = Date.now();

      const result = this.calculateService.calculateRound(params);
      const duration = Date.now() - startTime;
      console.info(`Request processed in ${duration} milliseconds`);
      return result;
  }
}
