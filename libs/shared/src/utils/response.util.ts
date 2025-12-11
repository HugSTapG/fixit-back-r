import { BaseResponseDto } from '../dto/base-response.dto';

export class ResponseUtil {
    static success<T>(data?: T, message?: string): BaseResponseDto<T> {
        return BaseResponseDto.success(data, message);
    }

    static error(error: string, message?: string): BaseResponseDto {
        return BaseResponseDto.error(error, message);
    }

    static paginated<T>(
        data: T[],
        total: number,
        page: number,
        limit: number,
        message?: string
    ): BaseResponseDto<any> {
        return BaseResponseDto.success({
            items: data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1,
            }
        }, message);
    }
}
