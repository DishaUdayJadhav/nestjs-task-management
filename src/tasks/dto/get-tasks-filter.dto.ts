import { IsOptional, IsEnum, IsString } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class GetTaskFilterDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  search?: string;
}
