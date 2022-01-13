import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinkDemoComponent } from './link-demo.component';

const routes: Routes = [{ path: '', component: LinkDemoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LinkDemoRoutingModule {}
