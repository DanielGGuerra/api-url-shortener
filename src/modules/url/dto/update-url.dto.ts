import { PartialType } from '@nestjs/swagger';
import { CreateUrlDTO } from './create-url.dto';

export class UpdateUrlDTO extends PartialType(CreateUrlDTO) {}
