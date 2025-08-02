import { Request } from 'express'

export interface AuthenticatedRequest extends Request {
    cookies: {
        [x: string]: any
        jwt?: string
    }
    user?: any
}

type CreditsValues = {
    id: number
    store_book_id: number
    type: string
    person: string
}

export interface BookSpecific {
    summary: string
    isbn: string
    pageQuant: string
    tags: string
    width: string
    store_books_credits: CreditsValues[]
    title: string
    photo: string
    id?: number
    price: number
}

export interface Books {
    link: string
    title: string
    descBooks: string
    photo: string
    id?: number
    price: number
}

export interface BooksFromStore extends Omit<Books, 'link'> {
    title: string
    descBooks: string
    photo: string
    id?: number
    price: number
}
