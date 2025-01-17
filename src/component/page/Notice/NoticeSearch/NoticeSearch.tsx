import { useRef, useState } from "react";
import { NoticeSearchStyled } from "./styled";
import { Button } from "../../../common/Button/Button";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";

export const NoticeSerach = () => {

  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const title = useRef<HTMLInputElement>(null);
  const [modal, setModal] = useRecoilState<boolean>(modalState);

  const handlerSearch = () => {
    // 검색 부턴을 누르면 조회가 된다.
    const query: string[] = [];

    !title.current?.value || query.push(`searchTitle=${title.current?.value}`);
    !startDate || query.push(`startDate=${startDate}`);
    !endDate || query.push(`endDate=${endDate}`);

    const queayString = query.length > 0 ? `?${query.join("&")}` : "";
    navigate(`/react/board/notice.do${queayString}`);
  };
  
  const handlerModal = ()=>{
    setModal(!modal)
  }

  const handlerUpdate = ()=>{
    
  }

  return (

    <NoticeSearchStyled>
      <input ref={title}/>
      <input type="date" onChange={(e) => { setStartDate(e.target.value); }}/>
      <input type="date" onChange={(e) => { setEndDate(e.target.value); }}/>
      <Button onClick={handlerSearch}>검색</Button>
      <Button onClick={handlerModal}>등록</Button>
    </NoticeSearchStyled>

  );
};
