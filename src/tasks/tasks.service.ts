import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from 'src/user/user.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksRepository');

  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  //1
  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({
      where: { id, user },
    });

    if (!found) {
      throw new NotFoundException(`Task with Id "${id}" not found`);
    }

    return found;
  }

  //2
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.tasksRepository.save(task);
    return task;
  }

  //3
  async deleteTaskById(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  //4
  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;

    await this.tasksRepository.save(task);
    return task;
  }

  //5
  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.tasksRepository.createQueryBuilder('task');
    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      return await query.getMany();
    } catch (error: unknown) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException();
    }
  }
}

//   private tasks: Task[] = [];

//   //1
//   getAllTasks(): Task[] {
//     return this.tasks;
//   }

//   //2
//   getTaskById(id: string): Task {
//     //try to get task
//     const found = this.tasks.find((task) => task.id === id);

//     // if not found , throw an error(404 not found)
//     if (!found) {
//       throw new NotFoundException(`Task with ${id} not found`);
//     }

//     // otherwise, return the found task
//     return found;
//   }

//   //3
//   deleteTaskById(id: string): void {
//     const found = this.getTaskById(id);
//     this.tasks = this.tasks.filter((task) => task.id !== found.id);
//   }

//   //4
//   updateTaskStatus(id: string, status: TaskStatus): Task {
//     const task = this.getTaskById(id);
//     task.status = status;
//     return task;
//   }

//   //5
//   getTaskWithFilters(filterDto: GetTaskFilterDto): Task[] {
//     const { status, search } = filterDto;

//     //define a temporary array to hold the result
//     let tasks = this.getAllTasks();

//     //do something with status
//     if (status) {
//       tasks = tasks.filter((task) => task.status === status);
//     }

//     //do something with search
//     if (search) {
//       tasks = tasks.filter((task) => {
//         if (task.title.includes(search) || task.description.includes(search)) {
//           return true;
//         }
//         return false;
//       });
//     }

//     //return final result
//     return tasks;
//   }

//   //6
//   createTask(createTaskDto: CreateTaskDto): Task {
//     const { title, description } = createTaskDto;
//     const task: Task = {
//       id: uuid(),
//       title,
//       description,
//       status: TaskStatus.OPEN,
//     };

//     this.tasks.push(task);
//     return task;
//   }
// }
