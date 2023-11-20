import { AppRequest } from '../models';
import {BadRequestException} from "@nestjs/common";

/**
 * @param {AppRequest} request
 * @returns {string}
 */
export function getUserIdFromRequest(request: AppRequest): string {
  if (typeof request.query.userId === 'string')
    return request.query && request.query.userId;
  throw new BadRequestException('User id is not valid');
}
