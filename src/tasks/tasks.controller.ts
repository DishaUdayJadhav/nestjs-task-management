import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
// import type { TaskStatus } from './task-status.enum';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { Logger } from '@nestjs/common';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private tasksService: TasksService) {}

  //1
  @Get()
  getTasks(
    @Query() filterDto: GetTaskFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`,
    );

    return this.tasksService.getTasks(filterDto, user);
  }

  //2
  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  //3
  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`,
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  //4
  @Delete('/:id')
  deleteTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.deleteTaskById(id, user);
  }

  //5
  @Patch('/:id/status')
  updateTaskById(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}

//   // http://localhost:3000/tasks
//   @Get()
//   getTasks(@Query() filterDto: GetTaskFilterDto): Task[] {
//     //if we have any filters defined , call tasksService.getTasksWithFilters
//     //otherwise, just get all tasks

//     if (Object.keys(filterDto).length) {
//       return this.tasksService.getTaskWithFilters(filterDto);
//     } else {
//       return this.tasksService.getAllTasks();
//     }
//   }

//   //http://localhost:3000/tasks/j1sadrur873sjd
//   @Get('/:id')
//   getTaskById(@Param('id') id: string): Task | undefined {
//     return this.tasksService.getTaskById(id);
//   }

//   @Delete('/:id')
//   deleteTaskById(@Param('id') id: string): void {
//     this.tasksService.deleteTaskById(id);
//   }

//   @Patch('/:id/status')
//   updateTaskById(
//     @Param('id') id: string,
//     @Body() updateTaskStatusDto: UpdateTaskStatusDto,
//   ): Task {
//     const { status } = updateTaskStatusDto;
//     return this.tasksService.updateTaskStatus(id, status);
//   }

//   /*aapn ya pddhtine pn kru shkto pn validation kru proper dusrya method ni
//   @Post()
//   createTask(@Body() body) {
//     console.log('body', body);*/
//   }

//   @Post()
//   createTask(@Body() createTaskDto: CreateTaskDto): Task {
//     return this.tasksService.createTask(createTaskDto);
//   }
//
