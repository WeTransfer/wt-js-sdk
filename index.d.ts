export interface AuthorizationResult {
    success: boolean;
    token: string;
}

export interface FileMetadata {
    id: string;
    name: string;
    type: "file" | "link"; // What else?
    size: number;
    multipart: {
        part_numbers: number;
        chunk_size: number;
    };
}

export interface TransferFile {
    name: string;
    size: number;
    content?: Buffer;
}

export interface TransferCreationArgs {
    message: string;
    files: TransferFile[];
}

interface RequestResult {
    success: boolean;
    message: string;
}

export interface TransferMetadata {
    id: string;
    state: "uploading" | "downloadable" | "processing"; // What else?
    url: string;
    expires_at: string; // Parsed to `Date`?
    files: FileMetadata[];
}

export interface TransferCreationResult extends RequestResult, TransferMetadata { }

export interface TransferUploadURLResult {
    success: boolean;
    url?: string;
}

export interface TransferCompleteResult {
    id: string;
    retries: number;
    name: string;
    size: number;
    chunk_size: number;
}

export interface Transfer {
    create (args: TransferCreationArgs): Promise<TransferCreationResult | RequestResult>;
    find (transferID: string): Promise<TransferMetadata | RequestResult>;
    getFileUploadURL (transferID: string, fileID: string, partNumber: number): Promise<TransferUploadURLResult | RequestResult>;
    completeFileUpload (transferID: string, fileID: string, partCount: number): Promise<TransferCompleteResult | RequestResult>;
    finalize (transferID: string): Promise<TransferMetadata | RequestResult>;
}

export interface Board {
    create (): any; // INCOMPLETE
    find (): any; // INCOMPLETE
    addFiles (): any; // INCOMPLETE
    addLinks (): any; // INCOMPLETE
    getFileUploadURL: any; // INCOMPLETE
    completeFileUpload (): any; // INCOMPLETE
}

export interface WeTransfer {
    authorize (userIdentifier?: string): Promise<AuthorizationResult | RequestResult>;
    transfer: Transfer;
    board: Board;
}

export default function createWTClient (apiKey: string): WeTransfer;