import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnChanges,
    OnInit,
    Output,
    Renderer,
    ViewChild
} from "@angular/core";

import {Subject} from "rxjs/Subject";
import {CaseFieldOptionDTO} from "../../../processing-on-the-fly/service/masstag.service";

@Component({
    selector: 'dropdown',
    host: { '(document:click)': 'onClick($event)' },
    templateUrl: 'static/app/modules/file-upload/component/dropdown/dropdown.component.html',
    styleUrls: [ 'static/app/modules/file-upload/component/dropdown/dropdown.component.css' ]
})
export class DropdownComponent implements OnInit, OnChanges{
    filterTxt: string;
    value: string = "";
    showDropdown: boolean = false;
    @Input() placeholder: string;
    @Input() object;
    @Input() optionLabel: string;
    @Input() optionValue: string;
    @Input() autocomplete: boolean = false;
    @Input() defaultValueID: any;
    @Input() defaultValueObject: CaseFieldOptionDTO = new CaseFieldOptionDTO();
    @Output() emitItem: EventEmitter<any> = new EventEmitter();
    constructor( private _eref: ElementRef, private zone: NgZone) {}
    ngOnInit() {
        console.log('input obj', this.object);
        if( this.defaultValueID ) {
            let value: number;
            this.onClickSelectItem( this.object.find( res =>{ return this.selectedItem( res ) } ) );
        }
        if( this.defaultValueObject.fieldOptionObjectId ) this.onClickSelectItem( this.defaultValueObject );
    }

    selectedItem( selected ){
        let value: number
        if( typeof( this.defaultValueID ) == "string" ) value = parseInt(this.defaultValueID);
        else value = this.defaultValueID;
        return selected.fieldObjectId = value;
    }
    ngOnChanges() {}
    onClick( event ){
        if (!this._eref.nativeElement.contains(event.target)) {
            if( this.showDropdown ) this.run();
        }
    }
    run(){
        this.zone.run( () =>{
            this.showDropdown = false;
        })
    }

    onClickSelectItem( selected ){
        console.log('selected', selected );
        if( this.value == selected.fieldOptionLabel ) return;
        this.value = selected[this.optionLabel];
        this.emitItem.emit( selected[this.optionValue] );
        this.run();
    }
    toggleCollapse(){
        this.showDropdown = !this.showDropdown;
    }

}