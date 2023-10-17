import { Module } from '@nestjs/common';
import { ProductTypeService } from './product-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeEntity } from './model/product-type.entity';
import { ProductTypeController } from './product-type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductTypeEntity])],
  controllers: [ProductTypeController],
  providers: [ProductTypeService],
  exports: [ProductTypeService],
})
export class ProductTypeModule {}
