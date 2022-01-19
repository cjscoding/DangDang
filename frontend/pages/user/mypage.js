import Title from "../../components/layout/title";
import styles from "../../scss/user/mypage.module.scss";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchmyrooms } from "../store/actions/postAction";
import Link from "next/link";

export default function Board() {
  const dispatch = useDispatch();
  const { myRooms } = useSelector((state) => state.myRoom);

  useEffect(() => {
    dispatch(fetchmyrooms());
  }, []);

  return (
    <div>
      <Title title="Board"></Title>

      <h1 className={styles.title}>내방들이당</h1>

      <div className="container">
        <div className={styles.main}>
          <div className={styles.top}>
            <div className={styles.filter}>
              <label htmlFor="">검색어</label>
              <input type="text" />
            </div>
            <button>
              <Link href="/board">
                <a>스터디 게시판으로</a>
              </Link>
            </button>
          </div>

          <div className={styles.rooms}>
            {myRooms &&
              myRooms.map((items, index) => (
                <div className={styles.room} key={index}>
                  <Image
                    src="/vercel.svg"
                    alt="Vercel Logo"
                    width={300}
                    height={250}
                  />
                  <div className={styles.keywords}>
                    {items &&
                      items.map((item) => <span key={item}># {item}</span>)}
                    <Link
                      href={{
                        pathname: "/team",
                        query: { no: index },
                      }}
                      as="/team"
                      index={index}
                    >
                      <a>스터디 참여하기</a>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
