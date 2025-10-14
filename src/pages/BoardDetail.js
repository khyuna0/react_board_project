import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";

function BoardDetail ({ user }) {
    const navigate = useNavigate();
    // 글 불러오기
    const[post, setPost] = useState(null); // 해당 글 아이디로 요청한 글 객체
    const {id} = useParams(); // board/:id 파라미터 받아오기
    const [loading, setLoading] = useState(true); // 로딩
    const [error, setError] = useState(null);

    const loadPost = async() => { // 특정 글 아이디로 해당 글 1개 요청

        try {
            setLoading(true);
            const res = await api.get(`/api/board/${id}`);
            setPost(res.data); // 특정 글 id 객체
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
    
    if(loading) return <p>게시글 로딩 중...</p>;
    if(error) return <p style={{color:"red"}}>{error}</p>
    if(!post) return <p style={{color:"red"}}>해당 게시글이 존재하지 않습니다.</p>

    // 로그인 상태이면서 로그인한 유저와 글을 쓴 유저가 동일할 때 T
    const isAuthor = user && user === post.author.username;

    return (
        <div className="detail-container">
            <h2 className="title">{post.title}</h2>
            <p className="author">{post.author.username}</p>
            <div className="content">{post.content}</div>
            
            <div className="button-group">
                <button onClick={() => navigate("/board")}>글목록</button>

                {/* 로그인 한 유저 본인이 쓴 글만 삭제 수정 가능 */}
                { isAuthor&& (
                    <>
                        <button>수정</button>
                        <button>삭제</button>
                    </>
                )}

            </div>
        </div>
    );
}

export default BoardDetail;