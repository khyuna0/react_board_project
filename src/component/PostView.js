function PostView ({user, post, OnEdit, OnDelete }) {     //  글 보기 컴포넌트

    const navigate = useNavigate();

    const [post, setPost] = useState(null); //해당 글 id로 요청한 글 객체
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadPost = async () => { //특정 글 id로 글 1개 요청하기
        try{
            setLoading(true);
            const res = await api.get(`/api/board/${id}`);            
            setPost(res.data); //특정 글 id 객체를 state에 등록
            setTitle(res.data.title); 
            //원본 글의 제목을 수정화면에 표시하는 변수인 title 변수에 저장
            setContent(res.data.content);
            //원본 글의 내용을 수정화면에 표시하는 변수인 content 변수에 저장
            
        } catch(err) {
            console.error(err);
            setError("해당 게시글은 존재하지 않습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPost(); //게시글 다시 불러오기
        loadComments(); //게시글에 달린 댓글 리스트 다시 불러오기
    },[id]);
    
    //글삭제
    const handleDelete = async () => {
        if(!window.confirm("정말 삭제하시겠습니까?")) { 
            return;
        }
        try {
            await api.delete(`/api/board/${id}`);
            alert("게시글 삭제 성공!");
            navigate("/board");
        } catch (err) {
            console.error(err);
            if(err.response.status === 403){
                alert("삭제 권한이 없습니다.");
            } else {
                alert("삭제 실패!");
            }
        }
    }

    if(loading) return <p>게시글 로딩 중....</p>;
    if(error) return <p style={{color:"red"}}>{error}</p>
    if(!post) return <p sytle={{color:"blue"}}>해당 게시글이 존재하지 않습니다.</p>

    return (
        
        <div>
            <h2>{post.title}</h2>
            <p className="author">작성자 : {post.author.username}</p>
            <div className="content">{post.content}</div>

            <div className="button-group">
                <button className="list-button" onClick={()=>navigate("/board")}>글목록</button>
                
                {/* 로그인한 유저 본인이 쓴글만 삭제 수정 가능 */}
                {isAuthor && (
                <>    
                    <button className="edit-button" onClick={() => setEditing(true)}>수정</button>
                    <button className="delete-button" onClick={() =>handleDelete}>삭제</button>
                </>
                )}
            </div>
        </div>
    )
}

export default PostView;