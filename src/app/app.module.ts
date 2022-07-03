import { NgModule }                from '@angular/core';
import { BrowserModule }           from '@angular/platform-browser';
import { AppComponent }            from './app.component';
import { SysComponent }            from './sys/sys.component';
import { RouterModule }            from '@angular/router';
import { AppRoutingModule }        from './app-routing.module';
import { CovidDashboardComponent } from './sys/tab/covid-dashboard/covid-dashboard.component';
import { HttpClientModule }        from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule }        from '@angular/material/tooltip';
import { LibModule }               from './lib/lib.module';




@NgModule({
	          declarations: [
		          AppComponent,
		          SysComponent,
		          CovidDashboardComponent
	          ],
	          imports     : [
		          LibModule,
		          BrowserModule,
		          RouterModule,
		          AppRoutingModule,
		          HttpClientModule,
		          BrowserAnimationsModule,
		          MatTooltipModule
	          ],
	          providers   : [],
	          bootstrap   : [ AppComponent ]
          })
export class AppModule {}
