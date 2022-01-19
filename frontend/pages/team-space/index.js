import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchposts } from "../../store/actions/postAction";

export default function TeamSpace() {
  const dispatch = useDispatch();
  const { teamNo } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(fetchposts());
  }, []);

  return (
    <div>
      <h1 key={teamNo}>팀 스페이스!! | {teamNo}</h1>
    </div>
  );
}
