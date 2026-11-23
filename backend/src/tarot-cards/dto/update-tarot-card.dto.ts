import { PartialType } from '@nestjs/mapped-types';
import { CreateTarotCardDto } from './create-tarot-card.dto';

export class UpdateTarotCardDto extends PartialType(CreateTarotCardDto) {}

