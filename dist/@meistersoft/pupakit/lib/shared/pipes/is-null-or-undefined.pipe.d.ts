import { PipeTransform } from '@angular/core';
export declare class IsNullOrUndefinedPipe implements PipeTransform {
    transform(entity: unknown): boolean;
}
