import { IsString, IsNumber, IsDateString, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

@ValidatorConstraint({ name: 'minStartPrice', async: false })
export class MinStartPriceConstraint implements ValidatorConstraintInterface {
  validate(start_price: number, args: ValidationArguments) {
    return start_price >= 0;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Start price must be greater than or equal to 0';
  }
}

export function MinStartPrice(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'minStartPrice',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: MinStartPriceConstraint
    });
  };
}

export class AddItemDto {
  @IsString()
  name!: string;

  @IsNumber()
  @MinStartPrice({ message: 'Start price must be greater than or equal to 0' })
  start_price!: number;

  @IsDateString()
  start_time!: Date;

  @IsDateString()
  end_time!: Date;
}
