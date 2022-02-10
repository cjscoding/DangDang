import styles from "../../../scss/team/form.module.scss";

import { getWaitings } from "../../../api/member";
import { getRoomInfo, updateRoom, updateRoomImg } from "../../../api/studyroom";
import { setRoomInfo, setWaitings } from "../../../store/actions/roomAction";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";

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
    name: "",
    number: "",
    description: "",
    openKakao: "",
    goal: "",
    hashTags: [],
  };

  const [updateInfo, setUpdateInfo] = useState(roomInit);
  const [updateTags, setUpdateTags] = useState([]);
  const [image, setImage] = useState("");

  useEffect(() => {
    const roomObj = {
      name: roomInfo.name,
      number: roomInfo.number,
      description: roomInfo.description,
      openKakao: roomInfo.openKakao,
      goal: roomInfo.goal,
      hashTags: roomInfo.hashTags,
    };
    setUpdateInfo(roomObj);
    setUpdateTags(roomObj.hashTags);
  }, [roomInfo]);

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
                    onMoveInfoPage();
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
  const onMoveInfoPage = () => {
    router.push({
      pathname: `/team/space`,
      query: {
        id: roomInfo.id,
        page: "info",
      },
    });
  };

  //studyroom image
  const onSetImage = (event) => setImage(event.target.files[0]);

  return (
    <div className={styles.formContainer}>
      <button onClick={onMoveInfoPage} className={styles.moveBackBtn}>
        <i className="fas fa-angle-double-left"></i> 돌아가기
      </button>

      <div className={styles.form}>
        <h2>팀 정보 수정</h2>

        <div className={styles.updateContents}>
          <label htmlFor="name">팀명</label>
          <input
            type="text"
            name="name"
            value={updateInfo.name}
            onChange={onChange}
            placeholder="팀명을 입력해주세요"
            autoFocus
          />

          <label htmlFor="goal">목표</label>
          <input
            type="text"
            name="goal"
            value={updateInfo.goal}
            placeholder="목표를 입력해주세요"
            onChange={onChange}
          />

          <label htmlFor="description" className={styles.descLabel}>
            설명
          </label>
          <textarea
            type="text"
            name="description"
            value={updateInfo.description}
            onChange={onChange}
            placeholder="설명을 입력해주세요"
          />

          <label htmlFor="number">모집인원</label>
          <div className={styles.input}>
            <input
              type="text"
              name="number"
              value={updateInfo.number}
              onChange={onChange}
            />
            <span>명</span>
          </div>

          <label htmlFor="openKakao">오픈카톡</label>
          <input
            type="text"
            name="openKakao"
            value={updateInfo.openKakao}
            onChange={onChange}
            placeholder="오픈카톡 주소를 입력해주세요"
          />

          <label htmlFor="hashTags">태그</label>
          <form onSubmit={onAddTag}>
            <div className={styles.tagInput}>
              <input type="text" placeholder="태그를 입력해주세요" />
              <button>
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </form>

          <div></div>
          <div className={styles.tagsBox}>
            {updateTags &&
              updateTags.map((tag) => (
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

      <button onClick={onUpdateTeam} className={styles.submitBtn}>
        수정
      </button>
    </div>
  );
}
