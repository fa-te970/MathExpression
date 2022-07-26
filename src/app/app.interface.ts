export interface INumber {
  value: number;
  action: string;
}

export interface IOperation {
  value: number;
}

export interface IExpression {
  number1: number;
  action: string;
  number2: number;
}
