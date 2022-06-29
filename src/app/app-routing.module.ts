import { NgModule }                from '@angular/core';
import { RouterModule, Routes }    from '@angular/router';
import { SysComponent }            from './sys/sys.component';
import { CovidDashboardComponent } from './sys/tab/covid-dashboard/covid-dashboard.component';




const routes: Routes = [
	{
		path      : '',
		redirectTo: 'sys',
		pathMatch : 'full'
	},
	{
		path     : 'sys',
		component: SysComponent,
		children: [
			{
				path: 'map',
				component: CovidDashboardComponent
			}
		]
	}
];

@NgModule({
	          imports: [
		          RouterModule.forRoot(routes)
	          ],
	          exports: [ RouterModule ]
          })
export class AppRoutingModule {}
