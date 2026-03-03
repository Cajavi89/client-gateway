import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const rpcError = exception.getError();
    const rpcErrorString =
      typeof rpcError === 'string' ? rpcError : JSON.stringify(rpcError);

    if (rpcErrorString.includes('Empty response')) {
      return response.status(500).json({
        status: 500,
        message: rpcErrorString.substring(0, rpcErrorString.indexOf('(') - 1),
      });
    }

    if (
      typeof rpcError === 'object' &&
      rpcError !== null &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const error = rpcError as { status: number; message: string };

      response.status(error.status).json(error);
      return;
    }

    response.status(400).json({
      status: 400,
      message: rpcError,
    });
  }
}
