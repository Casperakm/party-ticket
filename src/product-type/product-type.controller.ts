import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductTypeService } from './product-type.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiParam, ApiQuery, ApiResponseProperty, ApiTags } from '@nestjs/swagger';
import { CreateProductTypeDto } from './model/product-type.dto';
import { ProductTypeEntity } from './model/product-type.entity';
import { SuccessAPI } from '../shared/util/success-api';
import { UserData } from 'src/shared/decorators/users.decorator';

@Controller('/product-type')
@ApiTags('Product-Type')
export class ProductTypeController {
    constructor(
        private readonly _productType: ProductTypeService
    ) { }

    @Post('')
    @ApiOkResponse({ type: Object })
    @ApiBadRequestResponse()
    @ApiParam({ name: 'shop_id', type: Number, required: true })
    CreateProductType(
        @Body() data: CreateProductTypeDto,
        @Param('shop_id', ParseIntPipe) shop_id: number
    ) {
        return this._productType.create(data, shop_id);
    }

    @Get('')
    @ApiOkResponse({ type: [ProductTypeEntity], })
    @ApiParam({ name: 'shop_id', type: Number, required: true })
    getProductType(
        @Param('shop_id', ParseIntPipe) shop_id: number
    ) {
        return this._productType.findAll(shop_id);
    }

    @Put(':id')
    @ApiOkResponse({ type: SuccessAPI })
    @ApiBadRequestResponse()
    @ApiParam({ name: 'id', type: Number, required: true })
    @ApiParam({ name: 'shop_id', type: Number, required: true })
    async updateDeliveryFee(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: CreateProductTypeDto,
        @Param('shop_id', ParseIntPipe) shop_id: number
    ) {
        return this._productType.update(data, shop_id, id);
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: Number, required: true })
    @ApiOkResponse({ type: SuccessAPI })
    @ApiBadRequestResponse()
    async deleteDeliveryFee(@Param('id', ParseIntPipe) id: number) {
        return this._productType.delete(id);
    }
}
