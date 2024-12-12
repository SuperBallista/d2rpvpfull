import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { CalculateService } from './calculate.service';

@Controller('calculate')
export class CalculateController {
  constructor(private readonly calculateService: CalculateService) {}

  @Post()
  async handleCalculation(@Body() params: any): Promise<any> {
    const startTime = Date.now();

    try {
      const result = this.calculateService.calculateRound(params);
      const duration = Date.now() - startTime;
      console.info(`Request processed in ${duration} milliseconds`);
      return result;
    } catch (error) {
      console.error(`Error processing request: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
