import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { exec, spawn } from 'child_process';
import * as process from 'process';

const scriptExecution = spawn('orchestrator/script.sh');

@Controller()
export class AppController {
  @Post('script')
  async execScript() {
    console.log(process.env);
    exec('orchestrator/script.sh', (err, stdout, stderr) => {
      if (err) {
        console.log(err);
      }
      console.log(stdout);
    });
  }
}
