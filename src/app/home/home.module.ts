import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { HomeRoutingModule } from "./home-routing.module";
import { BarcodeScanner } from 'nativescript-barcodescanner';
import { HomeComponent } from "./home.component";
import { registerElement } from "nativescript-angular/element-registry";
registerElement("BarcodeScanner", () => require("nativescript-barcodescanner").BarcodeScannerView);
@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptUIListViewModule,
        NativeScriptUIDataFormModule,
        NativeScriptFormsModule,
        HomeRoutingModule
    ],
    declarations: [
        HomeComponent
    ],
    providers: [
        BarcodeScanner
      ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class HomeModule { }
