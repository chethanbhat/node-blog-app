const express = require('express');
const router = express.Router();

// Controller

const blogController = require('../controllers/blogController');

// GET Blog Home Page
router.get('/', blogController.blog_list);

// GET Request for creating a Blog Post
router.get('/create', blogController.blog_create_get);

// POST Request for creating a Blog Post
router.post('/create', blogController.blog_create_post);

// GET Request for reading a Blog Post
router.get('/:id', blogController.blog_detail);

// GET Request for updating a Blog Post
router.get('/:id/update', blogController.blog_update_get);

// POST Request for updating a Blog Post
router.post('/:id/update', blogController.blog_update_post);

// GET Request for deleting a Blog Post
router.get('/:id/delete', blogController.blog_delete_get);

// POST Request for deleting a Blog Post
router.post('/:id/delete', blogController.blog_delete_post);

module.exports = router;