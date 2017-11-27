import {
    Component, OnInit, OnDestroy, OnChanges, Renderer, ViewChild, ElementRef, Input, Output,
    EventEmitter
} from "@angular/core";
import { AitFileuploadService } from "../../service/ait-fileupload.service"
@Component({
    selector: 'dynamic-form',
    templateUrl: 'static/app/modules/file-upload/component/dynamic-form/dynamic-form.component.html',
    styleUrls: [ 'static/app/modules/file-upload/component/dynamic-form/dynamic-form.component.css' ],
    providers: [ AitFileuploadService ]
})

export class DynamicFormComponent implements OnInit{
    formValidator = [];
    hasErrorForm : boolean = false;
    @Output() emitFormValidation: EventEmitter<any> = new EventEmitter();
    @Input() tagset;
    @Output() modalEmitter: EventEmitter = new EventEmitter();
    constructor( private requestForm: AitFileuploadService ){

    }

    ngOnInit(){
    }

    openModal(){
        this.modalEmitter.emit();
    }

    testEmit( event ){
        console.log('event', event)
        if( event && event.update ){
            this.formValidator.filter( res =>{
                if( res.field == event.field )res.hasError = event.data.hasError;
            })
        }
        if( event && ! event.update ) this.formValidator.push( event );
        console.log('arr', this.formValidator );
        this.hasErrorForm = false;
        this.formValidator.filter( res=>{
            if( res.hasError == true )  this.hasErrorForm = true;
        })
        this.emitFormValidation.emit(this.hasErrorForm );
    }

    toEmit( bool: boolean ){
        this.emitFormValidation.emit( bool );
    }

}