import { FilterQuery } from "mongoose";

import {
  IApplication,
  IApplicationCreate,
  IApplicationQuery,
  IApplicationUpdate,
} from "../interfaces/application.interface";
import { Application } from "../models/application.model";

class ApplicationRepository {
  public getAll(query: IApplicationQuery): Promise<[IApplication[], number]> {
    const skip = query.pageSize * (query.page - 1);
    const filterObject: FilterQuery<IApplication> = {};

    if (query.search) {
      filterObject.$or = [
        { name: { $regex: query.search, $options: "i" } },
        { surname: { $regex: query.search, $options: "i" } },
        { email: { $regex: query.search, $options: "i" } },
        { phone: { $regex: query.search, $options: "i" } },
        { age: { $regex: query.search, $options: "i" } },
        { course: { $regex: query.search, $options: "i" } },
        { course_format: { $regex: query.search, $options: "i" } },
        { course_type: { $regex: query.search, $options: "i" } },
        { status: { $regex: query.search, $options: "i" } },
        { group: { $regex: query.search, $options: "i" } },
      ];
    }
    return Promise.all([
      Application.find(filterObject)
        .limit(query.pageSize)
        .skip(skip)
        .sort(query.order),
      Application.find(filterObject).countDocuments(),
    ]);
  }

  public create(application: IApplicationCreate): Promise<IApplication> {
    return Application.create(application);
  }

  public getById(id: string): Promise<IApplication> {
    return Application.findById(id);
  }

  public updateById(
    id: string,
    application: IApplicationUpdate,
  ): Promise<IApplication> {
    return Application.findByIdAndUpdate(id, application, { new: true });
  }
}

export const applicationRepository = new ApplicationRepository();
