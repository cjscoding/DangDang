import styles from "../../scss/team-board/create-room.module.scss";
import Title from "../../components/layout/title";
import Link from "next/link";
import { connect } from "react-redux";
import { createRoom } from "../../store/actions/roomAction";
import { useEffect, useState } from "react";
import axios from "axios";

function mapDispatchToProps(dispatch) {
  return {
    create: (roomInfo) => dispatch(createRoom(roomInfo)),
  };
}

export default connect(null, mapDispatchToProps)(CreateRoom);

const API_KEY = "10923b261ba94d897ac6b81148314a3f";

function CreateRoom() {
//   const [movies, setMovies] = useState();
//   useEffect(() => {
//     (async () => {
//       const { results } = await (
//         await fetch(
//           `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
//         )
//       ).json();
//       setMovies(results);
//       console.log(results);
//     })();
//   }, []);

  function ax() {
    axios
      .post("http://localhost:8080/study", {
        "name": "스터디이름",
        "number" : 4,
        "introduction" : "하윙!",
        "target" : "네이버!!"
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  ax();

  const roomInit = {
    host: "",
    goal: "",
    desc: "",
    kakao: "",
    hashtag: [],
    member: [],
    on: true,
  };

  const [roomInfo, setRoomInfo] = useState(roomInit);
  const [roomTags, setRoomTags] = useState([]);

  const onSubmit = (event) => {
    event.preventDefault();

    const member = [...roomInfo.member, roomInfo.host];

    const newInfo = {
      ...roomInfo,
      hashtag: roomTags,
      member: member,
    };

    console.log(newInfo);
    console.log("---------------");
    create(newInfo);
    setRoomInfo(roomInit);
    setRoomTags([]);
  };

  const onChange = (event) => {
    const { name, value } = event.target;

    const newInfo = {
      ...roomInfo,
      [name]: value,
    };

    setRoomInfo(newInfo);
  };

  const onAddTag = (event) => {
    event.preventDefault();
    const newTag = event.target[0].value;
    setRoomTags([...roomTags, newTag]);
    event.target[0].value = "";
  };

  return (
    <div className={styles.container}>
      <Title title="Create Room"></Title>
      <h1>방 생성</h1>

      <div className={styles.info}>
        <span>호스트</span>
        <input
          type="text"
          name="host"
          value={roomInfo.host}
          onChange={onChange}
        />

        <span>목표</span>
        <input
          type="text"
          name="goal"
          value={roomInfo.goal}
          onChange={onChange}
        />

        <span>오카방 주소</span>
        <input
          type="text"
          name="kakao"
          value={roomInfo.kakao}
          onChange={onChange}
        />

        <span>팀 소개</span>
        <textarea
          cols="30"
          rows="10"
          name="desc"
          value={roomInfo.desc}
          onChange={onChange}
        ></textarea>

        <label>태그</label>
        <form onSubmit={onAddTag} className={styles.tagForm}>
          <div>
            <input type="text" />
            <button>태그 추가</button>
          </div>
          <p>
            내 태그 [
            {roomTags?.map((tag) => (
              <span key={tag}>{`${tag} `}</span>
            ))}
            ]
          </p>
        </form>
      </div>

      <div className={styles.btns}>
        <button className="cancelBtn">
          <Link href="/team-board">
            <a>취소</a>
          </Link>
        </button>
        <button className="createBtn" onClick={onSubmit}>
          생성
        </button>
      </div>
    </div>
  );
}
