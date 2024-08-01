
export interface IComnCod{
    grp_cod?: string;
    grp_cod_nm?: string;
    use_poa?: string;
    grp_cod_eplti?: string;
}

export interface IComnCodList extends IComnCod {
    row_num: number;
    fst_enlm_dtt:number;
    reg_date: string| null;
    detailcnt: number;
}

export interface IComnDetailList extends IComnCod {
    row_num: number;
    dtl_cod_eplti: string;
    dtl_cod: string;
    dtl_cod_nm: string;
    fst_enlm_dtt: string;
    fst_rgst_sst_id: string;
    fnl_mdfd_dtt: string;
}

export interface ISearchComnCod {
    totalCount: number;
    listComnGrpCod: IComnCodList[];
}

export interface IPostResponse{
    result: 'SUCCESS'
}

export interface IDetailResponse extends IPostResponse{
    comnGrpCodModel : IComnGrpCodModal;
    resultMsg: string;
}

export interface ISelectComnDtlCodResponse extends IPostResponse{
    comnDtlCodModel : IComnDtlCodModal;
}

export interface IselectComnDtlCod extends IPostResponse{
    resultMsg: string;
}

export interface IComnGrpCodModal{
    grp_cod: string;
    grp_cod_nm: string;
    grp_cod_eplti: string;
    use_poa: string;  
}

export interface IListComnDtlCodJsonResponse {
    totalCntComnDtlCod: number;
    listComnDtlCodModel: IComnDetailList[];
    pageSize: number;
    currentPageComnDtlCod: number;
}

export interface IComnDtlCodModal{
    row_num?:number;
    grp_cod?: string;
    grp_cod_nm?: string;
    dtl_cod?: string;
    dtl_cod_nm?: string;
    dtl_cod_eplti?: string;
    use_poa?: string
}

