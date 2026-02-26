import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PRODUCT_SERVICE } from 'src/config/services';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  createProduct(@Body() payload: CreateProductDto) {
    return this.productsClient.send({ cmd: 'create_product' }, payload);
  }

  @Get()
  findAllProducts(@Query() PaginationDto: PaginationDto) {
    return this.productsClient.send(
      { cmd: 'find_all_products' },
      PaginationDto,
    );
  }

  @Get(':id')
  async findOneProduct(@Param('id') id: string) {
    try {
      return await firstValueFrom<{
        name: string;
        price: number;
        available: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
      }>(this.productsClient.send({ cmd: 'find_one_product' }, { id: +id }));
    } catch (e) {
      throw new RpcException(e);
    }
  }

  @Patch(':id')
  patchProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsClient
      .send({ cmd: 'update_product' }, { id, ...updateProductDto })
      .pipe(
        catchError((e) => {
          throw new RpcException(e);
        }),
      );
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'delete_product' }, { id }).pipe(
      catchError((e) => {
        throw new RpcException(e);
      }),
    );
  }
}
