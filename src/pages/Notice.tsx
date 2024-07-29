import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { NoticeMain } from "../component/page/Notice/NoticeMain/NoticeMain";
import { NoticeSerach } from "../component/page/Notice/NoticeSearch/NoticeSearch";

export const Notice = () => {
  return (
    <>
      <ContentBox>공지사항</ContentBox>
      <NoticeSerach />
      <NoticeMain />
    </>
  );
};
