declare global {
	interface Window {
		electronAPI: {
			openFileDirectoryByPath: (filePath: string) => Promise<string[]>;
			openFile: () => Promise<string[]>;
			openFileDirectory: () => void;
		};
	}
}