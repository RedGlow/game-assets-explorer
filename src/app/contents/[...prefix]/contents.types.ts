import { ITags } from '@/lib/tags';

export interface IContentsEntryDirectory {
  kind: "directory";
  fullName: string; // e.g.: "Kenney/3D assets/"
}

export interface IContentsEntryFile {
  kind: "file";
  fullName: string; // e.g.: "Kenney/Readme.html"
  size: number;
}

export type IContentsEntry = IContentsEntryDirectory | IContentsEntryFile;

export interface IContentsProps {
  prefix: string;
  entries: IContentsEntry[];
  tags: ITags;
  setTag(fullName: string, tag: string): Promise<void>;
}

export interface IServerContentsProps {
  prefix: string;
}
