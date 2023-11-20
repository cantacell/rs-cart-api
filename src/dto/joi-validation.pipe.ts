import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform
} from '@nestjs/common';
import * as Joi from 'joi';


@Injectable()
export class JoiValidationPipe implements PipeTransform {
    constructor(private readonly schema: Joi.ObjectSchema) {}

    transform(inputValue: any, metadata: ArgumentMetadata) {
        console.log(inputValue, metadata);
        const { error, value } = this.schema.validate(inputValue/*, {convert: true}*/);
        if (error) {
            console.log('error', error);
            throw new BadRequestException('Validation failed');
        }
        return value;
    }
}