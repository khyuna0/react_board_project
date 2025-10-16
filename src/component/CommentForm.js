import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CommentForm({ post, user }) {
  const [newComment, setNewComment] = useState(""); //새로운 댓글 저장 변수
  const [commentErrors, setCommentErrors] = useState({});

  const navigate = useNavigate();

  //댓글 쓰기 함수->원 게시글의 id를 파라미터로 제출
  const handleCommentSubmit = async (e) => {
    //백엔드에 댓글 저장 요청
    e.preventDefault();
    if (!user) {
      alert("로그인 후 댓글을 작성해 주세요");
      navigate("/login");
      return;
    }
    if (!newComment.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    try {
      await api.post(`/api/comments/${post.id}`, { content: newComment });
      setNewComment("");
      if (!window.confirm("댓글을 입력하시겠습니까?")) {
        return;
      }
      //댓글 리스트 불러오기 호출
      loadComments(); //새 댓글 기존 댓글 리스트에 반영
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setCommentErrors(err.response.data);
      } else {
        console.error(err);
        alert("댓글 등록 실패!");
      }
    }
  };

  return (
    // {/* 댓글 입력 폼 시작! */}
    <div>
      <h3>댓글 쓰기</h3>
      <form onSubmit={handleCommentSubmit} className="comment-form">
        <textarea
          placeholder="댓글을 입력하세요."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        {commentErrors.content && (
          <p style={{ color: "red" }}>{commentErrors.content}</p>
        )}
        <button type="submit" className="comment-button">
          등록
        </button>
      </form>
    </div>
    // {/* 댓글 입력 폼 끝! */}
  );
}

export default CommentForm;
