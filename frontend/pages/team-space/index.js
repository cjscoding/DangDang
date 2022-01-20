import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchposts } from "../../store/actions/postAction";

export default function TeamSpace() {
  const dispatch = useDispatch();
//   const { teamNo } = useSelector((state) => state.postReducer);

  useEffect(() => {
    dispatch(fetchposts());
  }, []);

  return (
    <div>
        
    </div>
  );
}
