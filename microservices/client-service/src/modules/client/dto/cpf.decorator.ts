import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";
import { cpf } from "cpf-cnpj-validator";

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "isCPF",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== "string") {
            return false;
          }
          return cpf.isValid(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ser um CPF válido no formato XXX.XXX.XXX-XX`;
        },
      },
    });
  };
}
