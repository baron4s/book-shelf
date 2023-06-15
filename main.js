const books = [];
const RENDER_EVENT = new Event('render-book');
const STORAGE_KEY = 'bookshelf-apps';

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', (event) => {
    addBook();
    modalSubmit();
    event.preventDefault();
  });
});

function addBook() {
  const textTitle = document.getElementById('inputBookTitle').value;
  const textAuthor = document.getElementById('inputBookAuthor').value;
  const numberYear = document.getElementById('inputBookYear').value;
  const generateID = generateId();
  const completedBook = document.getElementById('inputBookIsComplete').checked;

  const booksObject = generateBookObject(generateID, textTitle, textAuthor, numberYear, completedBook);

  books.push(booksObject);
  document.dispatchEvent(RENDER_EVENT);
  saveData();
}

function generateId() {
  return Number(new Date());
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function makeBook(booksObject) {
  const textTitle = document.createElement('h3');
  textTitle.innerText = booksObject.title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = `Pengarang :${booksObject.author}`;

  const bookYear = document.createElement('p');
  bookYear.innerText = `Tahun :${booksObject.year}`;

  const article = document.createElement('article');
  article.classList.add('book_item');
  article.setAttribute('id', `${booksObject.id}`);

  article.append(textTitle, textAuthor, bookYear);

  if (booksObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('green');
    undoButton.innerText = 'Belum selesai dibaca';
    undoButton.addEventListener('click', () => {
      undoBookFromCompleted(booksObject.id);
    });

    const updateBook = document.createElement('button');
    updateBook.classList.add('blue');
    updateBook.innerText = 'Update buku';
    updateBook.addEventListener('click', function () {
      modalUpdateBook();
      const modalUpdate = document.querySelector('.wrapper');
      const bookId = this.closest('.book_item').id;
      const textTitle = document.getElementById('updateBookTitle');
      const textAuthor = document.getElementById('updateBookAuthor');
      const textYear = document.getElementById('updateBookYear');
      const isCompleted = document.getElementById('updateBookIsComplete');
      const bookItem = findBookData(Number(bookId));

      textTitle.value = bookItem.title;
      textAuthor.value = bookItem.author;
      textYear.value = bookItem.year;
      isCompleted.checked = bookItem.isCompleted;

      const updateBookForm = document.getElementById('updateBook');
      updateBookForm.addEventListener('submit', (e) => {
        modalUpdate.style.display = 'none';
        update(bookId);
        e.preventDefault();
      });
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('red');
    trashButton.innerText = 'Hapus buku';
    trashButton.addEventListener('click', () => {
      if (confirm('Anda yakin menghapus buku ini?')) {
        removeBookFromList(booksObject.id);
        modalRemove();
      }
    });

    const containerButton = document.createElement('div');
    containerButton.classList.add('action');
    containerButton.append(undoButton, updateBook, trashButton);
    article.append(containerButton);
  } else {
    const completedBookButton = document.createElement('button');
    completedBookButton.classList.add('green');
    completedBookButton.innerText = 'Selesai dibaca';
    completedBookButton.addEventListener('click', () => {
      completedRead(booksObject.id);
    });

    const updateBook = document.createElement('button');
    updateBook.classList.add('blue');
    updateBook.innerText = 'Update buku';
    updateBook.addEventListener('click', function () {
      modalUpdateBook();
      const modalUpdate = document.querySelector('.wrapper');
      const bookId = this.closest('.book_item').id;
      const textTitle = document.getElementById('updateBookTitle');
      const textAuthor = document.getElementById('updateBookAuthor');
      const textYear = document.getElementById('updateBookYear');
      const isCompleted = document.getElementById('updateBookIsComplete');
      const bookItem = findBookData(Number(bookId));

      textTitle.value = bookItem.title;
      textAuthor.value = bookItem.author;
      textYear.value = bookItem.year;
      isCompleted.checked = bookItem.isCompleted;

      const updateBookForm = document.getElementById('updateBook');
      updateBookForm.addEventListener('submit', (e) => {
        modalUpdate.style.display = 'none';
        update(bookId);
        e.preventDefault();
      });
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('red');
    trashButton.innerText = 'Hapus buku';
    trashButton.addEventListener('click', () => {
      if (confirm('Anda yakin menghapus buku ini?')) {
        removeBookFromList(booksObject.id);
        modalRemove();
      }
    });

    const containerButton = document.createElement('div');
    containerButton.classList.add('action');
    containerButton.append(completedBookButton, updateBook, trashButton);
    article.append(containerButton);
  }
  return article;
}

function completedRead(bookId) {
  const target = findBookData(bookId);
  target.isCompleted = true;
  document.dispatchEvent(RENDER_EVENT);
  saveData();
}

function undoBookFromCompleted(bookID) {
  const target = findBookData(bookID);
  target.isCompleted = false;
  document.dispatchEvent(RENDER_EVENT);
  saveData();
}

function removeBookFromList(bookId) {
  const target = findIndex(bookId);
  books.splice(target, 1);
  document.dispatchEvent(RENDER_EVENT);
  saveData();
}

function findIndex(bookId) {
  for (const index in books) {
    if (books[index].item == bookId) {
      return index;
    }
  }
  return -1;
}

function findBookData(bookID) {
  for (const bookItem of books) {
    if (bookItem.id == bookID) {
      return bookItem;
    }
  }
  return null;
}

function update(bookId) {
  const bookItem = findBookData(bookId);
  if (bookItem == null) return;

  const textTitle = document.getElementById('updateBookTitle').value;
  const textAuthor = document.getElementById('updateBookAuthor').value;
  const textYear = document.getElementById('updateBookYear').value;
  const isCompleted = document.getElementById('updateBookIsComplete').checked;

  bookItem.title = textTitle;
  bookItem.author = textAuthor;
  bookItem.year = textYear;
  bookItem.isCompleted = isCompleted;

  saveData();
  document.dispatchEvent(RENDER_EVENT);
}

function storage() {
  if (typeof Storage == undefined) {
    alert('Browser anda tidak mendukung web storage');
    return false;
  }
  return true;
}

function saveData() {
  if (storage()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(RENDER_EVENT);
  }
}

function loadLocalStorage() {
  const callData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(callData);

  if (data !== null) {
    for (const booksElement of data) {
      books.push(booksElement);
    }
  }

  document.dispatchEvent(RENDER_EVENT);
}

document.addEventListener('DOMContentLoaded', () => {
  if (storage()) {
    loadLocalStorage();
  }
});

const search = document.getElementById('searchBook');
search.addEventListener('submit', (e) => {
  searchCompatibilityBook();
  e.preventDefault();
});

function searchCompatibilityBook() {
  const textSearch = document.getElementById('searchBookTitle').value;
  const bookList = document.querySelectorAll('.book_item h3');
  for (const item of bookList) {
    if (item.innerText.toLowerCase() == textSearch.toLowerCase()) {
      item.parentElement.style.display = 'block';
    } else {
      alert('Buku tidak di temukan');
    }
  }
}

function modalSubmit() {
  const modal = document.getElementById('submitModal');
  modal.style.display = 'block';

  const close = document.getElementById('closeModalSubmit');
  close.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}
function modalRemove() {
  const modal = document.getElementById('removeModal');
  modal.style.display = 'block';

  const close = document.getElementById('closeModalRemove');
  close.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

function modalUpdateBook() {
  const modal = document.querySelector('.wrapper');
  modal.style.display = 'flex';
  const close = document.querySelector('.close');
  close.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

document.addEventListener('render-book', () => {
  const uncompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  uncompleteBookshelfList.innerHTML = '';
  const completeBookshelfList = document.getElementById('completeBookshelfList');
  completeBookshelfList.innerHTML = '';

  for (const bookshelfItem of books) {
    const bookElement = bookshelfItem;
    if (bookElement.isCompleted) {
      completeBookshelfList.append(makeBook(bookElement));
    } else {
      uncompleteBookshelfList.append(makeBook(bookElement));
    }
  }
});
