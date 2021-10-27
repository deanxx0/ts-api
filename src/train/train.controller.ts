import { Body, Controller, Delete, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
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
  async createTrain(@Body() postTrainDto: PostTrainDto): Promise<any> {
    console.log(`[Req][train controller] createTrain`);
    const resTrainInfoDto = await this.trainService.createTrain(postTrainDto);
    return {
      success: resTrainInfoDto != null ? true : false,
      result: resTrainInfoDto,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllTrain(@Request() req): Promise<any> {
    console.log(`[Req][train controller] getAllTrain`);
    const allTrain = await this.trainService.findAllTrain(req.user.username);
    return {
      success: allTrain != null ? true : false,
      result: allTrain,
      // result: allTrain.map(idObj => idObj._id),
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('totalpage')
  async getTotalPage(): Promise<any> {
    console.log(`[Req][train controller] getTotalPage`);
    const totalPage = await this.trainService.getTotalPage();
    return {
      success: totalPage != null ? true : false,
      result: totalPage,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('totalcount')
  async getTotalCount(): Promise<any> {
    console.log(`[Req][train controller] getTotalCount`);
    const totalCount = await this.trainService.getTotalCount();
    return {
      success: totalCount != null ? true : false,
      result: totalCount,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('setting/:_id')
  async getTrainSetting(@Param('_id') _id: string): Promise<any> {
    console.log(`[Req][train controller] getTrainSetting`);
    const trainSetting = await this.trainService.getTrainSetting(_id);
    return {
      success: trainSetting != null ? true : false,
      result: trainSetting,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('pages/:pageNo')
  async getTrainPage(@Request() req, @Param('pageNo') pageNo: number, @Query('perPage') perPage: string = '5'): Promise<any> {
    console.log(`[Req][train controller] getTrainPage`);
    const trainPage = await this.trainService.getTrainPage(req.user.username, pageNo, perPage);
    return {
      success: trainPage != null ? true : false,
      result: trainPage,
      // result: trainPage.map(idObj => idObj._id),
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':_id')
  async getTrainInfoBy_id(@Request() req, @Param('_id') _id: string): Promise<any> {
    console.log(`[Req][train controller] getTrainBy_id`);
    const trainInfo = await this.trainService.getTrainInfoBy_id(req.user.username, _id);
    return {
      success: trainInfo != null ? true : false,
      result: trainInfo,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  async deleteTrainInfoBy_id(@Request() req, @Param('_id') _id: string): Promise<any> {
    console.log(`[Req][train controller] deleteTrainBy_id`);
    const deletedTrain = await this.trainService.deleteTrainInfoBy_id(req.user.username, _id);
    return {
      success: deletedTrain != null ? true : false,
      result: deletedTrain,
    }
  }
}
