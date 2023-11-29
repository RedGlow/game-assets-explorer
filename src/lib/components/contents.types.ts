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
  parentPrefix: string;
  entries: IContentsEntry[];
}

export interface IServerContentsProps {
  prefix: string;
}
