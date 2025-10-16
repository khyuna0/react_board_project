function BoardDetail2 () {

    

    return (
    <div className="detail-container">
      {editing ? (
        <PostEdit post={post} setEditing={setEditing} setPost={setPost} />
      ) : (
        <PostView
          post={post}
          user={user}
          onEdit={() => setEditing(true)}
          onDelete={() => navigate("/board")}
        />
      )}

      <div className="comment-section">
        <h3>댓글</h3>
        <CommentForm boardId={id} loadComments={loadComments} />
        <CommentList
          comments={comments}
          user={user}
          loadComments={loadComments}
        />
      </div>
    </div>
  );
}

export default BoardDetail2;