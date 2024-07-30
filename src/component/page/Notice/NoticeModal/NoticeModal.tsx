import { useRecoilState } from "recoil";
import { NoticeModalStyled } from "../NoticeSearch/styled"
import { modalState } from "../../../../stores/modalState";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { loginInfoState } from "../../../../stores/userInfo";
import NoImage from '../../../../assets/noImage.jpg'
import { blob } from "stream/consumers";

export interface INoticeModalProps{
    noticeSeq? : number;
    onSuccess: () => void;
    setNoticeSeq: (noticeSeq : undefined) => void;
}

export interface INoticeDetail{
    noti_seq :number,
    loginID : string,
    noti_title :string,
    noti_content :string,
    noti_date :string,
    file_name : string | null,
    phsycal_path :string | null,
    logical_path : string | null,
    file_size : number | null,
    file_ext : string | null,
}

export interface INoticeDetailResponse{
    detailValue : INoticeDetail;
}

export interface IPostResponse{
    result : 'success';
}

export const NoticeModal: FC<INoticeModalProps> = ({noticeSeq, onSuccess, setNoticeSeq})=>{

    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [noticeDetail, setNoticeDetail] = useState<INoticeDetail>();
    const [userInfo] = useRecoilState(loginInfoState);
    const title = useRef<HTMLInputElement>(null);
    const content = useRef<HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = useState<string>();
    const [fileData, setFileData] =useState<File>();

    useEffect(()=>{
        if(noticeSeq){
            searchDetail();
        }
        return ()=>{
            setNoticeSeq(undefined)
        }
    },[])
    
    const searchDetail = ()=>{
        axios
            .post(`/board/noticeDetail.do`, {noticeSeq})
            .then((res: AxiosResponse<INoticeDetailResponse>)=>{
                
                setNoticeDetail(res.data.detailValue)
                const fileExt = res.data.detailValue.file_ext;
                if(fileExt === 'jpg' || fileExt === 'gif' || fileExt === 'png'){
                    setImageUrl(res.data.detailValue.logical_path || NoImage);
                }else{
                    setImageUrl(NoImage);
                }
                
            })
            .catch((err)=>{
                console.error(err)
            })
    }

    const handlerSave = ()=>{
        // axios
        //     .post(`/board/noticeSave.do`, {
        //         title : title.current?.value,
        //         content : content.current?.value,
        //         loginId : userInfo.loginId
        //     })
        //     .then((res:AxiosResponse<IPostResponse>)=>{
        //         if(res.data.result === 'success'){
        //             onSuccess();
        //         }
        //     })
        //     .catch((err)=>{
        //         console.error(err)
        //     })

        const fileForm = new FormData();
        const textData = {
            title : title.current?.value,
            content : content.current?.value,
            loginId : userInfo.loginId
        }
        if(fileData){
            fileForm.append('file', fileData);
        }
        fileForm.append('text', new Blob([JSON.stringify(textData)], {type: 'application/json'}))
        axios
            .post(`/board/noticeFileSaveJson`, fileForm)
            .then((res:AxiosResponse<IPostResponse>)=>{
                console.log(res)
                if(res.data.result === "success"){
                    onSuccess();
                }
            })
            .catch((err)=>{
                console.error(err)
            })

    }
    const handlerUpdate = ()=>{
        // axios  
        //     .post(`/board/noticeUpdate.do`, {
        //         title : title.current?.value,
        //         content : content.current?.value,
        //         noticeSeq : noticeSeq
        //     })
        //     .then((res:AxiosResponse<IPostResponse>)=>{
        //         if(res.data.result === 'success'){
        //             onSuccess();
        //         }
        //     })
        //     .catch((err)=>{
        //         console.error(err)
        //     })
        const fileForm = new FormData();
        const textData = {
            title : title.current?.value,
            content : content.current?.value,
            loginId : userInfo.loginId,
            noticeSeq : noticeSeq
        }
        if(fileData){
            fileForm.append('file', fileData);
        }
        fileForm.append('text', new Blob([JSON.stringify(textData)], {type: 'application/json'}))
        axios
            .post(`/board/noticeUpdateJson.do`, fileForm)
            .then((res:AxiosResponse<IPostResponse>)=>{
                if(res.data.result === "success"){
                    onSuccess();
                }
            })
            .catch((err)=>{
                console.error(err)
            })


    }   
    
    const handlerDelete = ()=>{
        axios
        .post(`/board/noticeDelete.do`, {noticeSeq : noticeSeq})
        .then((res:AxiosResponse<IPostResponse>)=>{
            if(res.data.result === 'success'){
                onSuccess();
            }
            })
            .catch((err)=>{
                console.error(err)
            })
        }
    
    const handlerFile = (e:ChangeEvent<HTMLInputElement>)=>{
        const fileInfo = e.target.files;
        if(fileInfo?.length){
            const fileInfoSplit = fileInfo[0].name.split('.');
            const fileExtension = fileInfoSplit[1].toLowerCase();

            if(fileExtension === 'jpg' || fileExtension === 'gif' || fileExtension === 'png'){
                setImageUrl(URL.createObjectURL(fileInfo[0]))
            }else{
                setImageUrl('notImage')
            }
            setFileData(fileInfo[0])
        }
    }

    const downLoadFile = async ()=>{
        let param = new URLSearchParams();
        param.append('noticeSeq', noticeSeq?.toString() as string);

        const postAction: AxiosRequestConfig = {
            url : '/board/noticeDownload.do',
            method : 'POST',
            data : param,
            responseType : 'blob'
        }

        await axios(postAction)
                .then((res)=>{
                    console.log(res.data)
                    const url = window.URL.createObjectURL(new Blob([res.data]))
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', noticeDetail?.file_name as string);
                    document.body.appendChild(link)
                    link.click();
                    
                    link.remove();
                })
                .catch((err)=>{
                    console.error(err)
                })

    }

    
    return(

      <NoticeModalStyled>
        <div className="container">
            <label>
                제목 :<input type="text" defaultValue={noticeDetail?.noti_title} ref={title}/>
            </label>
            <label>
                내용 :<input type="text" defaultValue={noticeDetail?.noti_content} ref={content}/>
            </label>
            파일 :<input type="file" id="fileInput" style={{ display: 'none' }} onChange={handlerFile}></input>
            <label className="img-label" htmlFor="fileInput">
                파일 첨부하기
            </label>
            <div onClick={downLoadFile}>
                {
                    imageUrl === 'notImage' 
                    ? 
                    (
                        <div>
                            <label>파일명</label>
                            {fileData?.name || noticeDetail?.file_name}
                        </div>
                    ) 
                    :
                    (
                        <div>
                            <label>미리보기</label>
                            <img src={imageUrl}/>
                        </div> 
                    )
                }
                    

            </div>
            <div className={'button-container'}>
                <button onClick={noticeSeq ? handlerUpdate : handlerSave}>{noticeSeq ? '수정' : '등록'}</button>
                {
                    noticeSeq ? <button onClick={handlerDelete}>삭제</button> : null
                }
                <button onClick={()=>{setModal(!modal)}}>나가기</button>
            </div>
        </div>
      </NoticeModalStyled>

    )
}