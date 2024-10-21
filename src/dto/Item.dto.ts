import { IsString, IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ItemDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  @ApiProperty({
    description: 'O título do item',
    example: 'Item de Exemplo',
  })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  @ApiProperty({
    description: 'A descrição do item',
    example: 'Este é um item de exemplo para o CRUD.',
  })
  description: string;

  @IsString()
  @IsUrl({}, { message: 'A URL da foto deve ser válida.' })
  @IsNotEmpty( { message: 'A URL da foto é obrigatória.' })
  @ApiProperty({
    description: 'URL da imagem do item',
    example: 'http://example.com/photo.jpg',
  })
  photoUrl: string;
}