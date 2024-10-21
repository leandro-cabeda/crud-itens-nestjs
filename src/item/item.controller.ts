import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Res,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemDto } from '../dto/item.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('items')
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo item' })
  @ApiResponse({ status: 201, description: 'Item criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  @ApiBody({ type: ItemDto, description: 'Dados do item a ser criado.', required: true })
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() itemDto: ItemDto,
    @Res() res: Response,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const item = await this.itemService.create(itemDto, file?.buffer);
    return res.status(201).json(item);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os itens' })
  @ApiResponse({ status: 200, description: 'Itens listados com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos de entrada ao buscar.' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'title', type: String, required: false })
  @ApiQuery({ name: 'description', type: String, required: false })
  @ApiQuery({ name: 'sortBy', type: String, required: false })
  @ApiQuery({ name: 'order', type: String, enum: ['asc', 'desc'], required: false })
  async findAll(
    @Res() res: Response,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('title') title?: string,
    @Query('description') description?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    return res
      .status(200)
      .json(
        await this.itemService.findAll(
          page,
          limit,
          { title, description },
          sortBy,
          order,
        ),
      );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um item pelo ID' })
  @ApiResponse({ status: 200, description: 'Item obtido com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos de entrada ao buscar.' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  @ApiResponse({ status: 404, description: 'Item não encontrado na base.' })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    if (!id) return res.status(400).json({ message: 'Id não informado' });

    return res.status(200).json(await this.itemService.findOne(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um item pelo ID' })
  @ApiResponse({ status: 200, description: 'Item atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos de entrada ao buscar.' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  @ApiResponse({ status: 404, description: 'Item não encontrado na base.' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: ItemDto, description: 'Dados do item a ser atualizado.', required: true })
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateItemDto: ItemDto,
    @Res() res: Response,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!id) return res.status(400).json({ message: 'Id não informado' });

    return res
      .status(200)
      .json(await this.itemService.update(id, updateItemDto, file?.buffer));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um item pelo ID' })
  @ApiResponse({ status: 204, description: 'Item deletado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos de entrada ao buscar.' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  @ApiResponse({ status: 404, description: 'Item não encontrado na base.' })
  @ApiParam({ name: 'id', type: String })
  async remove(@Param('id') id: string, @Res() res: Response) {
    if (!id) return res.status(400).json({ message: 'Id não informado' });

    await this.itemService.remove(id);
    return res.status(204).json();
  }
}
