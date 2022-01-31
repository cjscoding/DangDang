import styles from "../../../scss/team/board/create-room.module.scss";
import Title from "../../../components/layout/title";
import Link from "next/link";

import { createRoom } from "../../../store/actions/roomAction";
import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateRoom() {
  const router = useRouter();

  const roomInit = {
    name: "",
    number: null,
    description: "",
    openKakao: "",
    goal: "",
    hashTags: [],
  };

  const [roomInfo, setRoomInfo] = useState(roomInit);
  const [roomTags, setRoomTags] = useState([]);

  const onSubmit = (event) => {
    event.preventDefault();

    const newInfo = {
      ...roomInfo,
      hashTags: roomTags,
    };

    createRoom(newInfo);
    setRoomInfo(roomInit);
    setRoomTags([]);
    router.push("/team/board");
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
        <span>이름</span>
        <input
          type="text"
          name="name"
          value={roomInfo.name}
          onChange={onChange}
        />

        <span>모집인원</span>
        <input
          type="number"
          name="number"
          value={roomInfo.number}
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
          name="openKakao"
          value={roomInfo.openKakao}
          onChange={onChange}
        />

        <span>팀 소개</span>
        <textarea
          cols="30"
          rows="10"
          name="description"
          value={roomInfo.description}
          onChange={onChange}
        ></textarea>

        <label>태그</label>
        <form onSubmit={onAddTag} className={styles.tagForm}>
          <div>
            <input type="text" />
            <button>태그 추가</button>
          </div>
          <p>
            태그 [
            {roomTags?.map((tag) => (
              <span key={tag}>{`${tag} `}</span>
            ))}
            ]
          </p>
        </form>
      </div>

      <div className={styles.btns}>
        <button className="cancelBtn">
          <Link href="/team/board">
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
