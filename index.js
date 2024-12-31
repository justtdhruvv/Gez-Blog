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

app.get("/nature.ejs", (req, res) => {
    res.render("nature.ejs");
});
app.get("/technology.ejs", (req, res) => {
    res.render("technology.ejs");
});
app.get("/space.ejs", (req, res) => {
    res.render("space.ejs");
});
app.get("/sports.ejs", (req, res) => {
    res.render("sports.ejs");
});
app.get("/games.ejs", (req, res) => {
    res.render("games.ejs");
});
app.get("/movies.ejs", (req, res) => {
    res.render("movies.ejs");
});
app.get("/education.ejs", (req, res) => {
    res.render("education.ejs");
});
app.get("/medical.ejs", (req, res) => {
    res.render("medical.ejs");
});
app.post("/submit-post", upload.single("photo"), (req, res) => {
    const newPost = {
        id: userPost.length + 1,
        postTitle: req.body["title"],
        postContent: req.body["content"],
        postPhoto: req.file ? `/uploads/${req.file.filename}` : null
    };
    userPost.push(newPost);

    res.render("index.ejs", {
        userPost,
        editingPost: null, // Ensure editingPost is passed
    });
});

app.post("/submit-contact-request", (req, res) => {
    const newContactRequest = {
        name: req.body.contactName,
        email: req.body.contactEmail,
        phone: req.body.contactPhone
    };
    contactRequests.push(newContactRequest);

    console.log("New contact request:", newContactRequest); // Log the contact request to the terminal

    res.render("contact.ejs", {
        message: "Request submitted successfully",
        contactRequests: [] // Do not pass the contactRequests array to the template
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

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
