import { Entity, Column, BeforeInsert, OneToMany, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { UserRole } from './customer.enum';
import { BaseEntity } from '../../shared/base-model/base-entity';

@Entity('customer')
export class CustomerEntity extends BaseEntity {
  @Column({ nullable: true })
  username: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Column({ nullable: true, unique: true })
  uuid: string;

  @Column({ unique: true })
  refer_code: string

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatar_url: string;


  @Column({ nullable: true })
  nrc: string;

  @Column({ nullable: true })
  dob?: Date;

  @Column({ nullable: true })
  balances?: number;



  // @ManyToOne(
  //   type => WardEntity,
  //   Ward => Ward.id,
  //   { nullable: true, eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  // )
  // @JoinColumn({ name: 'ward_id', referencedColumnName: 'id' })
  // ward: WardEntity

  // @OneToOne(
  //   type => ShopEntity,
  //   shop => shop.customer,
  //   { nullable: true, eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  // )
  // @JoinColumn({ name: 'shop_id', referencedColumnName: 'id' })
  // shop?: ShopEntity;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

}
