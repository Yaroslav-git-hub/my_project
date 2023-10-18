import React, { useState, useEffect } from 'react';

function App() {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: '', content: '' });
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/posts')
            .then(response => response.json())
            .then(data => setPosts(data));
    }, []);

    const handleAddPost = () => {
        if (selectedPost) {
            // Если выбран пост, обновляем его
            fetch(`http://127.0.0.1:5000/posts/${selectedPost.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPost),
            })
                .then(response => response.json())
                .then(() => {
                    setPosts(posts.map(post => (post.id === selectedPost.id ? newPost : post)));
                    setNewPost({ title: '', content: '' });
                    setSelectedPost(null);
                });
        } else {
            // Иначе, добавляем новый пост
            fetch('http://127.0.0.1:5000/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPost),
            })
                .then(response => response.json())
                .then(() => {
                    setPosts([...posts, newPost]);
                    setNewPost({ title: '', content: '' });
                });
        }
    };

    const handleEditPost = post => {
        setNewPost({ title: post.title, content: post.content });
        setSelectedPost(post);
    };

    const handleDeletePost = postId => {
        fetch(`http://127.0.0.1:5000/posts/${postId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(() => {
                setPosts(posts.filter(post => post.id !== postId));
            });
    };

    const handleSearch = searchTerm => {
        fetch(`http://127.0.0.1:5000/posts?q=${searchTerm}`)
            .then(response => response.json())
            .then(data => setPosts(data));
    };

    return (
        <div>
            <h1>Posts</h1>
            <div>
                <input
                    type="text"
                    placeholder="Search"
                    onChange={e => handleSearch(e.target.value)}
                />
            </div>
            <ul>
                {posts.map(post => (
                    <li key={post.id}>
                        <strong>{post.title}</strong>: {post.content}
                        <button onClick={() => handleEditPost(post)}>Edit</button>
                        <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <div>
                <h2>{selectedPost ? 'Edit Post' : 'Add a Post'}</h2>
                <label>Title:</label>
                <input
                    type="text"
                    value={newPost.title}
                    onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                />
                <label>Content:</label>
                <textarea
                    value={newPost.content}
                    onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                />
                <button onClick={handleAddPost}>{selectedPost ? 'Edit Post' : 'Add Post'}</button>
            </div>
        </div>
    );
}

export default App;
