import last from 'lodash-es/last';

export const getExtension = (fullname: string) => last(fullname.split("."));
