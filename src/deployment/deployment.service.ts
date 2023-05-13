import { Injectable } from '@nestjs/common';
import { CreateDeploymentDto } from './dto/create-deployment.dto';
import { UpdateDeploymentDto } from './dto/update-deployment.dto';

@Injectable()
export class DeploymentService {
  create(createDeploymentDto: CreateDeploymentDto) {
    return 'This action adds a new deployment';
  }

  findAll() {
    return `This action returns all deployment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deployment`;
  }

  update(id: number, updateDeploymentDto: UpdateDeploymentDto) {
    return `This action updates a #${id} deployment`;
  }

  remove(id: number) {
    return `This action removes a #${id} deployment`;
  }
}
