import { ReleasePeriodType } from "../AvailableBaseIndexInfo";
import { CommonRequestUploader } from "./UploadRequestsBase";

export interface IndicesRequestUploader extends CommonRequestUploader {
    Overhead: number;
    Profit: number;
    Year: number;
    Month: number;
    PeriodType: ReleasePeriodType;
}