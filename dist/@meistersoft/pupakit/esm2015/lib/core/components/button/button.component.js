import { Component, Input } from '@angular/core';
export class ButtonComponent {
    constructor() {
        this.type = 'solid';
        this.size = 'medium';
        this.color = 'normal';
    }
    getResultClassList(prefix) {
        return [this.type, this.size, this.color].map(((innerProperty) => `${prefix}${innerProperty}`));
    }
}
ButtonComponent.decorators = [
    { type: Component, args: [{
                selector: 'pupa-button',
                template: "<button class=\"button\" [ngClass]=\"getResultClassList('button_')\">\n  <span class=\"button__text\">\n    <ng-content></ng-content>\n  </span>\n</button>\n",
                styles: [".button{box-sizing:border-box;font-family:effra;cursor:pointer;padding:0;display:inline-flex;flex-direction:row;align-items:center;justify-content:space-evenly;flex-wrap:nowrap}.button_large{min-width:7rem;height:2.5rem;border-radius:1rem;padding:.625rem .8125rem}.button_large .button__text{font-size:1rem;font-weight:500;line-height:1}.button_medium{min-width:7rem;height:2rem;border-radius:.875rem;padding:.375rem 1rem}.button_medium .button__text{font-size:1rem;font-weight:500;line-height:1}.button_small{min-width:4rem;height:1.5rem;border-radius:.5rem;padding:.1875rem .625rem}.button_small .button__text{font-size:.875rem;font-weight:400;line-height:1.14}.button_solid.button_normal{border:none;background:#0a0d65}.button_solid.button_normal .button__text{color:#fff}.button_solid.button_negative{border:none;background:red}.button_solid.button_negative .button__text{color:#fff}.button_solid.button_positive{border:none;background:#00c902}.button_solid.button_positive .button__text{color:#fff}.button_solid.button_alert{border:none;background:#ffc009}.button_solid.button_alert .button__text{color:#fff}.button_outlined.button_normal{border:.0625rem solid #0a0d65;background:#fff}.button_outlined.button_normal .button__text{color:#0a0d65}.button_outlined.button_negative{border:.0625rem solid red;background:#fff}.button_outlined.button_negative .button__text{color:#202020}.button_outlined.button_positive{border:.0625rem solid #00c902;background:#fff}.button_outlined.button_positive .button__text{color:#202020}.button_outlined.button_alert{border:.0625rem solid #ffc009;background:#fff}.button_outlined.button_alert .button__text{color:#202020}.button_link{border:none;background:#fff}.button_link .button__text{color:#0a0d65}"]
            }] }
];
ButtonComponent.propDecorators = {
    type: [{ type: Input }],
    size: [{ type: Input }],
    color: [{ type: Input }]
};
if (false) {
    ButtonComponent.prototype.type;
    ButtonComponent.prototype.size;
    ButtonComponent.prototype.color;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BtZWlzdGVyc29mdC9wdXBha2l0LyIsInNvdXJjZXMiOlsibGliL2NvcmUvY29tcG9uZW50cy9idXR0b24vYnV0dG9uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQVVqRCxNQUFNLE9BQU8sZUFBZTtJQUw1QjtRQU1rQixTQUFJLEdBQWUsT0FBTyxDQUFDO1FBQzNCLFNBQUksR0FBZSxRQUFRLENBQUM7UUFDNUIsVUFBSyxHQUFnQixRQUFRLENBQUM7SUFLaEQsQ0FBQztJQUhRLGtCQUFrQixDQUFDLE1BQWM7UUFDdEMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsYUFBcUIsRUFBRSxFQUFFLENBQUMsR0FBRyxNQUFNLEdBQUcsYUFBYSxFQUFFLEVBQUMsQ0FBQztJQUN4RyxDQUFDOzs7WUFaRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGFBQWE7Z0JBQ3ZCLHlLQUFzQzs7YUFFdkM7OzttQkFFRSxLQUFLO21CQUNMLEtBQUs7b0JBQ0wsS0FBSzs7O0lBRk4sK0JBQTJDO0lBQzNDLCtCQUE0QztJQUM1QyxnQ0FBOEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCB0eXBlIEJ1dHRvblR5cGUgPSAnc29saWQnIHwgJ291dGxpbmVkJyB8ICdsaW5rJztcbmV4cG9ydCB0eXBlIEJ1dHRvblNpemUgPSAnbGFyZ2UnIHwgJ21lZGl1bScgfCAnc21hbGwnO1xuZXhwb3J0IHR5cGUgQnV0dG9uQ29sb3IgPSAnbm9ybWFsJyB8ICduZWdhdGl2ZScgfCAncG9zaXRpdmUnIHwgJ2FsZXJ0JztcbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3B1cGEtYnV0dG9uJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2J1dHRvbi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2J1dHRvbi5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIEJ1dHRvbkNvbXBvbmVudCB7XG4gIEBJbnB1dCgpIHB1YmxpYyB0eXBlOiBCdXR0b25UeXBlID0gJ3NvbGlkJztcbiAgQElucHV0KCkgcHVibGljIHNpemU6IEJ1dHRvblNpemUgPSAnbWVkaXVtJztcbiAgQElucHV0KCkgcHVibGljIGNvbG9yOiBCdXR0b25Db2xvciA9ICdub3JtYWwnO1xuXG4gIHB1YmxpYyBnZXRSZXN1bHRDbGFzc0xpc3QocHJlZml4OiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIFt0aGlzLnR5cGUsIHRoaXMuc2l6ZSwgdGhpcy5jb2xvcl0ubWFwKChpbm5lclByb3BlcnR5OiBzdHJpbmcpID0+IGAke3ByZWZpeH0ke2lubmVyUHJvcGVydHl9YCk7XG4gIH1cbn1cbiJdfQ==