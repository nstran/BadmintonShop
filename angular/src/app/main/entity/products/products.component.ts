﻿import {AppConsts} from '@shared/AppConsts';
import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { ProductsServiceProxy, ProductDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditProductModalComponent } from './create-or-edit-product-modal.component';

import { ViewProductModalComponent } from './view-product-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';


@Component({
    templateUrl: './products.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ProductsComponent extends AppComponentBase {
    
    
    @ViewChild('createOrEditProductModal', { static: true }) createOrEditProductModal: CreateOrEditProductModalComponent;
    @ViewChild('viewProductModalComponent', { static: true }) viewProductModal: ViewProductModalComponent;   
    
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    nameFilter = '';
    madeInFilter = '';
    codeFilter = '';
    maxPriceFilter : number;
		maxPriceFilterEmpty : number;
		minPriceFilter : number;
		minPriceFilterEmpty : number;
    maxInStockFilter : number;
		maxInStockFilterEmpty : number;
		minInStockFilter : number;
		minInStockFilterEmpty : number;
    descriptionFilter = '';
    titleFilter = '';
        imageNameFilter = '';
        brandNameFilter = '';
        categoryNameFilter = '';






    constructor(
        injector: Injector,
        private _productsServiceProxy: ProductsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getProducts(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._productsServiceProxy.getAll(
            this.filterText,
            this.nameFilter,
            this.madeInFilter,
            this.codeFilter,
            this.maxPriceFilter == null ? this.maxPriceFilterEmpty: this.maxPriceFilter,
            this.minPriceFilter == null ? this.minPriceFilterEmpty: this.minPriceFilter,
            this.maxInStockFilter == null ? this.maxInStockFilterEmpty: this.maxInStockFilter,
            this.minInStockFilter == null ? this.minInStockFilterEmpty: this.minInStockFilter,
            this.descriptionFilter,
            this.titleFilter,
            this.imageNameFilter,
            this.brandNameFilter,
            this.categoryNameFilter,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createProduct(): void {
        this.createOrEditProductModal.show();        
    }


    deleteProduct(product: ProductDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._productsServiceProxy.delete(product.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._productsServiceProxy.getProductsToExcel(
        this.filterText,
            this.nameFilter,
            this.madeInFilter,
            this.codeFilter,
            this.maxPriceFilter == null ? this.maxPriceFilterEmpty: this.maxPriceFilter,
            this.minPriceFilter == null ? this.minPriceFilterEmpty: this.minPriceFilter,
            this.maxInStockFilter == null ? this.maxInStockFilterEmpty: this.maxInStockFilter,
            this.minInStockFilter == null ? this.minInStockFilterEmpty: this.minInStockFilter,
            this.descriptionFilter,
            this.titleFilter,
            this.imageNameFilter,
            this.brandNameFilter,
            this.categoryNameFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
    
    
    
    
    
}
