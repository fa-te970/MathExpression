import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  mergeMap,
  Observable,
  toArray,
  map,
  catchError,
  of,
  EMPTY,
} from "rxjs";

import { INumber, IExpression } from "../app.interface";
import { NumbersService } from "../numbers/numbers.service";
@Component({
  selector: "app-operationlist",
  templateUrl: "./operationlist.component.html",
  styleUrls: ["./operationlist.component.css"],
})
export class OperationlistComponent implements OnInit {
  public expressions$!: Observable<IExpression[]>;
  public numbers$!: Observable<INumber[]>;
  failedAdd: boolean = false;
  failedMultiply: boolean = false;

  constructor(
    private snackBar: MatSnackBar,
    private numberService: NumbersService
  ) {}

  ngOnInit() {
    this.numbers$ = this.numberService.getNumbers();

    this.expressions$ = this.numbers$.pipe(
      catchError((err) => {
        if (err.status === 404) {
          this.showServerError();
        }
        return EMPTY;
      }),
      mergeMap((numbers) => numbers),
      mergeMap((number) => {
        const number2$: Observable<IExpression> = this.numberService
          .getSecondOperand(number.action)
          .pipe(
            catchError((err) => {
              this.handleActionError(err.status, number);
              return of(err);
            }),
            map((number2) => {
              return {
                number1: number.value,
                action: number.action,
                number2: number2.value,
              };
            })
          );

        return number2$;
      }),
      toArray()
    );
  }

  getResult(exp: IExpression) {
    return exp.action === "add"
      ? exp.number1 + exp.number2
      : exp.number1 * exp.number2;
  }

  notExistData(expression: IExpression) {
    return (
      (expression.action === "add" && this.failedAdd) ||
      (expression.action === "multiply" && this.failedMultiply)
    );
  }

  showServerError() {
    this.snackBar.open("Server Error!", "", {
      duration: 4000,
      verticalPosition: "bottom",
      panelClass: ["error-snackbar"],
    });
  }

  handleActionError(errorStatus: number, number: INumber) {
    if (errorStatus === 404 && number.action === "add") {
      this.failedAdd = true;
    } else if (errorStatus === 404 && number.action === "multiply") {
      this.failedMultiply = true;
    }
  }
}
