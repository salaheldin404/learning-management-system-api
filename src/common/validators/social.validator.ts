
export function socialValidator(regex: RegExp, label: string, example: string) {
  return {
    validator: (value: string) => value === "" || regex.test(value),
    message: `Please provide a valid ${label} username (${example})`,
  };
}