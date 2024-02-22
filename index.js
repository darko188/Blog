import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let posts = [];

posts.push({
    id: posts.length,
    day: "22/02/2024 ",
    time: "20:17",
    title: "Unraveling the Art of Blogging: Crafting Compelling Blog Posts",
    content: `In the ever-evolving landscape of digital communication, one medium has consistently 
            stood the test of time – the blog post. Whether you're a seasoned blogger or a newcomer
            to the realm of online content creation, understanding the anatomy of an engaging blog 
            post is crucial. In this exploration, we'll delve into the art of crafting compelling 
            blog posts that captivate audiences and leave a lasting impression.`,
    name: "Darko"
});

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index.ejs", { posts: posts });
});

app.get("/compose", (req, res) => {
    res.render("compose.ejs", { route: '/compose' });
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs", { route: '/contact' });
});

app.post("/compose", (req, res) => {
    const { title, content, name } = req.body;
    const currentDate = new Date();
    const newPost = {
        id: posts.length,
        day: currentDate.toLocaleDateString('en-GB'),
        time: currentDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        title: title,
        content: content,
        name: name
    };

    posts.unshift(newPost);
    res.redirect("/");
});

app.get("/post/:postId", (req, res) => {
    const postId = req.params.postId;
    const postIndex = posts.length - postId - 1;

    if (postIndex >= 0 && postIndex < posts.length) {
        const post = posts[postIndex];
        res.render("post.ejs", { post: post, posts: posts });
    } else {
        res.status(404).send("Post not found");
    }
});

app.get("/edit/:postId", (req, res) => {
    const postId = req.params.postId;
    const postIndex = posts.length - postId - 1;

    if (postIndex >= 0 && postIndex < posts.length) {
        const post = posts[postIndex];
        res.render("edit.ejs", { post: post, postId: postIndex });
    } else {
        res.status(404).send("Post not found");
    }
});

app.post("/edit/:postId", (req, res) => {
    const postId = req.params.postId;
    const postIndex = posts.length - postId - 1;

    if (postIndex >= 0 && postIndex < posts.length) {
        const { title, content, name } = req.body;

        posts[postIndex].title = title;
        posts[postIndex].content = content;
        posts[postIndex].name = name;

        res.redirect("/");
    } else {
        res.status(404).send("Post not found");
    }
});

app.post("/delete/:postId", (req, res) => {
    const postId = req.params.postId;
    const postIndex = posts.length - postId - 1;

    if (postIndex >= 0 && postIndex < posts.length) {
        posts.splice(postIndex, 1);

        posts.forEach((post, index) => {
            post.id = posts.length - index - 1;
        });

        res.redirect("/");
    } else {
        res.status(404).send("Post not found");
    }
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
