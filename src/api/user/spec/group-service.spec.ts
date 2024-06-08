import { GroupService } from "../service/group.service";
import { GroupRepository } from "../repository/group.repository";
import { Test } from "@nestjs/testing";
import { Group } from "../schema/group.schema";
import { GroupRequestDto } from "../dto/request/group-request.dto";
import { plainToInstance } from "class-transformer";
import { GroupResponseDto } from "../dto/response/group-response.dto";


describe("Group(Roles) Service", () => {
  let service: GroupService;
  let groupRepository: Partial<GroupRepository>;


  beforeEach(async () => {

    groupRepository = {
      save: jest.fn().mockImplementation(dto => Promise.resolve(Group)),
      find: jest.fn().mockImplementation(dto => Promise.resolve([Group]))
    };


    const module = await Test.createTestingModule({
      providers: [GroupService, {
        provide: GroupRepository,
        useValue: groupRepository
      }]
    }).compile();
    service = module.get(GroupService);
  });

  it("can create an instance of the group service", async function() {
    expect(service).toBeDefined();
  });

  it("should create a group and return the response", async () => {
    const dto: GroupRequestDto = {
      name: "User",
      identifier: "user"
    };
    let group = await groupRepository.save(dto);
    const result = await service.createGroup(dto);
    expect(groupRepository.save).toHaveBeenCalledWith(dto);
    expect(result).toEqual(plainToInstance(GroupResponseDto, group, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    }));

  });

  it("should return groups as GroupResponseDto array", async () => {
    let groups = await groupRepository.find({});

    const result = await service.findGroup();

    expect(groupRepository.find).toHaveBeenCalledWith({});
    expect(result).toEqual(plainToInstance(GroupResponseDto, groups, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    }));
  });
});
