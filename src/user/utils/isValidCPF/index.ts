import { registerDecorator, ValidationOptions } from 'class-validator'
import cpfValidator from '../cpfValidator'

export function isValidCPF(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isValidCPF',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    return typeof value === 'string' && cpfValidator(value)
                },
                defaultMessage() {
                    return 'CPF inválido'
                }
            }
        })
    }
}
