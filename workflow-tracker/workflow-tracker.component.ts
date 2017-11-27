import { Component, OnInit, OnDestroy, OnChanges, Renderer, ViewChild, ElementRef, Input } from "@angular/core";
import { WorkflowTrackerBean,WorkflowActvityTrackerBean} from "../../../processing-on-the-fly/service/potf.service";
import { WorkflowTrackerService } from "./workflow-tracker-service";

@Component({
    selector: 'workflow-tracker',
    templateUrl: 'static/app/modules/file-upload/component/workflow-tracker/workflow-tracker.component.html',
    providers: [WorkflowTrackerService],
    styles: [ `
    label.status{
        vertical-align: text-top;
        margin-bottom: 0 !important;
    }
    div.progress-container{
        width: 100%;
    }
    ` ]
})

export class WorkflowTrackerComponent implements OnInit {
    workflowTrackerBean: WorkflowTrackerBean= new WorkflowTrackerBean();
    trackerID: number;
    @Input() applyWorkflowID:number;
    @Input() isProgressShown:boolean;
    @Input() intervalvalue;

    constructor(private _workflowService: WorkflowTrackerService) { }

    ngOnInit() {
        
        this.workflowTrackerBean.activityList = [];
        this.refresh();

    }

    refresh(){
    	 console.log("show:" + this.isProgressShown);
    	 console.log("applyWorkflowID:" + this.applyWorkflowID);
    	 
         if (this.isProgressShown && this.applyWorkflowID) {
            this.trackerID = setInterval(() => {
                this.loadWorkflowTracker();
            }, this.intervalvalue);

        }
    }


    loadWorkflowTracker() {
        this._workflowService.getWorkflowTracker(this.applyWorkflowID).subscribe(
            response => {
                this.workflowTrackerBean = response;
                if (this.workflowTrackerBean.status === "Completed" || this.workflowTrackerBean.status === "Error") {
                    console.log("completed");
                    if (this.trackerID) {
                        clearInterval(this.trackerID);
                    }
                } else {
                    console.log("inprogress");
                }
            });


    }
}