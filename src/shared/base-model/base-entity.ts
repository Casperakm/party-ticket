import { ApiResponseProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Generated,
} from 'typeorm';

@Entity()
export abstract class BaseEntity {
  @ApiResponseProperty()
  @PrimaryGeneratedColumn()
  @Generated('increment')
  id: number;

  @ApiResponseProperty()
  @CreateDateColumn()
  created_at?: Date;

  @ApiResponseProperty()
  @UpdateDateColumn()
  updated_at?: Date;

  @ApiResponseProperty()
  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;
}
