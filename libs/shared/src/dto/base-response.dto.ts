export class BaseResponseDto<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: any;       // <-- add this
  timestamp: string;
  path?: string;
  method?: string;     // optional: for consistency
  correlationId?: string; // optional

  constructor(success: boolean, data?: T, message?: string, error?: string, details?: any) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.error = error;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data?: T, message?: string): BaseResponseDto<T> {
    return new BaseResponseDto(true, data, message);
  }

  static error(error: string, message?: string, details?: any): BaseResponseDto {
    return new BaseResponseDto(false, undefined, message, error, details);
  }
}

