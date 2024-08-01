import { useRecoilState } from "recoil";
import { Button } from "../../../common/Button/Button";
import { modalState } from "../../../../stores/modalState";
import { ComnCodDetalTableStyled, ComnCodMgrDetailModalStyled } from "./styled";
import { FC, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { IComnDtlCodModal, IselectComnDtlCod, ISelectComnDtlCodResponse } from "../../../../models/interface/ComncodeMgr/comnCodeMgrModel";
import { postComnCodMgrApi } from "../../../../api/postComnCodMgrApi";


export interface IComnCodeMgrDetailModalProps{
    detailCode?: string;
    onPostSuccess : ()=>void;
}

export const ComnCodeMgrDetailModal: FC<IComnCodeMgrDetailModalProps> = ( {detailCode, onPostSuccess} ) => {

    const [modal, setModal] = useRecoilState(modalState);
    const { grpCod } = useParams();
    const { state } = useLocation();
    const [comnDetail, setComnDetail] = useState<IComnDtlCodModal>();

    useEffect(()=>{
        if(modal && detailCode) serachDetail();
    },[detailCode, modal])

    const serachDetail = ()=> {
        const postAction : AxiosRequestConfig = {
            method: 'POST',
            url : '/system/selectComnDtlCod.do',
            data : {
                grp_cod:grpCod,
                dtl_cod:detailCode
            },
            headers: {
                'Content-Type' : 'application/json'
            }
        }
        axios(postAction)
            .then((res:AxiosResponse<ISelectComnDtlCodResponse>)=>{
                setComnDetail(res.data.comnDtlCodModel)
                console.log(res.data)
            })
            .catch((err)=>{
                console.error(err)
            })
    }

    const cleanUp = ()=>{
        setComnDetail(undefined)
    }

    const handlerSave = ()=>{
        console.log(comnDetail)
        const postAction : AxiosRequestConfig = {
            method: 'POST',
            url : '/system/saveComnDtlCodJson.do',
            data : {
                ...comnDetail, dtl_grp_cod : grpCod
            },
            headers: {
                'Content-Type' : 'application/json'
            }
        }
        axios(postAction)
            .then((res:AxiosResponse<IselectComnDtlCod>)=>{
                if(res.data.result === 'SUCCESS') onPostSuccess();
            })
    }

    const handlerUpdate = ()=>{
        console.log(comnDetail)
        const postAction : AxiosRequestConfig = {
            method: 'POST',
            url : '/system/updateComnDtlCodJson.do',
            data : {
                ...comnDetail, dtl_grp_cod : grpCod
            },
            headers: {
                'Content-Type' : 'application/json'
            }
        }
        axios(postAction)
        .then((res:AxiosResponse<IselectComnDtlCod>)=>{
            if(res.data.result === 'SUCCESS') onPostSuccess();
        })
    }

    const handlerDelete = ()=>{
        console.log(comnDetail)
        const postAction : AxiosRequestConfig = {
            method: 'POST',
            url : '/system/deleteComnDtlCodJson.do',
            data : {
                dtl_cod: detailCode, dtl_grp_cod : grpCod
            },
            headers: {
                'Content-Type' : 'application/json'
            }
        }
        axios(postAction)
        .then((res:AxiosResponse<IselectComnDtlCod>)=>{
            if(res.data.result === 'SUCCESS') onPostSuccess();
        })
    }



    return (
        <ComnCodMgrDetailModalStyled ariaHideApp={false} isOpen={modal} onAfterClose={cleanUp}>
        <div className="wrap">
            <div className="header">상세 코드 관리</div>
            <ComnCodDetalTableStyled>
                <tbody>
                    <tr>
                        <th>그룹 코드 id</th>
                        <td>
                            <input type="text" name="grp_cod" defaultValue={grpCod} readOnly
                                />
                        </td>
                        <th>그룹 코드 명</th>
                        <td>
                            <input type="text" name="grp_cod_nm" defaultValue={state.grpCodNm} readOnly></input>
                        </td>
                    </tr>
                    <tr>
                        <th>상세 코드 id </th>
                        <td>
                            <input type="text" defaultValue={comnDetail?.dtl_cod} readOnly={detailCode ? true : false}
                            onChange={(e)=>{setComnDetail({...comnDetail, dtl_cod : e.target.value})}}
                            ></input>
                        </td>
                        <th>상세 코드 명</th>
                        <td>
                            <input type="text" defaultValue={comnDetail?.dtl_cod_nm}
                            onChange={(e)=>{setComnDetail({...comnDetail, dtl_cod_nm : e.target.value})}}
                            ></input>
                        </td>
                    </tr>
                    <tr>
                        <th>코드 설명</th>
                        <td colSpan={3}>
                            <input type="text" defaultValue={comnDetail?.dtl_cod_eplti}
                            onChange={(e)=>{setComnDetail({...comnDetail, dtl_cod_eplti : e.target.value})}}
                            ></input>
                        </td>
                    </tr>
                    <tr>
                        <th>사용 유무 *</th>
                        <td colSpan={3}>
                            <input type="radio" name="useYn" value={'Y'}
                            checked={comnDetail?.use_poa === 'Y'}
                            onChange={(e)=>{setComnDetail({...comnDetail, use_poa : e.target.value})}}
                            ></input>
                            사용
                            <input type="radio" name="useYn" value={'N'}
                            checked={comnDetail?.use_poa === 'N'}
                            onChange={(e)=>{setComnDetail({...comnDetail, use_poa : e.target.value})}}
                            ></input>
                            미사용
                        </td>
                    </tr>
                </tbody>
            </ComnCodDetalTableStyled>
            <div className="btn-group">
                {   
                    !detailCode 
                    ? 
                    <Button onClick={handlerSave}>저장</Button>
                    : 
                    <>
                        <Button onClick={handlerUpdate}>수정</Button>
                        <Button onClick={handlerDelete}>삭제</Button>
                    </>
                    
                }

                <Button onClick={() => setModal(!modal)}>닫기</Button>
            </div>
        </div>
        </ComnCodMgrDetailModalStyled>
        )
    ;
}