import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotkeyDemoComponent } from './hotkey-demo.component';

const routes: Routes = [
  {
    path: '',
    component: HotkeyDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HotkeyDemoRoutingModule {}
