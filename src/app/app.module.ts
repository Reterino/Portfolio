import { NgModule }                from '@angular/core';
import { BrowserModule }           from '@angular/platform-browser';
import { AppComponent }            from './app.component';
import { SysComponent }            from './sys/sys.component';
import { RouterModule }            from '@angular/router';
import { AppRoutingModule }        from './app-routing.module';
import { CovidDashboardComponent } from './sys/tab/covid-dashboard/covid-dashboard.component';




@NgModule({
	          declarations: [
		          AppComponent,
		          SysComponent,
		          CovidDashboardComponent
	          ],
	          imports     : [
		          BrowserModule,
		          RouterModule,
		          AppRoutingModule
	          ],
	          providers   : [],
	          bootstrap   : [ AppComponent ]
          })
export class AppModule {}
