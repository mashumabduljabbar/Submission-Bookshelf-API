	const { nanoid } = require('nanoid');
	const books = require('./books');

	const addBookHandler = (request, h) => {
	  const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	  } = request.payload;
	  const id = nanoid(16);
	  
	  let finished = false;
	  if (pageCount === readPage) {
		finished = true;
	  }

	  const insertedAt = new Date().toISOString();
	  const updatedAt = insertedAt;

	  if (name === undefined) {
		const response = h.response({
		  status: 'fail',
		  message: 'Gagal menambahkan buku. Mohon isi nama buku',
		});
		response.code(400);
		return response;
	  }

	  if (readPage > pageCount) {
		const response = h.response({
		  status: 'fail',
		  message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
		});
		response.code(400);
		return response;
	  }

	  const newBook = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		finished,
		reading,
		insertedAt,
		updatedAt,
	  };

	  books.push(newBook);

	  const isSuccess = books.filter((book) => book.id === id).length > 0;

	  if (isSuccess) {
		const response = h.response({
		  status: 'success',
		  message: 'Buku berhasil ditambahkan',
		  data: {
			bookId: id,
		  },
		});
		response.code(201);
		return response;
	  }

	  const response = h.response({
		status: 'fail',
		message: 'Buku gagal ditambahkan',
	  });
	  response.code(500);
	  return response;
	};

	const getAllBooksHandler = (request, h) => {
	  const {
		name,
		reading,
		finished,
	  } = request.query;

	  const nullQuery = name === undefined && reading === undefined && finished === undefined;
	  if (nullQuery) {
		const response = h.response({
		  status: 'success',
		  data: {
			books: books.map((book) => ({
			  id: book.id,
			  name: book.name,
			  publisher: book.publisher,
			})),
		  },
		});
		response.code(200);
		return response;
	  }

	  if (name) {
		const filteredBooksName = books.filter((book) => book.name.toLowerCase().indexOf(name.toLowerCase()) > -1);

		const response = h.response({
		  status: 'success',
		  data: {
			books: filteredBooksName.map((book) => ({
			  id: book.id,
			  name: book.name,
			  publisher: book.publisher,
			})),
		  },
		});

		response.code(200);
		return response;
	  }

	  if (reading) {
		const filteredBooksReading = books.filter(
		  (book) => Number(book.reading) === Number(reading),
		);

		const response = h.response({
		  status: 'success',
		  data: {
			books: filteredBooksReading.map((book) => ({
			  id: book.id,
			  name: book.name,
			  publisher: book.publisher,
			})),
		  },
		});

		response.code(200);
		return response;
	  }

	  if (finished) {
		const filteredBooksFinished = books.filter(
		  (book) => Number(book.finished) === Number(finished),
		);

		const response = h.response({
		  status: 'success',
		  data: {
			books: filteredBooksFinished.map((book) => ({
			  id: book.id,
			  name: book.name,
			  publisher: book.publisher,
			})),
		  },
		});

		response.code(200);
		return response;
	  }

	  const response = h.response({
		status: 'fail',
		message: 'Buku tidak ditemukan',
	  });
	  response.code(404);
	  return response;
	};

	const getBookByIdHandler = (request, h) => {
	  const { bookId } = request.params;
	  const book = books.filter((n) => n.id === bookId)[0];

	  if (book !== undefined) {
		return {
		  status: 'success',
		  data: {
			book,
		  },
		};
	  }

	  const response = h.response({
		status: 'fail',
		message: 'Buku tidak ditemukan',
	  });
	  response.code(404);
	  return response;
	};

	const editBookByIdHandler = (request, h) => {
	  const { bookId } = request.params;
	  const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	  } = request.payload;

	  if (name === undefined) {
		const response = h.response({
		  status: 'fail',
		  message: 'Gagal memperbarui buku. Mohon isi nama buku',
		});
		response.code(400);
		return response;
	  }

	  if (readPage > pageCount) {
		const response = h.response({
		  status: 'fail',
		  message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
		});
		response.code(400);
		return response;
	  }

	  let finished = false;
	  if (pageCount === readPage) {
		finished = true;
	  }
	  const insertedAt = new Date().toISOString();
	  const updatedAt = insertedAt;
	  const index = books.findIndex((book) => book.id === bookId);

	  if (index !== -1) {
		books[index] = {
		  ...books[index],
		  name,
		  year,
		  author,
		  summary,
		  publisher,
		  pageCount,
		  readPage,
		  finished,
		  reading,
		  insertedAt,
		  updatedAt,
		};

		const response = h.response({
		  status: 'success',
		  message: 'Buku berhasil diperbarui',
		});

		response.code(200);
		return response;
	  }

	  const response = h.response({
		status: 'fail',
		message: 'Gagal memperbarui buku. Id tidak ditemukan',
	  });
	  response.code(404);
	  return response;
	};

	const deleteBookByIdHandler = (request, h) => {
	  const { bookId } = request.params;
	  const index = books.findIndex((book) => book.id === bookId);

	  if (index !== -1) {
		books.splice(index, 1);
		const response = h.response({
		  status: 'success',
		  message: 'Buku berhasil dihapus',
		});
		response.code(200);
		return response;
	  }

	  const response = h.response({
		status: 'fail',
		message: 'Buku gagal dihapus. Id tidak ditemukan',
	  });
	  response.code(404);
	  return response;
	};

	module.exports = {
	  addBookHandler,
	  getAllBooksHandler,
	  getBookByIdHandler,
	  editBookByIdHandler,
	  deleteBookByIdHandler,
	};