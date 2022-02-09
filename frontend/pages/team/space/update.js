import styles from "../../../scss/team/space/update.module.scss";

import { getWaitings } from "../../../api/member";
import { getRoomInfo, updateRoom, updateRoomImg } from "../../../api/studyroom";
import { setRoomInfo, setWaitings } from "../../../store/actions/roomAction";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { useState } from "react";

const mapStateToProps = (state) => {
  return {
    roomInfo: state.roomReducer.curRoomInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRoomInfo: (roomData) => dispatch(setRoomInfo(roomData)),
    setWaitings: (waitings) => dispatch(setWaitings(waitings)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateTeam);

function UpdateTeam({ roomInfo, setRoomInfo, setWaitings }) {
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
  const [image, setImage] = useState("");

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

    if (updateInfo.name === "") {
      console.log("방 이름을 작성해주세요!");
      return;
    } else if (updateInfo.number === "") {
      console.log("모집 인원 수를 작성해주세요!");
      return;
    } else if (updateTags.length === 0) {
      console.log("최소 하나 이상의 태그를 작성해주세요!");
      return;
    } else if (image === "") {
      console.log("스터디 프로필 이미지를 첨부해주세요!");
      return;
    }

    updateRoom(
      data,
      (res) => {
        console.log(res, "스터디 수정 완료!");
        const data = {
          studyId: router.query.id,
          image,
        };
        updateRoomImg(
          data,
          (res) => {
            console.log(res, "스터디 이미지 등록 성공");
            getRoomInfo(
              router.query.id,
              (res) => {
                const roomData = {
                  roomInfo: res.data.response,
                  host: res.data.response.host,
                  members: res.data.response.userDtos,
                  comments: res.data.response.commentDtos.content,
                };
                console.log(roomData);
                setRoomInfo(roomData);
                getWaitings(
                  router.query.id,
                  (res) => {
                    const waitings = res.data.response;
                    setWaitings(waitings);
                    console.log(res, "가입대기명단 조회 성공!");
                  },
                  (err) => {
                    console.log(err, "가입대기명단 조회에 실패하였습니다.");
                  }
                );
              },
              (err) => {
                console.log(err, "스터디를 조회할 수 없습니다.");
              }
            );
          },
          (err) => {
            console.log(err, "스터디 이미지 등록 실패");
          }
        );
      },
      (err) => {
        console.log(err, "스터디를 수정할 권한이 없습니다.");
      }
    );

    router.push({
      pathname: `/team/space`,
      query: {
        id: roomInfo.id,
        page:"info"
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

  //studyroom image
  const onSetImage = (event) => setImage(event.target.files[0]);

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
            {updateTags && updateTags.map((tag, index) => (
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
          <label htmlFor="profile">프로필 사진</label>
          <input type="file" name="profile" onChange={onSetImage} />
        </div>
      ) : (
        <h1>해당 내역을 찾을 수 없습니다.</h1>
      )}
      <button onClick={onUpdateTeam}>수정</button>
      <button onClick={onBeforePage}>취소</button>
    </div>
  );
}
