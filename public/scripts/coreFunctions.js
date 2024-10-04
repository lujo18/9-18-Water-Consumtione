function retrieve(item) {
    try {return JSON.parse(localStorage.getItem(item));}
    catch (e) {return null;}
}

function store(item, value) {
    localStorage.setItem(item, JSON.stringify(value));
}