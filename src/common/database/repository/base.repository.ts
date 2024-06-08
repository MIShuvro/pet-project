import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';
export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async create(createDataEntity: any): Promise<T> {
    return new this.entityModel(createDataEntity).save();
  }

  async save(createDataEntity: any): Promise<T> {
    const newModelData = await new this.entityModel(createDataEntity);
    return newModelData.save();
  }

  async createMany(createDataEntity: any[]) {
    return this.entityModel.insertMany(createDataEntity, { ordered: true });
  }

  async find(
    entityFilterQuery: FilterQuery<T>,
    projection?: Partial<T | any>,
    sort?: Partial<T | any>
  ): Promise<T[] | null> {
    if (projection && sort) {
      return this.entityModel.find(entityFilterQuery, projection).sort(sort).lean();
    }
    if (projection) {
      return this.entityModel.find(entityFilterQuery, projection).lean();
    }
    if (sort) {
      return this.entityModel.find(entityFilterQuery).sort(sort).lean();
    }
    return this.entityModel.find(entityFilterQuery).lean();
  }

  async findWithLimit(entityFilterQuery: FilterQuery<T>, limit?: number): Promise<T[] | null> {
    return this.entityModel.find(entityFilterQuery).limit(limit).sort({ order_index: 1 }).lean();
  }

  async findOne(entityFilterQuery: FilterQuery<T>, projection?: Partial<T | any>): Promise<T | null> {
    if (projection) {
      return this.entityModel.findOne(entityFilterQuery, projection).lean();
    }
    return this.entityModel.findOne(entityFilterQuery).lean();
  }

  async findLastOne(entityFilterQuery: FilterQuery<T>): Promise<T | null> {
    return this.entityModel.findOne(entityFilterQuery).sort({ createdAt: -1 });
  }

  async findOneBySorted(entityFilterQuery: FilterQuery<T>, sort?: Partial<T | any>): Promise<T | null> {
    if (sort) {
      return this.entityModel.findOne(entityFilterQuery).sort(sort).lean();
    }
    return this.entityModel.findOne(entityFilterQuery).sort({ createdAt: -1 });
  }

  async findAll(projection?: Partial<T | any>): Promise<T[] | null> {
    if (!projection) return this.entityModel.find({}, { createdAt: 0, updatedAt: 0, __v: 0 }).lean();
    return this.entityModel.find().lean();
  }

  async findOneAndUpdate(entityFilterQuery: FilterQuery<T>, updateEntityData: UpdateQuery<T>): Promise<T | null> {
    return this.entityModel.findOneAndUpdate(entityFilterQuery, updateEntityData);
  }

  async update(
    entityFilterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<T>,
    upsert?: { upsert: boolean }
  ): Promise<T | null> {
    let dbUpsert = {
      upsert: false
    };
    if (upsert && upsert.upsert) {
      dbUpsert.upsert = upsert.upsert;
    }
    return this.entityModel.findOneAndUpdate(entityFilterQuery, updateEntityData, dbUpsert);
  }

  async deleteOne(entityFilterQuery: FilterQuery<T>): Promise<any> {
    return this.entityModel.deleteOne(entityFilterQuery);
  }

  async deleteMany(entityFilterQuery: FilterQuery<T>): Promise<any> {
    return this.entityModel.deleteMany(entityFilterQuery);
  }

  getModel(): Model<T> {
    return this.entityModel;
  }
}
