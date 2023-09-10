// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments {
	//constructor is used to initialize the instance of the class
	//when ever a new instance is created
	//object is the instance of the class
	//new object is created through the constructor function
	constructor(postId) {
		
		this.postId = postId;
		// console.lof(postId);
		this.postContainer = $(`#post-${postId}`);
		// console.log(postContainer);
		// post-<%= pt._id %>-comment-form
		this.newCommentForm = $(`#post-${postId}-comment-form`);

		//call the function for the creating the comment in the ajax form
		this.createComment(postId);

		let self = this;
		// console.log(this);
		//call all the existing comments
		//for deleting the comment through the ajax
		$(" .delete-comment-btn", this.postContainer).each(function () {
			self.deleteComment($(this));
		});
	}

	createComment(postId) {
		//create the comment through the ajax dynamic comment
		let pSelf = this;
		this.newCommentForm.submit(function (e) {
			e.preventDefault(); //so that refreshing the page won't happen
			let cSelf = this;

			//now ajax call
			$.ajax({
				type: "POST",
				url: "/comments/createComment",
				data: $(cSelf).serialize(),
				success: function (data) {
					let newComment = pSelf.newCommentDom(data.data.comment);
					$(`#post-comments-${postId}`).prepend(newComment);
					pSelf.deleteComment($('.delete-comment-button',newComment));

					// CHANGE :: enable the functionality of the toggle like button
					// on the new comment
                    new ToggleLike($(' .toggle-like-button', newComment));

					new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

				},error: function(error){
                    console.log(error.responseText);
                }
			});
		});
	}

	//newCommentDom called
	newCommentDom(comment) {
		//I have added a class  `delete-comment-btn`
		//to delete comment link and also id to the comment li
		return $(`<li id="comment-${comment._id}">

                <p>
                    <!-- deleting the comment   -->
                    <small>
                        <a class="delete-comment-btn" href="/comments/destroyComment/${comment.id} %>">DELc</a>
                    </small>
            
                    ${comment.content}
                    <br>
                    <small>
                        ${comment.user.name}
                    </small>
					<small>
						<a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
							0 Likes
						</a>
				</small>
                </p>
            </li>`);
	}

	// deleteComment call
	deleteComment(deleteLink) {
		$(deleteLink).click(function (e) {
			e.preventDefault();

			$.ajax({
				type: "GET",
				url: $(deleteLink).prop("href"),
				success: function (data) {
					$(`#comment-${data.data.comment._id}`).remove();

					new Noty({
						theme: "relax",
						text: "Comment Deleted",
						type: "success",
						layout: "topRight",
						timeout: 1500,
					}).show();
				},
				error: function (error) {
					console.log(error.responseText);
				},
			});
		});
	}
}
