import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import "./BoardDetail.css"

function BoardDetail ({ user }) {
    const navigate = useNavigate();
  
    const [post, setPost] = useState(null); // 해당 글 아이디로 요청한 글 객체
    const {id} = useParams(); // board/:id 파라미터 받아오기
    const [loading, setLoading] = useState(true); // 로딩
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false); // 수정 화면 출력 여부
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

  // 글 불러오기
    const loadPost = async() => { // 특정 글 아이디로 해당 글 1개 요청

        try {
            setLoading(true);
            const res = await api.get(`/api/board/${id}`);
            setPost(res.data); // 특정 글 id 객체
            // 원본 글의 제목, 내용을 수정화면에 표시하는 변수인 title, content 변수에 저장
            setTitle(res.data.title);
            setContent(res.data.content);
        } catch (err) {
            console.error(err);
            setError("해당 게시글은 존재하지 않습니다.")
        } finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPost();
    },[id]); // id 변경, 재로딩될때 실행
    
    // 댓글 관련 이벤트 시작
    const [newComment, setNewComment] = useState(""); // 새로운 댓글이 저장될 변수
    const [comments, setComments] = useState([]);
    const [editCommentContent, setEditCommentContent] = useState("");
    const [editCommentId, setEditCommentId] = useState();

    // 댓글 제출 함수
    const handleCommentSubmit = () => {

    }
    // 댓글 삭제 함수
    const handleCommentDelete = (commentId) => {

    }
    // 댓글 수정 함수
    const handleCommentUpdate = () => {

    }


    //날짜 format 함수 (날짜, 시간 출력)
    const formatDate = (dateString) => {
        
        return dateString.substring(0,10);
    }
    // 댓글 관련 이벤트 처리 끝


    if(loading) return <p>게시글 로딩 중...</p>;
    if(error) return <p style={{color:"red"}}>{error}</p>
    if(!post) return <p style={{color:"red"}}>해당 게시글이 존재하지 않습니다.</p>

    // 로그인 상태이면서 로그인한 유저와 글을 쓴 유저가 동일할 때 T
    const isAuthor = user && user === post.author.username;

    // 특정 id로 글 삭제
    const handleDelete = async() => {
        try{
            if(window.confirm("정말 삭제하시겠습니까?")) { // 확인 T , 취소 F
                await api.delete(`/api/board/${id}`);
                alert("삭제 완료");
                navigate("/board",{replace:true});
            } else {
                return
            }
        } catch (err) {
            console.error(err);
            if(err.response.status === 403) {
                alert("해당 글에 대한 권한이 없습니다.");
                navigate("/board",{replace:true});
            } else {
                alert("삭제할 글이 존재하지 않습니다.");
                navigate("/board",{replace:true});
            }
        }
    }

    // 글 수정
    const handleUpdate = async() => {

        if(!window.confirm("수정하시겠습니까?")) {
            return;
        }

        try{
            const res = await api.put(`/api/board/${id}`, {title, content})
            // alert("게시글이 수정되었습니다.");
            setPost(res.data)
            setEditing(false); // 상세보기 화면 전환
            
        } catch (err) {
             console.error(err);
            if(err.response.status === 403) {
                alert("해당 글에 대한 권한이 없습니다.");
                navigate("/board",{replace:true});
            } else {
                alert("삭제할 글이 존재하지 않습니다.");
                navigate("/board",{replace:true});
            }
        }
    }

    return (
        <div className="detail-container">
            {editing  ? (
                // 글 수정
                <div className="edit-form">
                    <h2>글 수정</h2>
                    <input type="text" value={title}
                    onChange={(e) => setTitle(e.target.value)}/>
                    <textarea type="text" value={content}
                    onChange={(e) => setContent(e.target.value)}/>
                    <div className="button-group">
                        <button className="edit-button" onClick={handleUpdate}>저장</button>
                        <button className="delete-button" onClick={() => setEditing(false) }>취소</button>
                    </div>
                </div>
            ):(
                // 글 삭제
                <> 
                    <h2 className="title">{post.title}</h2>
                    <p className="author">글쓴이 : {post.author.username}</p>
                    <div className="content">{post.content}</div>
                    
                    <div className="button-group">
                        <button className="list-button" onClick={() => navigate("/board")}>목록</button>

                        {/* 로그인 한 유저 본인이 쓴 글만 삭제 수정 가능 */}
                        { user === c.author.username && (
                            <>
                                <button className="edit-button" onClick={() => setEditing(true)}>수정</button>
                                <button className="delete-button" onClick={handleCommentDelete(c.id)}>삭제</button>
                            </>
                        )}
                    
                    </div>
                    
                    {/* 댓글 영역 시작 */}
                        <div className="comment-section">
                            {/* 댓글 입력 폼 시작 */}
                            <h3>댓글 쓰기</h3>
                            <form onSubmit={handleCommentSubmit} className="comment-form">
                                <textarea placeholder="댓글을 입력하세요." value={newComment} onChange={(e) => setNewComment(e.target.value)}></textarea>
                                <button type="submit" className="comment-buttons">등록</button>
                            </form>

                            {/* 기존 댓글 리스트 */}
                            <ul className="comment-list">
                                {comments.map((c) => ( 
                                <li key={c.id} className="comment-item">

                                    <div className="comment-header">
                                        <span className="commnet-author">
                                            {c.author.username}
                                        </span>
                                        <span className="comment-date">
                                            {formatDate(c.createDate)}
                                        </span>
                                    </div>

                                    <div className="comment-content">
                                        {c.content}
                                    </div>

                                    <div className="button-group">
                                        <button className="list-button" onClick={() => navigate("/board")}>목록</button>

                                        {/* 로그인 한 유저 본인이 쓴 글만 삭제 수정 가능 */}
                                        {isCommentAuthor && (
                                            <>
                                                <button className="edit-button" onClick={() => handleCommentUpdate(c)}>수정</button>
                                                <button className="delete-button" onClick={handleDelete}>삭제</button>
                                            </>
                                        )}
                                    </div>

                                </li>
                                ))}
                            </ul>
                        </div>
                    {/* 댓글 영역 끝 */}

                </>
            )}
        </div>
    );
}

export default BoardDetail;