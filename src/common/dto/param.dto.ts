import { Type } from 'class-transformer'
import { IsNumber, IsPositive } from 'class-validator'

export class ParamDto {
  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  id: number
}
