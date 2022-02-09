import styles from "../../../scss/team/board/create-room.module.scss";
import Title from "../../../components/layout/Title";
import Link from "next/link";

import { createRoom, addRoomImg } from "../../../api/studyroom";
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
  const [image, setImage] = useState("");

  //final submit
  const onSubmit = (event) => {
    event.preventDefault();

    const newInfo = {
      ...roomInfo,
      hashTags: roomTags,
    };

    if(roomInfo.name === ""){
        console.log("방 이름을 작성해주세요!");
        return;
    }else if(roomInfo.number === ""){
        console.log("모집 인원 수를 작성해주세요!");
        return;
    }else if(roomTags.length === 0){
        console.log("최소 하나 이상의 태그를 작성해주세요!");
        return;
    }else if(image === ""){
        console.log("스터디 프로필 이미지를 첨부해주세요!");
        return;
    }

    createRoom(
      newInfo,
      (res) => {
        console.log(res, "스터디 생성 완료!");
        const data = {
          studyId: res.data.response.id,
          image,
        };
        addRoomImg(
          data,
          (res) => {
            console.log(res, "스터디 이미지 등록 성공");
            console.log("마이룸으로 이동합니다.");
          },
          (err) => {
            console.log(err, "스터디 이미지 등록 실패");
          }
        );
      },
      (err) => {
        console.log(err, "스터디를 생성할 수 없습니다.");
      }
    );

    router.push("/user/mypage/myroom");
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
    if (newTag == "") {
      console.log("키워드를 입력해주세요.");
    } else if (roomTags.indexOf(newTag) === -1) {
      setRoomTags([...roomTags, newTag]);
      event.target[0].value = "";
    } else {
      console.log("이미 존재하는 키워드입니다.");
      event.target[0].value = "";
    }
  };

  const onRemoveTag = (event) => {
    event.preventDefault();
    const removeTag = event.target[0].value;
    setRoomTags(roomTags.filter((tag) => tag !== removeTag));
  };

  //studyroom image
  const onSetImage = (event) => setImage(event.target.files[0]);

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
        <div></div>
        <div>
          {roomTags?.map((tag, index) => (
            <form onSubmit={onRemoveTag} key={index}>
              <div>
                <input type="text" value={tag} disabled />
                <button>x</button>
              </div>
            </form>
          ))}
        </div>
        <label htmlFor="profile">프로필 사진</label>
        <input type="file" name="profile" onChange={onSetImage} />
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
