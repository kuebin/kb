import axios, { AxiosRequestConfig, AxiosResponse } from "axios"

export const postComnCodMgrApi = async <T>(dataObject:object)=>{
    const postAction:AxiosRequestConfig = {
        method:'POST',
        url: '/system/selectComnGrpCod.do',
        data: dataObject,
        headers:{
            'Content-Type': 'application/json',
        }
    }
    try{
        const result:AxiosResponse<T> = await axios(postAction)
        return result.data
    } catch(err){
        console.error(err)
    }
}