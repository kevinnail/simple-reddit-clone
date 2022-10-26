// import { getProfile } from './fetch-utils.js';

export function renderPost(post) {
    const li = document.createElement('li');

    const a = document.createElement('a');
    a.href = `/post/?id=${post.id}`;

    const h3 = document.createElement('h3');
    h3.textContent = post.title;
    h3.classList.add('heading');

    const h32 = document.createElement('h3');
    h32.textContent = categoryEmoji(post.category);
    h32.classList.add('category');

    const img = document.createElement('img');

    img.classList.add('image-size');
    img.src = post.image_url;

    const p = document.createElement('p');
    p.textContent = post.description;

    const p2 = document.createElement('p');
    p2.textContent = 'Contact: ' + post.contact;
    p2.classList.add('contact-info');

    a.append(h3, h32, img, p, p2);
    li.append(a);
    return li;
}
function categoryEmoji(category) {
    if (category === 'Dry-pieces') return 'Dry Pieces';
    if (category === 'Bubblers') return 'Bubblers';
    if (category === 'Recyclers') return 'Recyclers';
    if (category === 'Slides') return 'Slides';
    if (category === 'Marbles') return 'Marbles';
    if (category === 'Goblets') return 'Goblets';
    if (category === 'Misc') return 'Misc';
}

export function renderComment(comment) {
    const li = document.createElement('li');
    li.classList.add('flex-comment');

    // li.textContent = comment.text;
    // ^^^^^^^^^^^ works
    const div = document.createElement('div');
    div.classList.add('comment-span');

    const p = document.createElement('p');
    p.textContent = comment.text;
    // div.textContent = comment.text;

    div.append(p);

    const span2 = document.createElement('div');
    span2.classList.add('date-span');
    span2.textContent = '   posted by ' + comment.username + ' at ' + comment.time;

    div.append(span2);
    li.append(div);

    // const btn = document.createElement('button');
    // btn.textContent = 'delete';
    // btn.classList.add('delete-cmt-btn');
    // btn.addEventListener('click', async () => {
    //     const response = await deleteComment(comment.id);
    //     error = response.error;
    //     if (error) {
    //         displayError();
    //     } else {
    //         const index = comments.indexOf(comment);
    //         comments.splice(index, 1);
    //         displayComments();
    //     }
    // });
    // li.append(btn);

    return li;
}
