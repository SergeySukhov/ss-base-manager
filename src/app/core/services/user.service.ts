import { Injectable } from "@angular/core";
import { EndpointService } from "./endpoint.service";


@Injectable()
export class UserService {
    constructor(private endpointService: EndpointService) {
    }

}
