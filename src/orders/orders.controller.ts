import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { NATS_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OrderStatus } from './dto/enum/order.enum';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { StatusDto } from './dto/status.dto';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.natsClient.send('createOrder', createOrderDto);
  }

  @Get()
  async findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    try {
      const orders = await firstValueFrom<{
        id: string;
        totalAmount: number;
        totalItems: number;
        status: OrderStatus;
        paid: boolean;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
      }>(this.natsClient.send('findAllOrders', orderPaginationDto));

      return orders;
    } catch (e) {
      throw new RpcException(e);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom<{
        id: string;
        totalAmount: number;
        totalItems: number;
        status: OrderStatus;
        paid: boolean;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
      }>(this.natsClient.send('findOneOrder', { id }));
      return order;
    } catch (e) {
      throw new RpcException(e);
    }
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      return this.natsClient.send('changeOrderStatus', {
        id,
        status: statusDto.status,
      });
    } catch (e) {
      throw new RpcException(e);
    }
  }
}
