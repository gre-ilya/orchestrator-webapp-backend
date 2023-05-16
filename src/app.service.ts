import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private http: HttpService) {}

  async get(link: string) {
    const tmp = await firstValueFrom(this.http.get(link));
    return tmp.status;
  }

  async post(link: string, data: Object) {
    const tmp = await firstValueFrom(this.http.post(link, data));
    return tmp.status;
  }
}
