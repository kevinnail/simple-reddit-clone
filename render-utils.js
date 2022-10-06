export function renderPost(post) {
    console.log(post.category);
    const li = document.createElement('li');

    const h3 = document.createElement('h3');
    h3.textContent = post.title;

    const h32 = document.createElement('h3');
    h32.textContent = categoryEmoji(post.category);
    console.log('render ' + post.category);
    h32.classList.add('category');

    const img = document.createElement('img');

    img.classList.add('image-size');
    img.src = post.image_url;

    const p = document.createElement('p');
    p.textContent = post.description;

    const p2 = document.createElement('p');
    p2.textContent = 'Contact: ' + post.contact;
    p2.classList.add('contact-info');

    li.append(h3, h32, img, p, p2);
    return li;
}
function categoryEmoji(category) {
    if (category === 'dry-pieces') return 'Dry Pieces';
    if (category === 'bubblers') return 'Bubblers';
    if (category === 'recyclers') return 'Recyclers';
    if (category === 'slides') return 'Slides';
    if (category === 'marbles') return 'Marbles';
    if (category === 'goblets') return 'Goblets';
    if (category === 'misc') return 'Misc';
}
