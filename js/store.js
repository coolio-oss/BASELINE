export const store = {
    user: {
        username: "",
        bio: "",
        realname: "",
        club: "",
        rating: "",
        level: 0,
        pic: "assets/images/default-avatar.jpg", // Standardbild
    },
    posts: [],
    load() {
        const data = JSON.parse(localStorage.getItem("profileData"));
        if (data) {
            this.user = data.user || this.user;   // fallback, falls undefined
            this.posts = data.posts || [];
        }
    },
    save() {
        localStorage.setItem("profileData", JSON.stringify({
            user: this.user,
            posts: this.posts
        }));
    },
    addPost(post) {
        this.posts.unshift(post);
        this.save();
    },
    deletePost(index) {
        this.posts.splice(index, 1);
        this.save();
    }
};


