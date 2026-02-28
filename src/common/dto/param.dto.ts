import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class ParamDto {
  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  id: number;
}

export class ParamIdDto {
  @IsUUID()
  id: string;
}
