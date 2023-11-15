const RENDER_EVENT = 'render-book';

function generateID() {
    return +new Date();
}

function generateBookObject(title, author, year, isCompleted) {
    return {
        id: generateID(),
        title,
        author,
        year: parseInt(year),
        isCompleted
    };
}

function addBookToLocalStorage(books) {
    localStorage.setItem('books', JSON.stringify(books));
}

function loadBooksFromLocalStorage() {
    const booksFromStorage = localStorage.getItem('books');
    if (booksFromStorage) {
        return JSON.parse(booksFromStorage);
    }
    return [];
}

const books = loadBooksFromLocalStorage();

function makeBook(bookObject) {
    const { id, title, author, year, isCompleted } = bookObject;

    const textTitle = document.createElement('h3');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis: ${author}`;

    const textYear = document.createElement('p');   
    textYear.innerText = `Tahun: ${year}`;

    const bookInfo = document.createElement('div');
    bookInfo.classList.add('inner');
    bookInfo.append(textTitle, textAuthor, textYear);

    const container = document.createElement('article');
    container.classList.add('book_item', 'shadow');
    container.append(bookInfo);

    const actionDiv = document.createElement('div');
    actionDiv.classList.add('action');

    if (isCompleted) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('yellow');
      undoButton.innerText = 'Jangan bang!';
      undoButton.addEventListener('click', function () {
        undoBook(id);
      });

      const removeButton = document.createElement('button');
      removeButton.classList.add('red');
      removeButton.innerText = 'otw backroom';
      removeButton.addEventListener('click', function () {
        removeBook(id);
      });

      actionDiv.append(undoButton, removeButton);
    } else {
      const completeButton = document.createElement('button');
      completeButton.classList.add('green');
      completeButton.innerText = 'Sampun mas';
      completeButton.addEventListener('click', function () {
        addBookToCompleted(id);
      });

      const removeButton = document.createElement('button');
      removeButton.classList.add('red');
      removeButton.innerText = 'otw backroom';
      removeButton.addEventListener('click', function () {
        removeBook(id);
      });
  
      actionDiv.append(completeButton, removeButton);
    }
    container.append(actionDiv);
    return container;
}

function addBook() {
    const titleInput = document.getElementById('inputBookTitle').value;
    const authorInput = document.getElementById('inputBookAuthor').value;
    const yearInput = document.getElementById('inputBookYear').value;
    const isCompletedInput = document.getElementById('inputBookIsComplete').checked;

    const bookObject = generateBookObject(titleInput, authorInput, yearInput, isCompletedInput);
    books.push(bookObject);

    addBookToLocalStorage(books);

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBookToCompleted(bookId) {
    const bookIndex = findBookIndex(bookId);
    if (bookIndex !== -1) {
        books[bookIndex].isCompleted = true;
        addBookToLocalStorage(books);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

}

function removeBook(bookId) {
    const bookIndex = findBookIndex(bookId);
    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        addBookToLocalStorage(books);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

function undoBook(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex !== -1) {
       books[bookIndex].isCompleted = false;
      addBookToLocalStorage(books);
      document.dispatchEvent(new Event(RENDER_EVENT));
  }
}


function findBookIndex(bookId) {
    for (let i = 0; i < books.length; i++) {
        if (books[i].id === bookId) {
            return i;
        }
    }
    return -1;
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    document.dispatchEvent(new Event(RENDER_EVENT));
});

document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');

    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    for (const bookItem of books) {
         const bookElement = makeBook(bookItem);

        if (bookItem.isCompleted) {
            completeBookshelfList.appendChild(bookElement);
        } else {
            incompleteBookshelfList.appendChild(bookElement);
        }
    }
});
