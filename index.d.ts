export interface APIResponse {
    success: boolean;
    message: string;
}

export interface AuthorizationResult {
    success: boolean;
    token: string;
}

export interface BoardCreationArgs {
    name: string;
    description?: string;
}

export type BoardItem = BoardLink & TransferFile;

export interface BoardLink {
    id: string;
    url: string;
    meta: {
        title: string;
    }
    type: ItemType;
}

export interface BoardMetadata {
    id: string;
    name: string;
    description?: string;
    state: CreationState;
    url: string;
    items: BoardItem[];
}

export const enum CreationState {
    Uploading = "uploading",
    Processing = "processing",
    Downloadable = "downloadable",
}

export const enum ItemType {
    File = "file",
    Link = "link"
}

export interface FileUploadURLResult {
    success: boolean;
    url: string;
}

export interface LinkMetadata {
    url: string;
    title: string;
}

export interface FileMetadata {
    name: string;
    size: number;
    content?: Buffer;
}

export interface TransferCreationArgs {
    message: string;
    files: FileMetadata[];
}

export type TransferCreationResult = APIResponse & TransferMetadata;

export interface TransferCompletionResult {
    id: string;
    retries: number;
    name: string;
    size: number;
    chunk_size: number;
}

export interface TransferFile {
    id: string;
    name: string;
    type: ItemType;
    size: number;
    multipart: {
        id?: string;
        part_numbers: number;
        chunk_size: number;
    };
}

export interface TransferMetadata {
    id: string;
    state: CreationState;
    url: string;
    expires_at: Date;
    files: TransferFile[];
}

export interface Board {
    create (args: BoardCreationArgs): Promise<BoardMetadata | APIResponse>;
    find (boardID: string): Promise<BoardMetadata | APIResponse>;
    addFiles (boardID: string, files: FileMetadata[]): Promise<TransferFile[] | APIResponse>;
    addLinks (boardID: string, links: LinkMetadata[]): Promise<BoardLink | APIResponse>;
    getFileUploadURL (boardID: string, fileID: string, partNumber: number, multipartUploadID: number): Promise<FileUploadURLResult | APIResponse>;
    completeFileUpload (boardID: string, fileID: string): Promise<APIResponse>;
}

export interface Transfer {
    create (args: TransferCreationArgs): Promise<TransferCreationResult | APIResponse>;
    find (transferID: string): Promise<TransferMetadata | APIResponse>;
    getFileUploadURL (transferID: string, fileID: string, partNumber: number): Promise<FileUploadURLResult | APIResponse>;
    completeFileUpload (transferID: string, fileID: string, partCount: number): Promise<TransferCompletionResult | APIResponse>;
    finalize (transferID: string): Promise<TransferMetadata | APIResponse>;
}

export interface WeTransfer {
    authorize (userIdentifier?: string): Promise<AuthorizationResult | APIResponse>;
    transfer: Transfer;
    board: Board;
}

export default function createWTClient (apiKey: string): WeTransfer;