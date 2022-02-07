import { CommonRequestUploader } from "./UploadRequestsBase";

export interface NormoRequestUploader extends CommonRequestUploader {
    Name: string;
    ShortName: string;
    AdditionalRegexp: string;
    IsUpdate: boolean;
}