import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

const userPost = [];
const contactRequests = []; // Array to store contact requests
let nextPostId = 1; // Counter for unique post IDs

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs", {
        userPost,
        editingPost: null, // Default value for editingPost
    });
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs", {
        message: null,
        contactRequests // Pass the contactRequests array to the template
    });
});

app.get("/nature", (req, res) => {
    res.render("nature.ejs");
});
app.get("/technology", (req, res) => {
    res.render("technology.ejs");
});
app.get("/space", (req, res) => {
    res.render("space.ejs");
});
app.get("/sports", (req, res) => {
    res.render("sports.ejs");
});
app.get("/games", (req, res) => {
    res.render("games.ejs");
});
app.get("/movies", (req, res) => {
    res.render("movies.ejs");
});
app.get("/education", (req, res) => { 
    res.render("education.ejs");
});
app.get("/medical", (req, res) => {
    res.render("medical.ejs");
});
app.post("/submit-post", upload.single("photo"), (req, res) => {
    // Input validation
    if (!req.body.title || !req.body.content) {
        return res.status(400).send("Title and content are required.");
    }
    
    if (req.body.title.length > 200) {
        return res.status(400).send("Title too long (max 200 characters).");
    }
    
    if (req.body.content.length > 5000) {
        return res.status(400).send("Content too long (max 5000 characters).");
    }
    
    const newPost = {
        id: nextPostId++,
        postTitle: req.body.title.trim(),
        postContent: req.body.content.trim(),
        postPhoto: req.file ? `/uploads/${req.file.filename}` : null,
        createdAt: new Date().toISOString()
    };
    userPost.push(newPost);

    res.render("index.ejs", {
        userPost,
        editingPost: null, // Ensure editingPost is passed
    });
});

app.post("/submit-contact-request", (req, res) => {
    // Input validation
    if (!req.body.contactName || !req.body.contactEmail || !req.body.contactPhone) {
        return res.status(400).send("All fields are required.");
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.contactEmail)) {
        return res.status(400).send("Invalid email format.");
    }
    
    const newContactRequest = {
        name: req.body.contactName.trim(),
        email: req.body.contactEmail.trim(),
        phone: req.body.contactPhone.trim(),
        submittedAt: new Date().toISOString()
    };
    contactRequests.push(newContactRequest);

    console.log("New contact request:", newContactRequest); // Log the contact request to the terminal

    res.render("contact.ejs", {
        message: "Request submitted successfully",
        contactRequests // Pass the contactRequests array to show them
    });
});

// Route to render the edit form with the post data
app.get("/edit-post/:id", (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const postToEdit = userPost.find((post) => post.id === postId);

    if (postToEdit) {
        res.render("index.ejs", {
            userPost, // All posts to display        
            editingPost: postToEdit // Post to edit
        });
    } else {
        res.status(404).send("Post not found.");
    }
});

// Route to handle post update
app.post("/update-post/:id", upload.single("photo"), (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const postIndex = userPost.findIndex((post) => post.id === postId);

    if (postIndex !== -1) {
        userPost[postIndex].postTitle = req.body.title;
        userPost[postIndex].postContent = req.body.content;
        if (req.file) {
            userPost[postIndex].postPhoto = `/uploads/${req.file.filename}`;
        }

        res.redirect("/"); // Redirect to the main page after updating
    } else {
        res.status(404).send("Post not found.");
    }
});
 
app.post("/delete-post/:id", (req, res) => {
    const postId = parseInt(req.params.id, 10); // Extract and parse the post ID from the route parameter

    const postIndex = userPost.findIndex((post) => post.id === postId); // Find the index of the post to delete
    if (postIndex !== -1) { 
        userPost.splice(postIndex, 1); // Remove the post at the found index
    }
    res.redirect("/"); // Redirect to the homepage after deletion
});

// Add error handling middleware
app.use((req, res, next) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Page Not Found - The GenZ Blog</title>
            <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
            <div style="text-align: center; padding: 50px;">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/" style="color: #007bff; text-decoration: none;">Go back to home</a>
            </div>
        </body>
        </html>
    `);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


