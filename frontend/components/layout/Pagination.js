import styles from "../../scss/layout/pagination.module.scss";

import { useEffect, useState } from "react";

export default function Pagination({
  totalCount,
  postsPerPage,
  paginate,
  curPage,
}) {
  const [pageNumbers, setPageNumbers] = useState([]);
  const totalPage = Math.ceil(totalCount / postsPerPage);

  const goPrevPage = () => {
    if (curPage === 0) {
      paginate(0);
      alert("첫 페이지입니다.")
    } else {
      paginate(curPage - 1);
    }
  };

  const goNextPage = () => {
    if (curPage === totalPage - 1) {
      paginate(totalPage - 1);
      alert("마지막 페이지입니다.")
    } else {
      paginate(curPage + 1);
    }
  };

  useEffect(() => {
    const numArr = [];
    if (totalPage <= 5) {
      for (let i = 0; i < totalPage; i++) {
        numArr.push(i);
      }
    } else if (curPage < 3) {
      for (let i = 0; i < 5; i++) {
        numArr.push(i);
      }
    } else if (curPage > totalPage - 3) {
      for (let i = totalPage - 5; i < totalPage; i++) {
        numArr.push(i);
      }
    } else {
      for (let i = curPage - 2; i < curPage + 3; i++) {
        numArr.push(i);
      }
    }
    setPageNumbers(numArr);
  }, [totalCount, curPage, totalPage]);

  return (
    <nav className={styles.nav}>
      <ul className={styles.pagination}>
        <li className={styles.option}>
          <a onClick={() => paginate(0)}>처음</a>
        </li>

        <li className={styles.option}>
          <a onClick={goPrevPage}>이전</a>
        </li>

        {pageNumbers.map((number) =>
          number === curPage ? (
            <li key={number}>
              <a onClick={() => paginate(number)} className={styles.curPage}>{number + 1}</a>
            </li>
          ) : (
            <li key={number}>
              <a onClick={() => paginate(number)}>{number + 1}</a>
            </li>
          )
        )}

        <li className={styles.option}>
          <a onClick={goNextPage}>다음</a>
        </li>

        <li className={styles.option}>
          <a onClick={() => paginate(totalPage - 1)}>마지막</a>
        </li>
      </ul>
    </nav>
  );
}