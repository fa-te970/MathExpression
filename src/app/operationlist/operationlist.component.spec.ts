import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { from } from "rxjs";
import { HttpClient, HttpClientModule } from "@angular/common/http";

import { NumbersService } from "../numbers/numbers.service";
import { IExpression, INumber } from "../app.interface";
import { OperationlistComponent } from "./operationlist.component";

describe("OperationlistComponent", () => {
  let component: OperationlistComponent;
  let numberService: NumbersService;
  let fixture: ComponentFixture<OperationlistComponent>;
  let httpClient: HttpClient;
  let numbers: INumber[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationlistComponent],
      imports: [MatSnackBarModule, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationlistComponent);
    component = fixture.componentInstance;
    numberService = new NumbersService(httpClient);
    fixture.detectChanges();
    });

  //ngOnInit
  it("should set numbers$ with an observable of numbers returned from the server", () => {
    let numbers = [
      { value: 1, action: "add" },
      { value: 2, action: "multiply" },
      { value: 3, action: "add" },
      { value: 4, action: "add" },
      { value: 5, action: "multiply" },
      { value: 6, action: "multiply" }
    ];

    spyOn(numberService, "getNumbers").and.callFake(() => {
      return from([numbers]);
    });

    component.ngOnInit();
    component.numbers$.subscribe((data) => {
      expect(data).toEqual(numbers);
    });
  });

  it("should set expressions$ with an observable of expressions", () => {
    spyOn(numberService, "getNumbers").and.callFake(() => {
      return from([numbers]);
    });

    let add = { value: 5 };
    let multiply = { value: 10 };
    component.ngOnInit();
    let expressions: IExpression[] = [
      {
        number1: 1,
        action: "add",
        number2: add.value,
      },
      {
        number1: 2,
        action: "multiply",
        number2: multiply.value,
      },
      {
        number1: 3,
        action: "add",
        number2: add.value,
      },
      {
        number1: 4,
        action: "add",
        number2: add.value,
      },
      {
        number1: 5,
        action: "multiply",
        number2: multiply.value,
      },
      {
        number1: 6,
        action: "multiply",
        number2: multiply.value,
      },
    ];
    component.expressions$.subscribe((data) => {
      expect(data).toEqual(jasmine.arrayContaining(expressions));
      expect(data.length).toEqual(expressions.length);
    });
  });

  //notExistData
  it("should return True if the action is ADD and its file is missing", () => {
    let expression = { number1: 1, action: "add", number2: 5 };
    component.failedAdd = true;

    let result = component.notExistData(expression);
    expect(result).toEqual(true);
  });

  it("should return True if the action is MULTIPLY and its file is missing", () => {
    let expression = { number1: 1, action: "multiply", number2: 5 };
    component.failedMultiply = true;

    let result = component.notExistData(expression);
    expect(result).toEqual(true);
  });

  it("should return False if there are both action files", () => {
    let expression = { number1: 1, action: "multiply", number2: 5 };
    component.failedMultiply = false;
    component.failedAdd = false;

    let result = component.notExistData(expression);
    expect(result).toEqual(false);
  });

  //getResult
  it("should return sum of two numbers if action is ADD", () => {
    let expression = { number1: 1, action: "add", number2: 5 };
    let result = component.getResult(expression);
    expect(result).toEqual(6);
  });

  it("should return multiply of two numbers if action is MULTIPLY", () => {
    let expression = { number1: 2, action: "multiply", number2: 5 };
    let result = component.getResult(expression);
    expect(result).toEqual(expression.number1 * expression.number2);
  });

  //handleActionError
  it("should set failedAdd to True if get error with status 404 and the action is ADD", () => {
    component.failedAdd = false;
    let errorStatus = 404;
    let num: INumber = { value: 1, action: "add" };
    component.handleActionError(errorStatus, num);
    expect(component.failedAdd).toEqual(true);
  });

  it("should set failedMultiply to True if get error with status 404 and the action is MULTIPLY", () => {
    component.failedMultiply = false;
    let errorStatus = 404;
    let num: INumber = { value: 1, action: "multiply" };
    component.handleActionError(errorStatus, num);
    expect(component.failedMultiply).toEqual(true);
  });
});
