export class CreateDeploymentDto {
    constructor(partial: Partial<CreateDeploymentDto>) {
        Object.assign(this, partial);
    }
}
