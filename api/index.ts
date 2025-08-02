// api/index.ts
import { createServer, proxy } from 'aws-serverless-express'
import { Handler, Context, Callback } from 'aws-lambda'
import { AppModule } from '../src/app.module'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import * as express from 'express'

let cachedServer: Handler

async function bootstrap(): Promise<Handler> {
    const expressApp = express()
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp)
    )
    await app.init()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return createServer(expressApp)
}

export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback
) => {
    if (!cachedServer) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const server = await bootstrap()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        cachedServer = async (event, context, callback) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
            proxy(server, event, context)
    }
    return cachedServer(event, context, callback)
}
