import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'
import helmet from 'helmet'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',')

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
        allowedHeaders: ['Content-Type', 'CSRF-Token', 'authorization'],
        credentials: true
    })

    await app.listen(process.env.PORT ?? 3000)

    //DEPOIS CONFIGURAR O LIMITE DE REQUISIÇÕES PARA ROTAS
}
bootstrap()
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
