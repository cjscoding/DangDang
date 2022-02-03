import styles from "../../../scss/team/board/create-room.module.scss";
import Title from "../../../components/layout/title";
import Link from "next/link";

import { createRoom } from "../../../api/studyroom";
import { useRouter } from "next/router";
import { useState } from "react";

export default function CreateRoom() {
  const router = useRouter();

  const roomInit = {
    name: "",
    number: "",
    description: "",
    openKakao: "",
    goal: "",
    hashTags: [],
  };

  const [roomInfo, setRoomInfo] = useState(roomInit);
  const [roomTags, setRoomTags] = useState([]);

  //final submit
  const onSubmit = (event) => {
    event.preventDefault();

    const newInfo = {
      ...roomInfo,
      hashTags: roomTags,
    };

    createRoom(
      newInfo,
      (res) => {
        console.log(res, "스터디 생성 완료!");
      },
      (err) => {
        console.log(err, "스터디를 생성할 수 없습니다.");
      }
    );
    router.push("/team/board");
  };

  //input values
  const onChange = (event) => {
    const { name, value } = event.target;

    const newInfo = {
      ...roomInfo,
      [name]: value,
    };

    setRoomInfo(newInfo);
  };

  //hashTags
  const onAddTag = (event) => {
    event.preventDefault();
    const newTag = event.target[0].value;
    setRoomTags([...roomTags, newTag]);
    event.target[0].value = "";
  };
  
  const onRemoveTag = (event) => {
    event.preventDefault();
    const removeTag = event.target[0].value;
    setRoomTags(roomTags.filter((tag) => tag !== removeTag));
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
        </form>
        <div>
          {roomTags?.map((tag, index) => (
            <form onSubmit={onRemoveTag} key={index}>
              <div>
                <input type="text" value={tag} disabled />
                <button>태그 삭제</button>
              </div>
            </form>
          ))}
        </div>
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
