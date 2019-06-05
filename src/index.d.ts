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

export type BoardItem = Link | File;

export interface Board {
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

export interface File {
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

export interface FileMetadata {
    name: string;
    size: number;
    content?: Buffer;
}

export interface FileUploadResult {
    id: string;
    retries: number;
    name: string;
    size: number;
    chunk_size: number;
}

export interface FileUploadURLResult {
    success: boolean;
    url: string;
}

export interface Link {
    id: string;
    url: string;
    meta: {
        title: string;
    }
    type: ItemType;
}

export interface LinkMetadata {
    url: string;
    title: string;
}

export interface TransferCreationArgs {
    message: string;
    files: FileMetadata[];
}

export type TransferCreationResult = APIResponse & Transfer;

export interface Transfer {
    id: string;
    state: CreationState;
    url: string;
    expires_at: Date;
    files: File[];
}

export interface BoardClient {
    create (args: BoardCreationArgs): Promise<Board | APIResponse>;
    find (boardID: string): Promise<Board | APIResponse>;
    addFiles (boardID: string, files: FileMetadata[]): Promise<File[] | APIResponse>;
    addLinks (boardID: string, links: LinkMetadata[]): Promise<Link[] | APIResponse>;
    getFileUploadURL (boardID: string, fileID: string, partNumber: number, multipartUploadID: string): Promise<FileUploadURLResult | APIResponse>;
    completeFileUpload (board: Board, file: File): Promise<APIResponse>;
}

export interface TransferClient {
    create (args: TransferCreationArgs): Promise<TransferCreationResult | APIResponse>;
    find (transferID: string): Promise<Transfer | APIResponse>;
    getFileUploadURL (transferID: string, fileID: string, partNumber: number): Promise<FileUploadURLResult | APIResponse>;
    completeFileUpload (transfer: Transfer, file: File): Promise<FileUploadResult | APIResponse>;
    finalize (transferID: string): Promise<Transfer | APIResponse>;
}

export interface WeTransferClient {
    authorize (): Promise<AuthorizationResult | APIResponse>;
    transfer: TransferClient;
    board: BoardClient;
}

export default function createWTClient (apiKey: string): WeTransferClient;