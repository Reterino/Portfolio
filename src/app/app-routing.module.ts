import { NgModule }                from '@angular/core';
import { RouterModule, Routes }    from '@angular/router';
import { SysComponent }            from './sys/sys.component';
import { CovidDashboardComponent } from './sys/covid-dashboard/covid-dashboard.component';




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
			},
			{
				path      : '**',
				redirectTo: 'map',
				pathMatch : 'full'
			},
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
