import { FileSystem } from './FileSystem';

export interface DataCrime {
  path: string;
  size: number;
  type: 'LARGE_FILE' | 'UNTRACKED_DATA';
}

export class DVCScanner {
  private LARGE_FILE_THRESHOLD = 50 * 1024 * 1024; // 50MB for simulation

  constructor(private fs: FileSystem) {}

  public scanForCrimes(path: string = '/'): DataCrime[] {
    const crimes: DataCrime[] = [];
    this.walk(path, crimes);
    return crimes;
  }

  private walk(path: string, crimes: DataCrime[]): void {
    if (!this.fs.exists(path)) return;

    if (this.fs.isDirectory(path)) {
      const files = this.fs.ls(path);
      for (const file of files) {
        this.walk(`${path === '/' ? '' : path}/${file}`, crimes);
      }
    } else {
      const metadata = this.fs.getMetadata(path);
      const size = metadata.size;

      if (size > this.LARGE_FILE_THRESHOLD) {
        crimes.push({
          path,
          size,
          type: 'LARGE_FILE'
        });
      }
    }
  }

  public static isDataFile(fileName: string): boolean {
    const dataExtensions = ['.csv', '.parquet', '.json', '.h5', '.pkl', '.npy'];
    return dataExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  }
}
