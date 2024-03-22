import { IsNumber } from 'class-validator';

export class AddBidDto {
  @IsNumber()
  item_id!: number;

  @IsNumber()
  price!: number;
}
