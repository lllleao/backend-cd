import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule)
    const staticDirectory = join(__dirname, '..', 'public')
    app.useStaticAssets(staticDirectory)

    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',')

    app.use(cookieParser())
    app.use(helmet())
    app.use(
        helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'"],
                imgSrc: ["'self'"],
                connectSrc: ["'self'"],
                frameSrc: ["'none'"],
                objectSrc: ["'none'"],
                baseUri: ["'self'"],
                formAction: ["'self'"]
            }
        })
    )

    app.enableCors({
        origin: function (origin: string, callback: any) {
            if (!origin || allowedOrigins?.indexOf(origin) !== -1) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                callback(null, true)
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                callback(new Error('Not allowed by CORS'))
            }
        },
        methods: 'GET,POST,OPTIONS,DELETE,PATCH',
        allowedHeaders: ['Content-Type', 'csrf-token', 'authorization'],
        credentials: true
    })

    await app.listen(process.env.PORT ?? 3000, '0.0.0.0')
}
bootstrap()
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
