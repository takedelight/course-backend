import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { isDev } from '../utils/is-dev';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.getOrThrow<string>('DATABASE_HOST'),
        port: Number(configService.getOrThrow<string>('DATABASE_PORT')),
        username: configService.getOrThrow<string>('DATABASE_USER'),
        password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
        database: configService.getOrThrow<string>('DATABASE_NAME'),
        entities: [__dirname + '/../**/*.entity{.ts}'],
        synchronize: isDev(),
      });

      return dataSource.initialize();
    },
  },
];
