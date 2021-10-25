import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
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
    const resTrainInfoDto = await this.trainService.createTrain(req.user.username, postTrainDto);
    return {
      success: resTrainInfoDto != null ? true : false,
      result: resTrainInfoDto,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllTrain(): Promise<any> {
    console.log(`[train controller] getAllTrain`);
    const allTrain = await this.trainService.findAllTrain();
    return {
      success: allTrain != null ? true : false,
      result: allTrain.map(idObj => idObj._id),
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('totalpage')
  async getTotalPage(): Promise<any> {
    console.log(`[train controller] getTotalPage`);
    const totalPage = await this.trainService.getTotalPage();
    return {
      success: totalPage != null ? true : false,
      result: totalPage,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':_id')
  async getTrainInfoBy_id(@Request() req, @Param('_id') _id: string): Promise<any> {
    console.log(`[train controller] getTrainBy_id`);
    const trainInfo = await this.trainService.getTrainInfoBy_id(req.user.username, _id);
    return {
      success: trainInfo != null ? true : false,
      result: trainInfo,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('pages/:pageNo')
  async getTrainPage(@Request() req, @Param('pageNo') pageNo: number,): Promise<any> {
    console.log(`[train controller] getTrainPage`);
    const trainPage = await this.trainService.getTrainPage(req.user.username, pageNo);
    return {
      success: trainPage != null ? true : false,
      result: trainPage,
      // result: trainPage.map(idObj => idObj._id),
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  async deleteTrainInfoBy_id(@Request() req, @Param('_id') _id: string): Promise<any> {
    console.log(`[train controller] deleteTrainBy_id`);
    const deletedTrain = await this.trainService.deleteTrainInfoBy_id(req.user.username, _id);
    return {
      success: deletedTrain != null ? true : false,
      result: deletedTrain,
    }
  }
}
