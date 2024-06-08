import { GroupService } from "../service/group.service";
import { GroupRepository } from "../repository/group.repository";
import { UserService } from "../service/user.service";
import { UserRepository } from "../repository/user.repository";
import { PermissionService } from "../service/permission.service";
import { Group } from "../schema/group.schema";
import { Test } from "@nestjs/testing";
import { User } from "../schema/user.schema";
import { PermissionRepository } from "../repository/permisssion.repository";
import { UserMapPermissionRepository } from "../repository/user-map-permission.repository";
import { UserRequestDto } from "../dto/request/user-request.dto";
import { hashPassword } from "../../../common/utils";
import { UserResponseDto } from "../dto/response/user-response.dto";
import { plainToInstance } from "class-transformer";


describe("User Service", () => {
  let service: UserService;
  let permissionService: Partial<PermissionService>;
  let userRepository: Partial<UserRepository>;
  let groupRepository: Partial<GroupRepository>;
  let permissionRepository: Partial<PermissionRepository>;
  let userMapPermissionRepository: Partial<UserMapPermissionRepository>;


  beforeEach(async () => {

    userRepository = {
      save: jest.fn().mockImplementation(dto => Promise.resolve(User)),
      find: jest.fn().mockImplementation(dto => Promise.resolve([User]))
    };

    permissionService = {
      createPermission: jest.fn().mockImplementation(dto => Promise.resolve()),
      findPermission: jest.fn().mockImplementation(dto => Promise.resolve())
    };

    groupRepository = {
      save: jest.fn().mockImplementation(dto => Promise.resolve(Group)),
      find: jest.fn().mockImplementation(dto => Promise.resolve([Group]))
    };


    const module = await Test.createTestingModule({
      providers: [UserService,PermissionService, {
        provide: UserRepository,
        useValue: userRepository
      },
        {
          provide: GroupRepository,
          useValue: groupRepository
        },
        {
          provide: UserRepository,
          useValue: userRepository
        },
        {
          provide: PermissionRepository,
          useValue: permissionRepository
        }, {
          provide: UserMapPermissionRepository,
          useValue: userMapPermissionRepository
        }
      ],
      imports:[]
    }).compile();
    service = module.get(UserService);
  });


  it("can create an instance of the user service", async function() {
    expect(service).toBeDefined();
  });

  it('should create a user and return the response', async () => {
    const dto: UserRequestDto = {
      name: 'John Doe',
      email: 'john@example.com',
      group_id: '1',
      password: 'password123',
    };
    let user = await userRepository.save(dto)
    const result = await service.createUser(dto);
    expect(result).toEqual(plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    }))
  })

});
