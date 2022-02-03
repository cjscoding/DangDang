import styles from "../../../scss/team/space/update.module.scss";

import { updateRoom } from "../../../api/studyroom";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { useState } from "react";

const mapStateToProps = (state) => {
  return {
    roomInfo: state.roomReducer.curRoomInfo,
  };
};

export default connect(mapStateToProps, null)(UpdateTeam);

function UpdateTeam({ roomInfo }) {
  const router = useRouter();

  const roomInit = {
    name: roomInfo.name,
    number: roomInfo.number,
    description: roomInfo.description,
    openKakao: roomInfo.openKakao,
    goal: roomInfo.goal,
    hashTags: roomInfo.hashTags,
  };

  const [updateInfo, setUpdateInfo] = useState(roomInit);
  const [updateTags, setUpdateTags] = useState(roomInit.hashTags);

  //final submit
  const onUpdateTeam = (event) => {
    event.preventDefault();
    const newInfo = {
      ...updateInfo,
      hashTags: updateTags,
    };

    const data = {
      studyId: roomInfo.id,
      newInfo,
    };

    updateRoom(
      data,
      (res) => {
        console.log(res, "스터디 수정 완료!");
      },
      (err) => {
        console.log(err, "스터디를 수정할 권한이 없습니다.");
      }
    );

    router.push({
      pathname: `/team/space`,
      query: {
        id: roomInfo.id,
      },
    });
  };

  //input values
  const onChange = (event) => {
    const { name, value } = event.target;

    const newInfo = {
      ...updateInfo,
      [name]: value,
    };

    setUpdateInfo(newInfo);
  };

  //hashTags
  const onAddTag = (event) => {
    event.preventDefault();
    const newTag = event.target[0].value;
    setUpdateTags([...updateTags, newTag]);
    event.target[0].value = "";
  };

  const onRemoveTag = (event) => {
    event.preventDefault();
    const removeTag = event.target[0].value;
    setUpdateTags(updateTags.filter((tag) => tag !== removeTag));
  };

  //go back
  const onBeforePage = () => {
    router.push({
      pathname: `/team/space`,
      query: {
        id: roomInfo.id,
      },
    });
  };

  return (
    <div>
      {updateInfo ? (
        <div>
          <label htmlFor="name">팀명</label>
          <input
            type="text"
            name="name"
            value={updateInfo.name}
            onChange={onChange}
          />
          <label htmlFor="number">모집인원</label>
          <input
            type="text"
            name="number"
            value={updateInfo.number}
            onChange={onChange}
          />
          <label htmlFor="goal">목표</label>
          <input
            type="text"
            name="goal"
            value={updateInfo.goal}
            onChange={onChange}
          />
          <label htmlFor="description">설명</label>
          <input
            type="text"
            name="description"
            value={updateInfo.description}
            onChange={onChange}
          />
          <label htmlFor="openKakao">오픈카카오</label>
          <input
            type="text"
            name="openKakao"
            value={updateInfo.openKakao}
            onChange={onChange}
          />
          <label htmlFor="hashTags">태그</label>
          <form onSubmit={onAddTag}>
            <div>
              <input type="text" />
              <button>태그 추가</button>
            </div>
          </form>
          <div>
            {updateTags.map((tag, index) => (
              <form onSubmit={onRemoveTag} key={index}>
                <div>
                  <input
                    type="text"
                    value={tag}
                    disabled
                    className={styles.disabled}
                  />
                  <button>태그 삭제</button>
                </div>
              </form>
            ))}
          </div>
        </div>
      ) : (
        <h1>해당 내역을 찾을 수 없습니다.</h1>
      )}
      <button onClick={onUpdateTeam}>수정</button>
      <button onClick={onBeforePage}>취소</button>
    </div>
  );
}
