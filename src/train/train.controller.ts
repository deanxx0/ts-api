import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostTrainDto } from './post-train.dto';
import { TrainService } from './train.service';

@Controller('train')
export class TrainController {
  constructor(
    private trainService: TrainService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTrain(@Request() req, @Body() postTrainDto: PostTrainDto): Promise<any> {
    console.log(`[train controller] createTrain`);
    const trainDoc = await this.trainService.createTrain(req.user.username, postTrainDto);
    return {
      success: trainDoc != null ? true : false,
      result: trainDoc,
    }
  }
}
