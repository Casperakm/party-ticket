import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, pipe, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { SuccessAPI } from '../shared/util/success-api';
import { ProductTypeEntity } from './model/product-type.entity';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(ProductTypeEntity)
    private readonly typeRepository: Repository<ProductTypeEntity>,
  ) { }

  findAll(shop_id: number): Observable<ProductTypeEntity[]> {
    return from(this.typeRepository.find());
  }

  async create(category: any, shop_id: number): Promise<ProductTypeEntity> {
    const existData = await this.findProductByName(category['type_name'], shop_id);
    if (existData) {
      throw new BadRequestException('Product Type Data is Wrong');
    } else {
      return this.typeRepository.save({ ...category, shop_id: shop_id });
    }
  }

  async update(category: any, shop_id: number, id: number) {
    const existData = await this.findProductByName(category['type_name'], shop_id);
    if (!existData) {
      throw new BadRequestException('Product Type Id is Wrong');
    }
    else if (existData && id != id) {
      throw new BadRequestException('Product Type Data is Wrong');
    } else {
      existData.type_name = category.type_name
      existData.img_url = category.img_url
      existData.shop_id = shop_id
      await this.typeRepository.update(id, existData)
      let suc = new SuccessAPI()
      return { ...suc, id: id }
    }
  }

  async delete(id: number) {
    try {
      let data = await this.typeRepository.findOneBy({ id });
      await this.typeRepository.softRemove(data);
      let suc = new SuccessAPI()
      return { ...suc, id: id }
    } catch (error) {
      throw new BadRequestException('Product Type Data is Wrong');
    }
  }


  async findProductByName(name: string, shop_id: number) {
    return this.typeRepository.findOneBy({ type_name: name, shop_id: shop_id });
  }


}
