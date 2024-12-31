// Handle sidebar link clicks
$("aside.sidebar ul li a").click(function(event) {
    event.preventDefault();
    const page = $(this).data("page");
    const script = $(this).data("script");

    if (page) {
        $("#mainContent").load(`/${page}.ejs`, function(response, status, xhr) {
            if (status == "error") {
                console.log("Error loading page: " + xhr.status + " " + xhr.statusText);
            } else {
                console.log("Page loaded successfully");
                if (script) {
                    $.getScript(script);
                }
            }
        });
    }
});

function toggleSidebar() {
    $(".sidebar").toggleClass("open");
}

$(document).ready(function() {
    const formSection = $('#postForm');
    const formHeading = $('#formHeading');
    const formElement = $('#postFormElement');
    const titleInput = $('#title');
    const contentInput = $('#content');

    // Show form for creating a new post
    $('#createPostButton').on('click', function() {
        formSection.show();
        formHeading.text('Create a New Post');
        formElement.attr('action', '/submit-post');
        formElement[0].reset(); // Reset the form fields
    });

    // Handle edit buttons
    $('body').on('click', '.edit-button', function() {
        const postId = $(this).data('id');
        const postTitle = $(this).data('title');
        const postContent = $(this).data('content');

        formSection.show();
        formHeading.text('Edit Post');
        formElement.attr('action', `/update-post/${postId}`);
        titleInput.val(postTitle);
        contentInput.val(postContent);
    });

    // Blog expansion functionality
    window.expandBlog = function(blogId) {
        const card = $(`#blog-${blogId}`);
        const content = card.find('.blog-content');
        const button = card.find('.explore-button');

        content.removeClass('hidden').toggleClass('expanded');
        button.text(content.hasClass('expanded') ? 'Show Less' : 'Explore More');
    };

    // Sidebar toggle functionality
    $(".sidebar-toggle").on("click", function() {
        toggleSidebar();
    });
});
