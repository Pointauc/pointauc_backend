import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import axios from 'axios';

@Controller('random')
export class RandomController {
  @Get('integer')
  async getRandomInteger(
    @Query('min', ParseIntPipe) min: number,
    @Query('max', ParseIntPipe) max: number,
  ) {
    const params = {
      num: 1,
      min,
      max,
      col: 1,
      base: 10,
      format: 'plain',
      md: 'new',
      cl: 'w',
    };
    const { data: randomOrgResponse } = await axios.get<string>(
      'https://www.random.org/integers',
      { params },
    );

    return randomOrgResponse.match(/<span.*>(\d+)\s+<\/span>/)[1];
  }
}
