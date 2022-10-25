import { FormControlStatus } from '@angular/forms';

const VALID_STATUSES: FormControlStatus[] = ['VALID', 'PENDING'];

export const isFormControlValidStatus = (status: FormControlStatus): boolean => VALID_STATUSES.includes(status);
