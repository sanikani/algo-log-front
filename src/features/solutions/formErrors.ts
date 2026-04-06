import type { FieldErrorDetail } from '../../types/api'

export function getFieldError(
  errors: FieldErrorDetail[] | undefined,
  fieldName: string,
) {
  return errors?.find((error) => error.field === fieldName)?.reason
}
