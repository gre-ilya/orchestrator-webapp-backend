import { Controller, Post } from '@nestjs/common';
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
