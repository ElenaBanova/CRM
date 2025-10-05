import { StatusCodesEnum } from "../enums/status-codes.enum";
import { ApiError } from "../errors/api.errors";
import {
  IApplication,
  IApplicationCreate,
  IApplicationQuery,
  IApplicationUpdate,
} from "../interfaces/application.interface";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";
import { applicationRepository } from "../repositories/application.repository";

class ApplicationService {
  public async getAll(
    query: IApplicationQuery,
  ): Promise<IPaginatedResponse<IApplication>> {
    const [data, totalItems] = await applicationRepository.getAll(query);

    const totalPages = Math.ceil(totalItems / query.pageSize);
    return {
      totalItems,
      totalPages,
      prevPage: !!(query.page - 1),
      nextPage: query.page + 1 <= totalPages,
      data,
    };
  }

  public create(application: IApplicationCreate): Promise<IApplication> {
    return applicationRepository.create(application);
  }

  public async getById(id: string): Promise<IApplication> {
    const application = await applicationRepository.getById(id);

    if (!application) {
      throw new ApiError("Application not found", StatusCodesEnum.NOT_FOUND);
    }

    return application;
  }

  public async updateById(
    id: string,
    applicationNew: IApplicationUpdate,
    userId: string,
  ): Promise<IApplication> {
    const applicationInDB = await applicationRepository.getById(id);

    if (!applicationInDB) {
      throw new ApiError("Application not found", StatusCodesEnum.NOT_FOUND);
    }

    return await applicationRepository.updateById(id, {
      ...applicationNew,
      manager: userId,
    });
  }
}

export const applicationService = new ApplicationService();
