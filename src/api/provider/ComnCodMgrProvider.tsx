import { createContext, FC, ReactNode, useState } from "react";

interface Context{
    searchKeyword:object;
    setSearchKeyword:(keyword:object) => void;
}

const defaultValue:Context = {
    searchKeyword : {},
    setSearchKeyword : ()=>{},
}

export const ComnCodContext = createContext(defaultValue);

export const ComnCodProvider:FC<{ children: ReactNode | React.ReactNode[] }> = ({children})=>{
    const [searchKeyword, setSearchKeyword] = useState({});
    return <ComnCodContext.Provider value={{ searchKeyword, setSearchKeyword }}>{children}</ComnCodContext.Provider>
}