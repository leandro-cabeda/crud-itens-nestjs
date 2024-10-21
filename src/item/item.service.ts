import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ItemDto } from '../dto/Item.dto';
import { Item } from '../schemas/item.schema';
import processImage from '../utils/util';
import { FilterDto } from '../dto/filter.dto';

@Injectable()
export class ItemService {
  constructor(@InjectModel(Item.name) private itemModel: Model<Item>) {}

  async create(itemDto: ItemDto, imageBuffer?: Buffer): Promise<Item> {
    let photoUrl = itemDto.photoUrl;

    try {
      const existingItem = await this.itemModel
        .findOne({ title: itemDto.title })
        .exec();

      if (existingItem) throw new BadRequestException('Este item com o titulo '+itemDto.title+' já existe na base');

      if (imageBuffer) photoUrl = await processImage(imageBuffer);

      const createdItem = new this.itemModel({ ...itemDto, photoUrl });
      return await createdItem.save();
    } catch (error) {
      console.log(error);

      if (error.status === 400) throw new BadRequestException(error);

      throw new InternalServerErrorException(error);
    }
  }

  async findAll(
    page: number,
    limit: number,
    filters: FilterDto,
    sortBy: string = 'createdAt',
    order: 'asc' | 'desc' = 'asc',
  ): Promise<Item[]> {
    const sortOrder = order?.trim() === 'asc' ? 1 : -1; // 1 para ascendente, -1 para descendente
    page = page <= 0 ? 1 : page;
    limit = limit <= 0 ? 10 : limit;
    const skip = (page - 1) * limit;

    try {
      const query: any = {};
      if (filters.title) {
        query.title = { $regex: new RegExp(filters.title, 'i') };
      }
      if (filters.description) {
        query.description = { $regex: new RegExp(filters.description, 'i') };
      }

      return this.itemModel.find(query).skip(skip).limit(limit)
        .sort({ [sortBy]: sortOrder }).exec();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<Item> {
    try {
      const item = await this.itemModel.findById(id).exec();

      if (!item) throw new NotFoundException('Item não encontrado na base!');

      return item;
    } catch (error) {
      console.log(error);

      if (error.status === 404) throw new NotFoundException(error);

      throw new InternalServerErrorException(error);
    }
  }

  async update(
    id: string,
    updateItemDto: ItemDto,
    imageBuffer?: Buffer,
  ): Promise<Item> {
    let photoUrl = updateItemDto.photoUrl;

    try {

      const item = await this.itemModel.findById(id).exec();

      if (!item) throw new NotFoundException('Item não encontrado na base!');
      
      const existingItem = await this.itemModel
        .findOne({ title: updateItemDto.title })
        .exec();

      if (existingItem && existingItem.id !== id)
        throw new BadRequestException('Este item com o titulo '+updateItemDto.title+' já existe na base');

      if (imageBuffer) photoUrl = await processImage(imageBuffer);

      const updatedItem = await this.itemModel
        .findByIdAndUpdate(
          id,
          { ...updateItemDto, photoUrl },
          {
            new: true,
          },
        )
        .exec();

      return updatedItem;
    } catch (error) {
      console.log(error);

      if (error.status === 404) throw new NotFoundException(error);

      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.itemModel.findByIdAndDelete(id).exec();
      if (!result) throw new NotFoundException('Item não encontrado na base!');
    } catch (error) {
      console.log(error);

      if (error.status === 404) throw new NotFoundException(error);

      throw new InternalServerErrorException(error);
    }
  }
}
