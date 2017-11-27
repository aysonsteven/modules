import {Component, OnInit, OnChanges, OnDestroy, ViewChild, ElementRef, Renderer, Input, Output, EventEmitter } from "@angular/core"
import { CaseParticipantDTO  } from "../../service/ait-fileupload.service";
import { DynamicInputsService } from "../../service/dynamic-inputs.service"
import {CaseFieldOptionDTO} from "../../../processing-on-the-fly/service/masstag.service";

@Component({
    selector: 'dynamic-input',
    templateUrl: 'static/app/modules/file-upload/component/dynamic-inputs/dynamic-inputs.component.html',
    styleUrls: [ 'static/app/modules/file-upload/component/dynamic-inputs/dynamic-inputs.component.css' ],
    providers: [ DynamicInputsService ]
})

export class DynamicInputsComponent implements OnInit, OnChanges{
    caseParticipant: CaseParticipantDTO = new CaseParticipantDTO()
    hasError: boolean = false;
    nullValue: string = null;
    alumniPhotoPath: string = "static/resources/img/user-profile.png";
    alumnusPhotoPath: string = "static/resources/img/user-profile.png";
    validateObject: validator = new validator();
    @Output() emitValidations: EventEmitter<any> = new EventEmitter();
    @ViewChild( 'modal' ) modal;
    @ViewChild('img') image: ElementRef;
    @ViewChild( 'inputs' ) inputs: ElementRef;
    @ViewChild( 'select' ) select;
    @ViewChild( 'txtarea' ) txtarea: ElementRef;
    @Output() openModal: EventEmitter<any> = new EventEmitter();
    @Input() inputObject;
    constructor(
        private renderer: Renderer,
        private dynamicInputService: DynamicInputsService,
        private _eref: ElementRef
    ){}

    ngOnInit(){
        this.inputObject.defaultValue = "";
        this.inputObject.checkboxIsModify=true;
        this.checkValidated();
    }

    ngOnChanges( changes: any ){

    }
    onClickShowModal(){
        console.log('modal', this.inputObject.defaultValue );

        if (this.inputObject.defaultValue && this.inputObject.defaultValue!==""){
            this.getParticipant(this.inputObject.defaultValue);
        }else{
            this.caseParticipant = new CaseParticipantDTO();
        }
        this.modal.show();
    }

    getParticipant(participantID: number){
        this.dynamicInputService.getParticipant(participantID,response => {
            this.caseParticipant = response;
        }, fail => {
            console.log(fail);
        });
    }
    get isInvalid(  ): boolean{
        return (
            !this.caseParticipant.participantLastName ||
            !this.caseParticipant.participantFirstName ||
            !this.caseParticipant.customText1 ||
            !this.caseParticipant.participantEmailAddress ||
            !this.caseParticipant.customText2
        );
    }
    refreshFieldOptionsWithDefault(defaultObj : any){
        this.dynamicInputService.getOptions(this.inputObject.fieldObjectId,response => {
            this.inputObject.fieldOptions = response.fieldOptions;
            
            this.select.onClickSelectItem(defaultObj);
            
        }, fail => {
            console.log(fail);
        });
    }

    getFieldOptions(){
        this.dynamicInputService.getOptions(this.inputObject.fieldObjectId,response => {
            this.inputObject.fieldOptions = response.fieldOptions;
        }, fail => {
            console.log(fail);
        });
    }


    onClickSave(){
        if( this.isInvalid ) return;
        this.dynamicInputService.saveParticipant( this.caseParticipant, res =>{
            this.modal.close();

            let optionObj =new CaseFieldOptionDTO();
            optionObj.fieldOptionObjectId=res.participantObjectID;
            optionObj.fieldOptionLabel=res.participantName;

            this.refreshFieldOptionsWithDefault(optionObj);
        
         
        }, error =>{ console.log('error', error)})
        
       
    }
    onClickCancel(){
        this.modal.close();
    }
    validate( isRequired: boolean ){
        console.log('isreq', isRequired);
        console.log('select', this.select);

        if( isRequired && !this.inputObject.defaultValue ){
            if( this.inputs ) this.validationRenderer( this.inputs );
            else if( this.select ) this.validationRenderer( this.select );
            else if( this.txtarea ) this.validationRenderer( this.txtarea )
        }

        if( isRequired && !this.inputObject.defaultValue && this.inputs ) {
            // this.renderer.setElementClass( this.inputs.nativeElement, 'error', true );
            // this.hasError = this.validateObject.hasError = true
            this.validationRenderer( this.inputs );
        }
        else if( isRequired && !this.inputObject.defaultValue && this.select ) {
            console.log('select');
            // this.renderer.setElementClass( this.select.nativeElement, 'error', true );
            // this.hasError = this.validateObject.hasError = true;
            this.validationRenderer( this.select );
        }
        this.emitValidations.emit(  );
    }
    validationRenderer( field ){
        this.renderer.setElementClass( field.nativeElement, 'error', true );
        this.hasError = this.validateObject.hasError = true
    }
    testMouseOver(){
        console.log('mouseover');
    }
    validateInputs(){}
    validateSelect(){}
    checkValidated(){
        this.validateObject.field = this.inputObject['fieldName'];
        if( this.inputObject['isRequired'] ) this.validateObject.hasError = true;
        // console.log('validate',  );
        this.emitValidations.emit( this.validateObject );
    }
    change(){
        this.validateObject.hasError = true;
        if( this.inputs ) {
                this.renderer.setElementClass( this.inputs.nativeElement, 'error', false );
                this.hasError = this.validateObject.hasError = false;
        }
        if( this.select ) {
            console.log( this.select );
                this.renderer.setElementClass( this._eref.nativeElement, 'error', false );
                this.hasError = this.validateObject.hasError = false;
        }
        if( this.txtarea ){
            this.renderer.setElementClass( this.txtarea.nativeElement, 'error', false );
            this.hasError = this.validateObject.hasError = false;
        }
        this.emitValidations.emit( {update:true, data: this.validateObject } );
    }

    getInputType( type: string ){
        if( type == 'Radio' )  return 'radio';
        else if( type == 'TextBox' ) return 'text';
        else if( type == 'TextArea' ) {
            if( this.inputs )this.renderer.setElementClass( this.inputs.nativeElement, 'not-visible', true);
            return 'text';
        }
    }

    onChangeAlumnusPhoto(event) {
        console.log('asd', event);
        let file =  event.target.files[0];
        let reader = new FileReader();
        // if (file.size > 20000) return alert(file.size);
        reader.addEventListener("load", () => {
            this.renderer.setElementAttribute(this.image.nativeElement, 'src', reader.result);
        }, false)
        if (file) reader.readAsDataURL(file);
    }

}


class validator{
    field: string;
    hasError: boolean = false;
    constructor(){}
}