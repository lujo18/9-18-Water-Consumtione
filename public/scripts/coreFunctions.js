function retrieve(item) {
    return JSON.parse(localStorage.getItem(item));
}

function store(item, value) {
    localStorage.setItem(item, JSON.stringify(value));
}