import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './task.model';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private TaskModel: Model<TaskDocument>) {}

  async findAll(): Promise<Task[]> {
    return this.TaskModel.find().exec();
  }

  async findOne(id: string): Promise<Task> {
    const Task = await this.TaskModel.findById(id).exec();
    if (!Task) throw new NotFoundException(`Task with ID ${id} not found`);
    return Task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const Task = new this.TaskModel(createTaskDto);
    return Task.save();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const Task = await this.TaskModel.findByIdAndUpdate(id, updateTaskDto, {
      new: true,
    }).exec();
    if (!Task) throw new NotFoundException(`Task with ID ${id} not found`);
    return Task;
  }

  async delete(id: string): Promise<void> {
    const result = await this.TaskModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Task with ID ${id} not found`);
  }
}
