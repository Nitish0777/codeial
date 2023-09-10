{
	// console.log("hello");
	// method to submit the form data for new post using AJAX
	let createPost = function () {
		let newPostForm = $("#new-post-form");
		// console.log(newPostForm);

		// The submit event triggers when the form is submitted, it is usually used to
		// validate the form before sending it to the server or to abort the submission
		// and process it in JavaScript.
		newPostForm.submit(function (e) {
			e.preventDefault();

			//we post manually through the ajax request...
			$.ajax({
				type: "POST",
				url: "/posts/createPost",
				//this convert the form data in json
				data: newPostForm.serialize(),
				success: function (data) {
					//need to call the function here
					// console.log(data);

					// console.log(newPost);
					// console.log(data.data.post);
					//now append to the list id
					$("#posts-list-container>ul").prepend(newPost);
					//need to call the delete post
					deletePost($(" .delete-post-btn", newPost));

					//call the create comment Class
					new PostComments(data.data.post._id);

					// CHANGE :: enable the functionality of the toggle
					// like button on the new post
                    new ToggleLike($(' .toggle-like-button', newPost));

					//class Noty
					new Noty({
						theme: "relax",
						text: "Post published!",
						type: "success",
						layout: "topRight",
						timeout: 1500,
					}).show();
				},
				error: function (error) {
					console.log(`what is the ${error}` + error.responseText);
					// console.log(data);
				},
			});
		});
	};

	//  method to create a post in DOM
	//  this function will help in converting the _post.ejs html into the html text
	let newPostDom = function (post) {
		//post coming from the post_controller ajax call

		//CHANGE:show the count of the zero likes on this post

		return $(`<li id="post-${post._id}">
                <p>
                
                
                    <!-- then we able to delete the post form the homeScreen -->
                    <small>
                        <a class="delete-post-btn" href="/posts/destroyPost/${post._id}">DEL</a>
                    </small>
            
                ${post.content}
                <br>
                <small>
                    ${post.user.name}
                </small>
				<br>
				<small>
						<a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
							0 Likes
						</a>
				</small>
                </p>
            
    
                <div class=" post-comments  ">
                   
                        <form action="/comments/createComment" method="POST">
                            <input type="text" name="content" placeholder="Add Comment...." required>
                            <input type="hidden" name="post" value="${post._id}">
                            <input type="submit" value="Add comment">
                        </form>
                        
                  
                    <div class=" postComments-list ">
                        <ul id="post-comments-${post._id}">
                        </ul>
            
                    </div>
                </div>
    
                </li>`);
	};

	//  Delete a Post form the DOM..

	//method to delete a post from DOM
	let deletePost = function (deleteLink) {
		//call the del link class using jQuery or jsDOM
		$(deleteLink).click(function (e) {
			e.preventDefault(); //so that page won't load again and again

			$.ajax({
				type: "GET",
				url: $(deleteLink).prop("href"), //this is how you get value of the href
				success: function (data) {
					//this will remove the post
					$(`#post-${data.data.post_id}`).remove();

					new Noty({
						theme: "relax",
						text: "Post Deleted",
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
	};

	//loop over all then existing  posts on the page
	//(When window loads for the first time)
	//and call the delete post method
	//on delete link of each also add AJAX
	//(using the class we've created) to delete button of each

	let convertPostToAjax = function () {
		// the $().each() method is a convenient way to iterate
		//over a collection of elements in jQuery and perform a
		//function for each element.
		$(".post-comments-list>ul>li").each(function () {
			let self = $(this);
			let deleteButton = $(" .delete-post-btn", self);
			deletePost(deleteButton);

			//get the post id by splitting the id attributes
			let postIds = self.prop("id").split("-")[1];
			new PostComments(postIds);
		});
	};

	createPost();
	convertPostToAjax();
}
