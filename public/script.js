// Global function for sidebar toggle (accessible from HTML onclick)
function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
        sidebar.classList.toggle("open");
    }
}

// Global function for blog expansion (accessible from HTML onclick)
window.expandBlog = function(blogId) {
    const card = document.getElementById(`blog-${blogId}`);
    if (!card) return;
    
    const content = card.querySelector('.blog-content');
    const button = card.querySelector('.explore-button, button[onclick*="expandBlog"]');
    
    if (content && button) {
        content.classList.remove('hidden');
        content.classList.toggle('expanded');
        button.textContent = content.classList.contains('expanded') ? 'Show Less' : 'Explore More';
    }
};

// Document ready functionality
document.addEventListener('DOMContentLoaded', function() {
    // Only run jQuery code if jQuery is available
    if (typeof $ !== 'undefined') {
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

        // Sidebar toggle functionality
        $(".sidebar-toggle").on("click", function() {
            toggleSidebar();
        });
    } else {
        // Fallback for pages without jQuery
        const createPostButton = document.getElementById('createPostButton');
        if (createPostButton) {
            createPostButton.addEventListener('click', function() {
                const formSection = document.getElementById('postForm');
                if (formSection) {
                    formSection.style.display = 'block';
                }
            });
        }

        // Sidebar toggle for non-jQuery pages
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', toggleSidebar);
        }
    }
});
