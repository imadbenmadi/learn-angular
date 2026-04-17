/**
 * tasks.service.ts
 * ---------------
 * API wrapper for task CRUD.
 */

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import type {
    Task,
    TaskListResponse,
    TaskResponse,
    TaskStatus,
} from "../models/task.models";

export interface TaskUpsertDto {
    title: string;
    description: string | null;
    status: TaskStatus;
    dueDate: string | null;
}

@Injectable({
    providedIn: "root",
})
export class TasksService {
    private readonly baseUrl = `${environment.apiBaseUrl}/tasks`;

    constructor(private http: HttpClient) {}

    public getAll(): Observable<TaskListResponse> {
        return this.http.get<TaskListResponse>(this.baseUrl);
    }

    public getById(id: number): Observable<TaskResponse> {
        return this.http.get<TaskResponse>(`${this.baseUrl}/${id}`);
    }

    public create(dto: TaskUpsertDto): Observable<TaskResponse> {
        return this.http.post<TaskResponse>(this.baseUrl, dto);
    }

    public update(id: number, dto: TaskUpsertDto): Observable<TaskResponse> {
        return this.http.put<TaskResponse>(`${this.baseUrl}/${id}`, dto);
    }

    public delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
