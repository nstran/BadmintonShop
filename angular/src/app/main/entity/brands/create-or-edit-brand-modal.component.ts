﻿import { Component, ViewChild, Injector, Output, EventEmitter, OnInit, ElementRef} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { BrandsServiceProxy, CreateOrEditBrandDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditBrandModal',
    templateUrl: './create-or-edit-brand-modal.component.html'
})
export class CreateOrEditBrandModalComponent extends AppComponentBase implements OnInit{
   
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    brand: CreateOrEditBrandDto = new CreateOrEditBrandDto();

    imageName = '';



    constructor(
        injector: Injector,
        private _brandsServiceProxy: BrandsServiceProxy
    ) {
        super(injector);
    }
    
    show(brandId?: number): void {
    

        if (!brandId) {
            this.brand = new CreateOrEditBrandDto();
            this.brand.id = brandId;
            this.imageName = '';


            this.active = true;
            this.modal.show();
        } else {
            this._brandsServiceProxy.getBrandForEdit(brandId).subscribe(result => {
                this.brand = result.brand;

                this.imageName = result.imageName;


                this.active = true;
                this.modal.show();
            });
        }
        
        
    }

    save(): void {
            this.saving = true;
            
			
			
            this._brandsServiceProxy.createOrEdit(this.brand)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }


    setImageIdNull() {
        this.brand.imageId = null;
        this.imageName = '';
    }
    close(): void {
        this.active = false;
        this.modal.hide();
    }
    
     ngOnInit(): void {
        
     }    
}
