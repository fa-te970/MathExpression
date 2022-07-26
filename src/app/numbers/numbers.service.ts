import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { INumber, IOperation } from "../app.interface";

@Injectable({
  providedIn: "root",
})
export class NumbersService {
  constructor(private httpClient: HttpClient) {}

  numbersURL: string = "assets/numbers.json";

  public getNumbers() {
    return this.httpClient.get<INumber[]>(this.numbersURL);
  }

  getSecondOperand(action: string): Observable<IOperation> {
    return this.httpClient.get<IOperation>(`assets/${action}.json`);
  }
}
