import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { ItemService } from '../src/item/item.service';
import { Item } from '../src/schemas/item.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('ItemController', () => {
  let app: INestApplication;
  let service: ItemService;
  let model: Model<Item>;

  const mockQuery = {
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([]),
  };

  const mockItemModel = {
    find: jest.fn().mockReturnValue(mockQuery),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        ItemService,
        {
          provide: getModelToken(Item.name),
          useValue: mockItemModel,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    model = moduleFixture.get<Model<Item>>(getModelToken(Item.name));
    service = moduleFixture.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call find with correct filters', async () => {
    const filters = { title: 'Test', description: 'teste' };
    await service.findAll(1, 10, filters, 'createdAt', 'asc');
    expect(model.find).toHaveBeenCalledWith({
      title: { $regex: new RegExp('Test', 'i') },
    });
  });

  it('should call sort with the correct field and order', async () => {
    await service.findAll(1, 10, {}, 'title', 'desc');
    expect(mockQuery.sort).toHaveBeenCalledWith({ title: -1 });
  });

  it('should return an array of items', async () => {
    const mockItems = [
      { title: 'Item 1', description: 'Description 1', photoUrl: 'url1', createdAt: new Date() },
    ];
    mockQuery.exec.mockResolvedValueOnce(mockItems);
    const result = await service.findAll(1, 10, {}, 'createdAt', 'asc');
    expect(result).toEqual(mockItems);
  });

});
