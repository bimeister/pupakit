import { Pipe } from '@angular/core';
import { isNullOrUndefined } from 'src/lib/helpers/is-null-or-undefined.helper';
var IsNullOrUndefinedPipe = (function () {
    function IsNullOrUndefinedPipe() {
    }
    IsNullOrUndefinedPipe.prototype.transform = function (entity) {
        return isNullOrUndefined(entity);
    };
    IsNullOrUndefinedPipe.decorators = [
        { type: Pipe, args: [{
                    name: 'isNullOrUndefined'
                },] }
    ];
    return IsNullOrUndefinedPipe;
}());
export { IsNullOrUndefinedPipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXMtbnVsbC1vci11bmRlZmluZWQucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BtZWlzdGVyc29mdC9wdXBha2l0LyIsInNvdXJjZXMiOlsibGliL3NoYXJlZC9waXBlcy9pcy1udWxsLW9yLXVuZGVmaW5lZC5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBQ3BELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBRWhGO0lBQUE7SUFPQSxDQUFDO0lBSFEseUNBQVMsR0FBaEIsVUFBaUIsTUFBZTtRQUM5QixPQUFPLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25DLENBQUM7O2dCQU5GLElBQUksU0FBQztvQkFDSixJQUFJLEVBQUUsbUJBQW1CO2lCQUMxQjs7SUFLRCw0QkFBQztDQUFBLEFBUEQsSUFPQztTQUpZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGlzTnVsbE9yVW5kZWZpbmVkIH0gZnJvbSAnc3JjL2xpYi9oZWxwZXJzL2lzLW51bGwtb3ItdW5kZWZpbmVkLmhlbHBlcic7XG5cbkBQaXBlKHtcbiAgbmFtZTogJ2lzTnVsbE9yVW5kZWZpbmVkJ1xufSlcbmV4cG9ydCBjbGFzcyBJc051bGxPclVuZGVmaW5lZFBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgcHVibGljIHRyYW5zZm9ybShlbnRpdHk6IHVua25vd24pOiBib29sZWFuIHtcbiAgICByZXR1cm4gaXNOdWxsT3JVbmRlZmluZWQoZW50aXR5KTtcbiAgfVxufVxuIl19