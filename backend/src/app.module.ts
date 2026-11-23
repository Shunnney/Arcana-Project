import { Module } from '@nestjs/common';
import { TarotCardsModule } from './tarot-cards/tarot-cards.module';

@Module({
  imports: [TarotCardsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

