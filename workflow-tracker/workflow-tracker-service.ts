import { Injectable } from "@angular/core"
import { Http } from "@angular/http"
import 'rxjs/add/operator/map';

@Injectable()
export class WorkflowTrackerService {

    constructor(private http: Http) { }

    getWorkflowTracker(applyWorkflowID: number) {
        return this.http.get('rest/workflow/tracker?applyWorkflowID=' + applyWorkflowID).map(response => response.json());
    }

}