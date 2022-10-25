import { isEmpty, isNil, Nullable } from '@bimeister/utilities';

export function getInitials(name: Nullable<string>): string {
  if (isNil(name)) {
    return '';
  }
  const nameSectionsList: string[] = name.trim().split(' ');
  const notEmptyNameSectionsList: string[] = nameSectionsList.filter((item: string) => !isEmpty(item));
  const firstName: string = notEmptyNameSectionsList?.[0]?.trimStart();
  const secondName: string = notEmptyNameSectionsList?.[1]?.trimStart();
  if (isEmpty(firstName)) {
    return '';
  }
  if (isEmpty(secondName)) {
    return firstName[0].toUpperCase();
  }
  return `${firstName[0]}${secondName[0]}`.toUpperCase();
}
