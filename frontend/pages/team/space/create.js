import styles from "../../../scss/team/form.module.scss";
// import Title from "../../../components/layout/Title";

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

    if (roomInfo.name === "") {
      alert("스터디명을 작성해주세요!");
      return;
    } else if (roomInfo.number <= 0) {
      alert("최소 1명 이상의 인원이 필요합니다!");
      return;
    } else if (roomInfo.number > 4) {
      alert("최대 모집 인원은 4명입니다!");
      return;
    } else if (roomTags.length === 0) {
      alert("최소 하나 이상의 태그를 작성해주세요!");
      return;
    }

    createRoom(
      newInfo,
      (res) => {
        alert("스터디 생성 완료! 마이룸으로 이동합니다!");
        console.log(res);
        const data = {
          studyId: res.data.response.id,
          image,
        };
        addRoomImg(
          data,
          (res) => {
            console.log(res);
            router.push("/user/mypage/myroom");
          },
          (err) => {
            console.log(err);
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );

  };

  //input values
  const onChange = (event) => {
    let { name, value } = event.target;
    if(name === "number"){
      value = Math.round(value)
      if(value < 1) value = 1
      if(value > 4) value = 4
    }
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
      alert("키워드를 입력해주세요.");
    } else if (roomTags.indexOf(newTag) === -1) {
      setRoomTags([...roomTags, newTag]);
      event.target[0].value = "";
    } else {
      alert("이미 존재하는 키워드입니다.");
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

  //go back
  const onMoveStudyBoardPage = () => {
    router.push({
      pathname: `/team/space`,
      query: {
        id: roomInfo.id,
        page: "info",
      },
    });
  };

  return (
    <div className={styles.formContainer}>
      {/* <Title title="Create Room"></Title> */}

      <button onClick={onMoveStudyBoardPage} className={styles.moveBackBtn}>
        <i className="fas fa-angle-double-left"></i> 돌아가기
      </button>

      <div className={styles.form}>
        <h2>팀 정보 등록</h2>

        <div className={styles.updateContents}>
          <label htmlFor="name">팀명</label>
          <input
            type="text"
            name="name"
            value={roomInfo.name}
            onChange={onChange}
            placeholder="팀명을 입력해주세요"
            autoFocus
          />

          <label htmlFor="goal">목표</label>
          <input
            type="text"
            name="goal"
            value={roomInfo.goal}
            placeholder="목표를 입력해주세요"
            onChange={onChange}
          />

          <label htmlFor="description" className={styles.descLabel}>
            설명
          </label>
          <textarea
            type="text"
            name="description"
            value={roomInfo.description}
            onChange={onChange}
            placeholder="설명을 입력해주세요"
          />

          <label htmlFor="number">모집인원</label>
          <div className={styles.input}>
            <input
              type="number"
              name="number"
              min="1"
              max="4"
              value={roomInfo.number}
              onChange={onChange}
            />
            <span>명</span>
          </div>

          <label htmlFor="openKakao">오픈카톡</label>
          <input
            type="text"
            name="openKakao"
            value={roomInfo.openKakao}
            onChange={onChange}
            placeholder="오픈카톡 주소를 입력해주세요"
          />

          <label htmlFor="hashTags">태그</label>
          <form onSubmit={onAddTag}>
            <div className={styles.tagInput}>
              <input type="text" placeholder="태그를 추가해주세요" />
              <button>
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </form>

          <div></div>
          <div className={styles.tagsBox}>
            {roomTags &&
              roomTags.map((tag) => (
                <form onSubmit={onRemoveTag} key={tag}>
                  <input type="text" value={tag} disabled hidden />
                  <span>{tag}</span>
                  <button>x</button>
                </form>
              ))}
          </div>

          <label>프로필사진</label>
          <div className={styles.profileContainer}>
            <input
              type="file"
              id="inputFile"
              onChange={onSetImage}
              style={{ display: "none" }}
            />
            <span>{image ? image.name : null}</span>
            <label className={styles.inputFileButton} htmlFor="inputFile">
              등록
            </label>
          </div>
        </div>
      </div>

      <button className={styles.submitBtn} onClick={onSubmit}>
        생성
      </button>
    </div>
  );
}
