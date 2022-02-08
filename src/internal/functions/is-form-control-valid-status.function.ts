import { FormControlStatus } from '../declarations/enums/form-control-status.enum';

const VALID_STATUSES: FormControlStatus[] = [FormControlStatus.VALID, FormControlStatus.PENDING];

export const isFormControlValidStatus = (status: FormControlStatus): boolean => VALID_STATUSES.includes(status);
