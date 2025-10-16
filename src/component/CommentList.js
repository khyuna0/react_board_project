import { useEffect } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function CommentList({ post, loadComments, user }) {
  //댓글 관련 이벤트 처리 시작!
  const [newComment, setNewComment] = useState(""); //새로운 댓글 저장 변수
  const [comments, setComments] = useState([]); //백엔드에서 가져온 기존 댓글 배열
  const [commentErrors, setCommentErrors] = useState({});
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadComments();
  }, [post.id]);

  //댓글 리스트 불러오기 함수
  const loadComments = async () => {
    try {
      const res = await api.get(`/api/comments/${id}`);
      //res->댓글 리스트 저장(ex:7번글에 달린 댓글 4개 리스트)
      setComments(res.data);
    } catch (err) {
      console.error(err);
      alert("댓글 리스트 불러오기 실패!");
    }
  };

  //날짜 format 함수 -> 날짜와 시간 출력
  const formatDate = (dateString) => {
    return dateString.substring(0, 10);
  };

  
  //댓글 삭제 이벤트 함수
  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      //확인->true, 취소->false
      return;
    }
    try {
      await api.delete(`/api/comments/${commentId}`);
      loadComments();
    } catch (err) {
      console.error(err);
      alert("댓글 삭제 권한이 없거나 삭제할 수 없는 댓글입니다.");
    }
  };

  //댓글 수정 이벤트 함수->백엔드 수정 요청
  const handleCommentUpdate = async (commentId) => {
    try {
      await api.put(`/api/comments/${commentId}`, {
        content: editingCommentContent,
      });
      setEditingCommentId(null);
      setEditingCommentContent("");
      loadComments();
    } catch (err) {
      console.error(err);
    }
  };

  //댓글 수정 여부 확인
  const handleCommentEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
  };

  //댓글 관련 이벤트 처리 끝!

  return (
    //   {/* 댓글 영역 시작! */}
    <div>
      {/* 기존 댓글 리스트 시작! */}
      <ul className="comment-list">
        {/* {comments.length === 0 && <p>아직 등록된 게시물이 없습니다.</p>} */}
        {comments.map((c) => (
          <li key={c.id} className="comment-item">
            <div className="comment-header">
              <div className="comment-author">
                작성자 : {c.author?.username}
              </div>
              <div className="comment-content">{c.content}</div>
              <div className="comment-date">
                등록일 : {formatDate(c.createDate)}
              </div>
            </div>

            {editingCommentId === c.id ? (
              /* 댓글 수정 섹션 시작! */
              <div className="comment-save-group">
                <textarea
                  value={editingCommentContent}
                  onChange={(e) => setEditingCommentContent(e.target.value)}
                />
                <button
                  className="comment-save"
                  onClick={() => handleCommentUpdate(c.id)}
                >
                  저장
                </button>
                <button
                  className="comment-cancel"
                  onClick={() => setEditingCommentId(null)}
                >
                  취소
                </button>
              </div>
            ) : (
              /* 댓글 수정 섹션 끝! */
              /* 댓글 읽기 섹션 시작! */
              <>
                <div className="button-group">
                  {/* 로그인한 유저 본인이 쓴 댓글만 삭제 수정 가능 */}
                  {user === c.author?.username && (
                    <>
                      <button
                        className="comment-edit"
                        onClick={() => handleCommentEdit(c)}
                      >
                        수정
                      </button>
                      <button
                        className="comment-delete"
                        onClick={() => handleCommentDelete(c.id)}
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
              </>
              /* 댓글 읽기 섹션 끝! */
            )}
          </li>
        ))}
      </ul>
      {/* 기존 댓글 리스트 끝! */}
    </div>
    //   {/* 댓글 영역 끝! */}
  );
}

export default CommentList;
