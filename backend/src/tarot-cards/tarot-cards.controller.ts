import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTarotCardDto } from './dto/create-tarot-card.dto';
import { UpdateTarotCardDto } from './dto/update-tarot-card.dto';
import { TarotCard } from './entities/tarot-card.entity';
import { TarotCardsService } from './tarot-cards.service';

@Controller('tarot-cards')
export class TarotCardsController {
  constructor(private readonly tarotCardsService: TarotCardsService) {}

  @Get()
  findAll(): TarotCard[] {
    return this.tarotCardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): TarotCard {
    return this.tarotCardsService.findOne(id);
  }

  @Post()
  create(@Body() createTarotCardDto: CreateTarotCardDto): TarotCard {
    return this.tarotCardsService.create(createTarotCardDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTarotCardDto: UpdateTarotCardDto,
  ): TarotCard {
    return this.tarotCardsService.update(id, updateTarotCardDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tarotCardsService.remove(id);
  }
}

