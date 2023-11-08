import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotkeyComponent } from './components/hotkey/hotkey.component';
import { HotkeysComponent } from './components/hotkeys/hotkeys.component';

@NgModule({
  declarations: [HotkeyComponent, HotkeysComponent],
  exports: [HotkeyComponent, HotkeysComponent],
  imports: [CommonModule],
})
export class PupaHotkeyModule {}
