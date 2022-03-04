import { DeclarationBaseService } from "src/app/core/services/base-services/declaration-base.service";
import { EndpointBaseService } from "src/app/core/services/base-services/endpoint-base.service";
import { LocalStorageService, LocalStorageConst } from "src/app/core/services/local-storage.service";
import { ResultUploadParamsBase } from "src/app/primary-module/normative-base/models/base-result-params.model";
import { StepperData } from "src/app/secondary-module/stepper/models/stepper-model";

export abstract class UploadComponentBase<TAvailableBase, TResultOptions extends ResultUploadParamsBase<TAvailableBase>> {

    public data: StepperData | null = null;
    public resultParams: TResultOptions;
    public errorMessages = "";

    public isAwaiting = false;
    public isSuccessSending = false;
    public showCheck = false;

    constructor(protected declarationService: DeclarationBaseService<TAvailableBase, TResultOptions>,
        protected endpointService: EndpointBaseService,
        protected storageService: LocalStorageService,
        protected storageConst: LocalStorageConst) {
            
        this.resultParams = this.loadLastParams();
        this.init();
    }

    public abstract onFinish(): void;

    public onModelChange() {
        this.declarationService.updateResultParams(this.resultParams);
    }

    protected abstract loadLastParams(): TResultOptions;

    protected init() {
        this.declarationService.updateParamsSub.subscribe(newParams => {
            this.resultParams = newParams;
            this.storageService.setItem(this.storageConst, this.resultParams);
        });
        
        this.endpointService.getAvailableBaseTypes().then(availableBaseTypes => {
            if (availableBaseTypes?.length) {
                this.data = this.declarationService.getStepperModel(this, availableBaseTypes);
            } else {
                this.errorMessages = "!! ошибка загрузки";
            }
        });
    }



}