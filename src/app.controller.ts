import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
// @ApiTags('orchestrator')
export class AppController {
  constructor(private appService: AppService) {}

  // @Post('orchestrator')
  // async sendDeployment() {
  //   console.log(
  //     await this.appService.post('http://172.17.0.1:8000/data', {
  //       one: 1,
  //       two: 2,
  //       three: 3,
  //     }),
  //   );
  //   return 'OK';
  // }
}
