import { Pipe } from '@angular/core';
import { isNullOrUndefined } from './../../helpers/is-null-or-undefined.helper';
export class IsNullOrUndefinedPipe {
    transform(entity) {
        return isNullOrUndefined(entity);
    }
}
IsNullOrUndefinedPipe.decorators = [
    { type: Pipe, args: [{
                name: 'isNullOrUndefined'
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXMtbnVsbC1vci11bmRlZmluZWQucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BtZWlzdGVyc29mdC9wdXBha2l0LyIsInNvdXJjZXMiOlsibGliL3NoYXJlZC9waXBlcy9pcy1udWxsLW9yLXVuZGVmaW5lZC5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBRXBELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBS2hGLE1BQU0sT0FBTyxxQkFBcUI7SUFDekIsU0FBUyxDQUFDLE1BQWU7UUFDOUIsT0FBTyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuQyxDQUFDOzs7WUFORixJQUFJLFNBQUM7Z0JBQ0osSUFBSSxFQUFFLG1CQUFtQjthQUMxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgaXNOdWxsT3JVbmRlZmluZWQgfSBmcm9tICcuLy4uLy4uL2hlbHBlcnMvaXMtbnVsbC1vci11bmRlZmluZWQuaGVscGVyJztcblxuQFBpcGUoe1xuICBuYW1lOiAnaXNOdWxsT3JVbmRlZmluZWQnXG59KVxuZXhwb3J0IGNsYXNzIElzTnVsbE9yVW5kZWZpbmVkUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICBwdWJsaWMgdHJhbnNmb3JtKGVudGl0eTogdW5rbm93bik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpc051bGxPclVuZGVmaW5lZChlbnRpdHkpO1xuICB9XG59XG4iXX0=