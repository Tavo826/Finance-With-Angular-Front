import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { EditTransactionComponent } from './edit-transaction/edit-transaction.component';
import { ViewTransactionComponent } from './view-transaction/view-transaction.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddTransactionComponent,
    EditTransactionComponent,
    ViewTransactionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
