import { IsEnum } from 'class-validator';
import { OrderStatusList } from './enum/order.enum';

export class StatusDto {
  @IsEnum(OrderStatusList, {
    message: `Valid status are ${OrderStatusList.join(', ')}`,
  })
  status: string;
}
