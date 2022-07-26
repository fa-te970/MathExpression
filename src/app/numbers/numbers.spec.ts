import { from } from "rxjs";
import { HttpClient } from "@angular/common/http";

import { NumbersService } from "../numbers/numbers.service";
import { INumber, IOperation } from "../app.interface";

describe("NumbersService", () => {
  let numberService: NumbersService;
  let httpClient: HttpClient;

  beforeEach(() => {
    numberService = new NumbersService(httpClient);
  });

  it("#getNumbers should return an Observable<INumber[]>", () => {
    let numbers: INumber[] = [
      { value: 1, action: "add" },
      { value: 2, action: "multiply" },
    ];

    spyOn(numberService, "getNumbers").and.callFake(() => {
      return from([numbers]);
    });

    numberService.getNumbers().subscribe((nums) => {
      expect(nums.length).toBe(2);
      expect(nums).toBe(numbers);
    });
  });

  it("#getSecondOperand should return an Observable<IOperation>", () => {
    let action = "add";
    let add: IOperation = { value: 4 };

    spyOn(numberService, "getSecondOperand").and.callFake(() => {
      return from([add]);
    });

    numberService.getSecondOperand(action).subscribe((data) => {
      expect(data).toBe(add);
    });
  });
});
