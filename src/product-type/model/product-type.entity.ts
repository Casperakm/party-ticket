import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../shared/base-model/base-entity';

@Entity('product_type')
export class ProductTypeEntity extends BaseEntity {

  @ApiResponseProperty()
  @Column({ nullable: true })
  img_url: string;

  @ApiResponseProperty()
  @Column({ nullable: true })
  type_name: string;

  @ApiResponseProperty()
  @Column()
  shop_id?: number;

}
