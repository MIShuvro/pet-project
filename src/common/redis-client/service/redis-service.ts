import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisClientService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {
  }


  async setValueWithExpireInSec(key: string, value: string, seconds: number): Promise<any> {
    return this.redisClient.set(key, value, 'EX', seconds);
  }

  async getValue(key: string): Promise<any> {
    return this.redisClient.get(key);
  }


  async getKeys(key: string): Promise<any> {
    return this.redisClient.keys(key)
  }
  async delKey(key: string): Promise<any> {
    return this.redisClient.del(key);
  }
  async checkKeyExist(key: string): Promise<boolean> {
    let res = await this.redisClient.exists(key);
    return res > 0;
  }
}
