from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///posts.db'
db = SQLAlchemy(app)


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text, nullable=False)


@app.route('/posts', methods=['GET', 'POST'])
def posts():
    if request.method == 'GET':
        search_query = request.args.get('q', '')
        if search_query:
            posts = Post.query.filter(
                (Post.title.contains(search_query)) | (Post.content.contains(search_query))
            ).all()
        else:
            posts = Post.query.all()
        return jsonify([{'id': post.id, 'title': post.title, 'content': post.content} for post in posts])
    elif request.method == 'POST':
        data = request.get_json()
        new_post = Post(title=data['title'], content=data['content'])
        db.session.add(new_post)
        db.session.commit()
        return jsonify({'message': 'Post created successfully!'})


@app.route('/posts/<int:post_id>', methods=['PUT', 'DELETE'])
def edit_delete_post(post_id):
    post = Post.query.get_or_404(post_id)

    if request.method == 'PUT':
        data = request.get_json()
        post.title = data['title']
        post.content = data['content']
        db.session.commit()
        return jsonify({'message': 'Post updated successfully!'})
    elif request.method == 'DELETE':
        db.session.delete(post)
        db.session.commit()
        return jsonify({'message': 'Post deleted successfully!'})


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
